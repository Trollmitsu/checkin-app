import face_recognition
import cv2
import os
import numpy as np
import requests
from datetime import datetime

print("🔄 Laddar kända ansikten...")

known_encodings = []
known_names = []

for filename in os.listdir("known_faces"):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
        path = os.path.join("known_faces", filename)
        image_bgr = cv2.imread(path)

        if image_bgr is None:
            print(f"❌ Kunde inte läsa: {filename}")
            continue

        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

        try:
            encodings = face_recognition.face_encodings(image_rgb)
            if encodings:
                known_encodings.append(encodings[0])
                known_names.append(os.path.splitext(filename)[0])
                print(f"✅ Laddat ansikte: {filename}")
            else:
                print(f"❌ Inget ansikte hittades i: {filename}")
        except Exception as e:
            print(f"❌ Fel i face_encodings för {filename}: {e}")

if not known_encodings:
    print("❗ Inga kända ansikten laddade. Avslutar.")
    exit()

video_capture = cv2.VideoCapture(0)
print("🎥 Kameran är igång. Tryck Q för att avsluta.")

while True:
    ret, frame = video_capture.read()
    if not ret:
        continue

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    locations = face_recognition.face_locations(rgb_frame)
    encodings = face_recognition.face_encodings(rgb_frame, locations)

    for encoding in encodings:
        matches = face_recognition.compare_faces(known_encodings, encoding)
        face_distances = face_recognition.face_distance(known_encodings, encoding)
        best_match_index = np.argmin(face_distances)

        if matches[best_match_index]:
            name = known_names[best_match_index]
            print(f"📌 Incheckad: {name}")

            try:
                response = requests.post("http://host.docker.internal:8000/api/checkin", json={
                    "name": name,
                    "timestamp": datetime.now().isoformat()
                })
                print("🟢 API-respons:", response.status_code)
            except Exception as e:
                print("❌ Kunde inte skicka till backend:", e)

    cv2.imshow('Checkin Kamera', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
