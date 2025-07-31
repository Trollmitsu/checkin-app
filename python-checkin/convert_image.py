from PIL import Image
import os

source_path = "known_faces/Danish.png"  # byt till din bild
output_path = "known_faces/Danish_converted.jpg"

try:
    img = Image.open(source_path)
    print(f"🔍 Ursprungligt läge: mode = {img.mode}")

    # Konvertera till RGB om det behövs
    if img.mode != "RGB":
        img = img.convert("RGB")
        print("✅ Konverterat till RGB.")

    img.save(output_path, format="JPEG")
    print(f"💾 Sparat ny bild som: {output_path}")
except Exception as e:
    print("❌ Fel vid konvertering:", str(e))
