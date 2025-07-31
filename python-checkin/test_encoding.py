import face_recognition
import cv2

image_bgr = cv2.imread("known_faces/obama.jpg")

if image_bgr is None:
    print("❌ Kunde inte läsa bilden.")
    exit()

image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB).copy()
print(f"🔍 Bild OK: dtype={image_rgb.dtype}, shape={image_rgb.shape}")

try:
    encodings = face_recognition.face_encodings(image_rgb)
    print(f"✅ Antal ansikten hittade: {len(encodings)}")
except Exception as e:
    print(f"❌ Fel vid kodning: {e}")
