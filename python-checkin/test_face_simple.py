import face_recognition
import cv2
import numpy as np

# Läs in bilden med OpenCV
image_bgr = cv2.imread("known_faces/Danish_converted.jpg")

# Kontrollera att den lästs in korrekt
if image_bgr is None:
    print("❌ Kunde inte läsa bilden.")
    exit()

# Konvertera till RGB
image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

# Gör arrayen contiguous i minnet
image_rgb = np.ascontiguousarray(image_rgb)

# Försök extrahera ansiktskännetecken
try:
    encodings = face_recognition.face_encodings(image_rgb)
    if encodings:
        print("✅ Ansikte identifierat!")
    else:
        print("⚠️ Ingen ansiktsdata hittad.")
except Exception as e:
    print(f"❌ Fel: {e}")
