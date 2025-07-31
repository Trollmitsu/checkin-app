import cv2
import face_recognition
import numpy as np

print("🔍 Läser in testbild...")

image_path = "known_faces_fixed/Danish.png"  # Ändra om du vill testa annan bild
image = cv2.imread(image_path)

if image is None:
    print("❌ Bilden kunde inte läsas (None). Kontrollera sökvägen.")
    exit()

print(f"📊 dtype: {image.dtype}, shape: {image.shape}, contiguous: {image.flags['C_CONTIGUOUS']}")

# Konvertera till RGB för face_recognition
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

print("⚙️ Försöker få encodings...")

try:
    encodings = face_recognition.face_encodings(image_rgb)
    if encodings:
        print("✅ Encoding lyckades!")
    else:
        print("⚠️ Ingen encoding hittades – kanske inget ansikte i bilden?")
except Exception as e:
    print(f"❌ FEL: {e}")
