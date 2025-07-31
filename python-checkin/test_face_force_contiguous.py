import face_recognition
import numpy as np
from PIL import Image

print("🔎 Laddar och konverterar bild...")

try:
    image = Image.open("known_faces/obama.jpg").convert("RGB")
    image_np = np.array(image)

    print(f"📊 Före: dtype={image_np.dtype}, shape={image_np.shape}, contiguous={image_np.flags['C_CONTIGUOUS']}")

    # Forcera C-contiguous array
    image_np = np.ascontiguousarray(image_np)

    print(f"📊 Efter: dtype={image_np.dtype}, shape={image_np.shape}, contiguous={image_np.flags['C_CONTIGUOUS']}")

    encodings = face_recognition.face_encodings(image_np)

    if encodings:
        print("✅ Ansikte identifierat!")
    else:
        print("❌ Inget ansikte hittades.")
except Exception as e:
    print("❌ Fel:", e)
