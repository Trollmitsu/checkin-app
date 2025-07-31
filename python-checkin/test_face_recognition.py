import face_recognition

print("🧪 Testar face_recognition...")

try:
    image = face_recognition.load_image_file("known_faces/Danish_converted.jpg")
  # byt till rätt bild om du har en annan
    encodings = face_recognition.face_encodings(image)

    if encodings:
        print("✅ Ansikte identifierat i bilden!")
    else:
        print("❌ Inget ansikte hittades i bilden.")
except Exception as e:
    print("❌ Något gick fel:", str(e))
