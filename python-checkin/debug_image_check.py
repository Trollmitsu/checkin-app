from PIL import Image
import numpy as np
import face_recognition

path = "known_faces/Danish_converted.jpg"  # ändra vid behov

try:
    # Läs in bilden med PIL
    img = Image.open(path)
    print(f"🖼️ PIL Image mode: {img.mode}")

    # Konvertera till RGB om inte redan
    if img.mode != "RGB":
        img = img.convert("RGB")
        print("✅ Konverterade bilden till RGB")

    # Konvertera till NumPy-array
    img_np = np.array(img)
    print(f"📊 numpy dtype: {img_np.dtype}, shape: {img_np.shape}")

    # Försök face recognition
    encodings = face_recognition.face_encodings(img_np)
    print(f"✅ Hittade {len(encodings)} ansikten")

except Exception as e:
    print("❌ FEL:", str(e))
