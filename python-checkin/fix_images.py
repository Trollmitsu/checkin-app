import os
from PIL import Image

KNOWN_FACES_DIR = "known_faces"
OUTPUT_DIR = "known_faces_fixed"

os.makedirs(OUTPUT_DIR, exist_ok=True)

for filename in os.listdir(KNOWN_FACES_DIR):
    if filename.lower().endswith((".png", ".jpg", ".jpeg")):
        input_path = os.path.join(KNOWN_FACES_DIR, filename)
        output_path = os.path.join(OUTPUT_DIR, filename)

        try:
            with Image.open(input_path) as img:
                rgb_img = img.convert("RGB")
                rgb_img.save(output_path, format="JPEG")
                print(f"✅ Sparade om: {filename}")
        except Exception as e:
            print(f"❌ Kunde inte bearbeta {filename}: {e}")
