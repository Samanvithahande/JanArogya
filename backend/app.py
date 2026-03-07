from flask import Flask, request, send_file
from ultralytics import YOLO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = YOLO("best.pt")

@app.route("/predict", methods=["POST"])
def predict():

    file = request.files["image"]
    filepath = "temp.jpg"
    file.save(filepath)

    results = model(filepath)

    annotated = results[0].plot()

    output_path = "output.jpg"
    import cv2
    cv2.imwrite(output_path, annotated)

    return send_file(output_path, mimetype="image/jpeg")

if __name__ == "__main__":
    app.run(port=5000, debug=True)