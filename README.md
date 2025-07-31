# ✅ Checkin-app

## 📁 Struktur

```
checkin-app/
├── backend/             ← Node.js (API + SQLite)
├── python-checkin/      ← Python (kamera + ansiktsigenkänning)
└── known_faces_fixed/   ← Ansiktsbilder (t.ex. Danish.png)
```

---

## ⚙️ Krav

* Node.js (v18+)
* Python 3.10+
* Virtuell miljö (`venv`)
* Git (valfritt)
* En webbkamera
* SQLite3 (installeras automatiskt)

---

## 🟩 1. Starta backend (Node.js + SQLite API)

### Steg 1 – Gå till backend-mappen:

```bash
cd C:\checkin-app\backend
```

### Steg 2 – Installera beroenden:

```bash
npm install
```

Om du får fel som `Cannot find module 'sqlite3'`, kör:

```bash
npm install sqlite3
```

### Steg 3 – Starta backend-servern:

```bash
node server.js
```

Du ska se detta:

```
🚀 Backend-server körs på http://localhost:8000
```

---

## 🗭 2. Starta Python-ansiktsigenkänning (med kamera)

### Steg 1 – Gå till Python-projektet:

```bash
cd C:\checkin-app\python-checkin
```

### Steg 2 – Aktivera virtuell miljö:

```bash
venv310\Scripts\activate
```

Du vet att du är i rätt miljö om det står t.ex.:

```
(venv310) PS C:\checkin-app\python-checkin>
```

### Steg 3 – Starta kamera och ansiktsigenkänning:

```bash
python main.py
```

Om allt fungerar ser du något sånt här:

```
✅ Laddat ansikte: Danish.png
✅ Kameran är igång. Tryck 'q' för att avsluta.
🆔 Identifierad: Danish – 2025-07-30T13:42:01
🟢 API-respons: 200
```

---

## 🔎 3. Testa API\:t

Öppna i webbläsaren eller Thunder Client/Postman:

```
GET http://localhost:8000/api/checkin
```

Svar om allt fungerar:

```json
[
  {
    "id": 1,
    "name": "Danish",
    "timestamp": "2025-07-30T13:42:01"
  }
]
```

---

## 📸 4. Lägg till fler personer

Lägg bilder i:

```
C:\checkin-app\python-checkin\known_faces_fixed\
```

Krav:

* Format: `.jpg`, `.jpeg`, `.png`
* Endast ett ansikte per bild
* Bilden ska vara tydlig och i färg

---

## 🔧 Vanliga problem

| Problem                                    | Lösning                                                                             |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| `Unsupported image type, must be 8bit RGB` | Du har troligen fel version av `face_recognition`. Nedgradera till `1.3.0`          |
| `Kunde inte öppna kameran`                 | Se till att kameran inte används av Zoom, Teams etc.                                |
| `Cannot GET /api/checkin`                  | Du försöker gå till API\:t i webbläsare. Använd GET i Postman eller Thunder Client. |
| `Cannot find module 'sqlite3'`             | Kör `npm install sqlite3` i backend-mappen.                                         |

---
