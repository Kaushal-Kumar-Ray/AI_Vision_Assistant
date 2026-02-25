from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "..",
    "dataset",
    "raw_images"
)

CLASSES = [
    "bag","bicycle","bottle","car","chair",
    "door","person","phone","stairs","table"
]


@app.route("/")
def home():
    return render_template("collector.html", classes=CLASSES)


@app.route("/capture", methods=["POST"])
def capture():

    label = request.form.get("label")
    image = request.files.get("image")

    if label not in CLASSES:
        return jsonify({"status":"invalid"})

    save_dir = os.path.join(DATASET_PATH, label)
    os.makedirs(save_dir, exist_ok=True)

    count = len(os.listdir(save_dir))
    filename = f"{label}_{count+1}.jpg"

    save_path = os.path.join(save_dir, filename)

    image.save(save_path)

    print("✅ Saved:", save_path)

    return jsonify({"status":"saved"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)