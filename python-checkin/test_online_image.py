import face_recognition
import numpy as np
from PIL import Image
import requests
from io import BytesIO

print("🧪 Laddar testbild från webben...")

try:
    url = "https://raw.githubusercontent.com/ageitgey/face_recognition/master/examples/obama.jpg"
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))

    print(f"🎨 Läge: {img.mode}")
    if img.mode != "RGB":
        img = img.convert("RGB")

    img_np = np.array(img)
    print(f"📊 numpy shape: {img_np.shape}, dtype: {img_np.dtype}")

    encodings = face_recognition.face_encodings(img_np)
    print(f"✅ Hittade {len(encodings)} ansikten")
except Exception as e:
    print("❌ FEL:", str(e))
