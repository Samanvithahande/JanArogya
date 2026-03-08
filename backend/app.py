from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

# -----------------------
# Load environment vars
# -----------------------
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
AVAILABLE_MODELS = []

# -----------------------
# Configure Gemini (guarded)
# -----------------------
llm = None
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        llm = genai.GenerativeModel(GEMINI_MODEL)
    except Exception as e:
        print("Warning: failed to initialize Gemini LLM:", e)
        # Try to list available models to help diagnose configuration issues
        try:
            models = genai.list_models()
            # models may be an iterable of objects or dicts; try to extract names
            AVAILABLE_MODELS = [getattr(m, 'name', None) or m.get('name') if isinstance(m, dict) else None for m in models]
            AVAILABLE_MODELS = [m for m in AVAILABLE_MODELS if m]
            print("Available models:", AVAILABLE_MODELS[:20])
        except Exception as e2:
            print("Could not list Gemini models:", e2)
        llm = None

# -----------------------
# Flask app
# -----------------------
app = Flask(__name__)
CORS(app)

# -----------------------
# Load YOLO model
# -----------------------
model = YOLO("best.pt")


# -----------------------
# Gemini triage function
# -----------------------
def get_triage_from_llm(confidence, box):

    prompt = f"""
You are an emergency trauma triage assistant.

An AI wound detection model detected a wound.

Detection Data:
Confidence: {confidence}
Bounding box: {box}

Based on this information generate a trauma triage response.

Return STRICT JSON format:

{{
 "severity_score": number from 1-10,
 "urgency": "LOW URGENCY | MEDIUM URGENCY | HIGH URGENCY",
 "diagnosis": "...",
 "actions": ["...", "..."],
 "equipment": ["...", "..."]
}}

Return JSON only.
"""

    # If LLM isn't available, return a safe fallback triage
    if llm is None:
        return {
            "severity_score": 0,
            "urgency": "UNKNOWN",
            "diagnosis": "LLM unavailable - using fallback assessment",
            "actions": [],
            "equipment": [],
            "llm_error": "LLM not initialized or configured correctly",
            "available_models": AVAILABLE_MODELS[:20]
        }

    try:
        response = llm.generate_content(prompt)
        text = response.text.strip()
        text = text.replace("```json", "").replace("```", "")
        return json.loads(text)
    except Exception as e:
        print("LLM call failed:", e)
        # try to gather models to help debugging
        try:
            models = genai.list_models()
            AVAILABLE_MODELS = [getattr(m, 'name', None) or m.get('name') if isinstance(m, dict) else None for m in models]
            AVAILABLE_MODELS = [m for m in AVAILABLE_MODELS if m]
        except Exception:
            pass
        return {
            "severity_score": 0,
            "urgency": "UNKNOWN",
            "diagnosis": "LLM error - using fallback assessment",
            "actions": [],
            "equipment": [],
            "llm_error": str(e),
            "available_models": AVAILABLE_MODELS[:20]
        }


# -----------------------
# Prediction API
# -----------------------
@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    filepath = "temp.jpg"
    file.save(filepath)

    results = model(filepath)

    boxes = results[0].boxes.xyxy.tolist()
    confidence = results[0].boxes.conf.tolist()

    if len(confidence) > 0:

        triage = get_triage_from_llm(
            confidence[0],
            boxes[0]
        )

        return jsonify({
            "boxes": boxes,
            "confidence": confidence,
            **triage
        })

    else:
        return jsonify({
            "boxes": [],
            "confidence": [],
            "severity_score": 0,
            "urgency": "NO WOUND DETECTED",
            "diagnosis": "No visible trauma detected",
            "actions": [],
            "equipment": []
        })

@app.route("/rxvox", methods=["POST"])
def rxvox():
    import os
    import json
    import google.generativeai as genai

    try:
        file = request.files.get("image")
        if not file:
            return jsonify({"error": "No image uploaded"}), 400

        filepath = "prescription.jpg"
        file.save(filepath)

        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

        model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        model = genai.GenerativeModel(model_name)

        prompt = """
You are a medical prescription interpreter.

Analyze the prescription image and extract all medicines.

If handwriting is unclear, infer the most probable medicine name from common prescriptions.

Return STRICT JSON only.

Format:

[
 {
  "name": "",
  "dosage": "",
  "frequency": "",
  "duration": "",
  "instructions": ""
 }
]

Rules:
- Detect all medicines
- Convert handwriting to proper medicine names
- Normalize frequency like "3 times daily"
- Normalize dosage like "500mg"
- Return JSON only
"""

        try:
            response = model.generate_content([
                prompt,
                {"mime_type": "image/jpeg", "data": open(filepath, "rb").read()}
            ])

            text = response.text.replace("```json", "").replace("```", "")

            try:
                medicines = json.loads(text)
            except Exception:
                medicines = []

            return jsonify({"medicines": medicines})

        except Exception as e:
            print("LLM generate_content failed:", e)
            return jsonify({"error": "LLM generate_content failed", "details": str(e)}), 500

    except Exception as e:
        print("rxvox handler failed:", e)
        return jsonify({"error": "server error", "details": str(e)}), 500

# -----------------------
# Run server
# -----------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)