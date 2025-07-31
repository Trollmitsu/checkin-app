from PIL import Image
import numpy as np
import face_recognition

print("🔍 Läser in testbild...")

# Ladda via PIL
image_path = "known_faces_fixed/Danish.png"
try:
    pil_image = Image.open(image_path).convert("RGB")
except Exception as e:
    print(f"❌ Kunde inte öppna bilden: {e}")
    exit()

# Konvertera till NumPy-array och tvinga contiguous
image_np = np.array(pil_image).copy()

print(f"📊 dtype: {image_np.dtype}, shape: {image_np.shape}, contiguous: {image_np.flags['C_CONTIGUOUS']}")

# Försök face_encoding
try:
    encodings = face_recognition.face_encodings(image_np)
    if encodings:
        print("✅ Encoding lyckades!")
    else:
        print("⚠️ Ingen encoding hittades – inget ansikte?")
except Exception as e:
    print(f"❌ FEL: {e}")
