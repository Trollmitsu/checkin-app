import dlib
import cv2

image = cv2.imread("known_faces/obama.jpg")

if image is None:
    print("❌ Kunde inte läsa bilden.")
    exit()

if len(image.shape) == 3 and image.shape[2] == 3:
    print("✅ Bild är i BGR-format")
else:
    print("❌ Felaktigt format")

rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

detector = dlib.get_frontal_face_detector()
faces = detector(rgb_image, 1)

print(f"🧠 Antal ansikten hittade: {len(faces)}")
