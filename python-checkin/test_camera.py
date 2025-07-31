import cv2

print("🔍 Försöker öppna kameran...")
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("❌ Kunde inte öppna kameran.")
else:
    print("✅ Kameran är öppen! Visar en ruta.")
    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Kunde inte läsa bild från kameran.")
            break

        cv2.imshow("Kamera", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
