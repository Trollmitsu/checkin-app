import cv2
import os

image_path = "known_faces/obama.jpg"

print(f"🔎 Försöker läsa: {os.path.abspath(image_path)}")

img = cv2.imread(image_path)

if img is None:
    print("❌ Bilden kunde inte laddas! Kontrollera sökväg och filnamn.")
else:
    print("✅ Bilden laddades.")
    print("🔍 Typ:", img.dtype)
    print("🔍 Shape:", img.shape)
    print("🔍 Antal kanaler:", img.shape[2] if len(img.shape) == 3 else "Grayscale eller fel")
    cv2.imwrite("known_faces/obama_fixed.jpg", img)
    print("💾 Bild sparad som obama_fixed.jpg")
