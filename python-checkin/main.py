# main.py
import os
import cv2
import face_recognition
import numpy as np
from PIL import Image
import requests
from datetime import datetime
import time

# --- Inställningar ---
KNOWN_FACES_DIR = "known_faces_fixed"
API_URL         = "http://localhost:8000/api/checkin"
TOLERANCE       = 0.45         # Strängare gräns (mindre felmatchningar)
MODEL           = "hog"        # Du kan byta till "cnn" om du har GPU

print("🔄 Laddar kända ansikten...")

known_encodings = []
known_names     = []

# Ladda och enkoda alla referensbilder
for filename in os.listdir(KNOWN_FACES_DIR):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        path = os.path.join(KNOWN_FACES_DIR, filename)
        print(f"🔍 Läser in: {filename}")
        pil = Image.open(path).convert("RGB")
        img = np.array(pil).copy()
        encs = face_recognition.face_encodings(img)
        if encs:
            known_encodings.append(encs[0])
            known_names.append(os.path.splitext(filename)[0])
            print(f"✅ Laddat ansikte: {filename}")
        else:
            print(f"⚠️ Inget ansikte hittades i: {filename}")

if not known_encodings:
    print("❗ Inga kända ansikten laddade. Avslutar.")
    exit()

# Starta kameran
print("🔍 Försöker öppna kameran...")
cap = cv2.VideoCapture(0)
time.sleep(2)  # Låt kameran hinna starta
if not cap.isOpened():
    print("❌ Kunde inte öppna kameran.")
    exit()

print("🟢 Kameran är igång. Tryck 'q' för att avsluta.")

while True:
    ret, frame = cap.read()
    if not ret:
        continue

    # Konvertera BGR → RGB
    rgb_frame = frame[:, :, ::-1]

    # Hitta alla ansikten och deras encodings
    locations = face_recognition.face_locations(rgb_frame, model=MODEL)
    encodings = face_recognition.face_encodings(rgb_frame, locations)

    for enc, loc in zip(encodings, locations):
        # Beräkna avstånd till samtliga kända ansikten
        distances = face_recognition.face_distance(known_encodings, enc)
        min_distance = np.min(distances)

        if min_distance < TOLERANCE:
            best_match_index = int(np.argmin(distances))
            name = known_names[best_match_index]
            timestamp = datetime.now().isoformat()
            print(f"🆔 Identifierad: {name} – {timestamp}")

            # Rita ram och namn på bilden
            top, right, bottom, left = loc
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.rectangle(frame, (left, bottom), (right, bottom + 20), (0, 255, 0), cv2.FILLED)
            cv2.putText(frame, name, (left + 5, bottom + 15),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

            # Skicka incheckningen till backend
            try:
                resp = requests.post(API_URL, json={"name": name, "timestamp": timestamp})
                print("🟢 API-respons:", resp.status_code)
            except Exception as e:
                print("❌ API-fel:", e)

    # Visa resultatet
    cv2.imshow("Face Recognition", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
