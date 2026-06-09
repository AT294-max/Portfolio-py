# 🐍 Portfolio Website — Python + Flask Backend

A personal portfolio with a **Python Flask** backend API.

---

## 📁 Project Structure

```
portfolio-py/
├── server.py          ← Python Flask backend (THE MAIN FILE)
├── requirements.txt   ← Python packages needed
├── README.md
└── public/
    ├── index.html     ← Frontend HTML
    ├── style.css      ← All styles
    └── main.js        ← Frontend JS (calls Python API)
```

---

## 🚀 How to Run in VS Code

### Step 1 — Make sure Python is installed
Open terminal and check:
```
python --version
```
You need Python 3.8+. Download from https://python.org if needed.

### Step 2 — Open folder in VS Code
```
File → Open Folder → select the `portfolio-py` folder
```

### Step 3 — Open terminal in VS Code
```
Terminal → New Terminal   (or Ctrl + `)
```

### Step 4 — Install Python packages
```bash
pip install flask flask-cors
```
Or use the requirements file:
```bash
pip install -r requirements.txt
```

### Step 5 — Run the server
```bash
python server.py
```

You'll see:
```
  ✅  Portfolio Python server running!
  🌐  Open:  http://localhost:5000
  📡  API:   http://localhost:5000/api/health
```

### Step 6 — Open in browser
Visit **http://localhost:5000**

---

## 📡 API Endpoints

| Method | Route                | Description                  |
|--------|----------------------|------------------------------|
| GET    | /api/health          | Server health check          |
| GET    | /api/projects        | All projects (JSON)          |
| GET    | /api/projects/<id>   | Single project by ID         |
| POST   | /api/contact         | Submit contact form message  |
| GET    | /api/messages        | View all received messages   |

### POST /api/contact — Request Body
```json
{
  "name":    "Jane Smith",
  "email":   "jane@example.com",
  "message": "I'd love to collaborate!"
}
```

### Success Response (201)
```json
{
  "success": true,
  "message": "Thank you! Your message has been received.",
  "id": 1
}
```

### Validation Error (422)
```json
{
  "error": "Valid email is required."
}
```

---

## ✏️ Customise It

- **Your name/bio** → edit `public/index.html` (search "Alex Carter")
- **Your projects** → edit the `PROJECTS` list in `server.py`
- **Colors** → edit CSS variables at top of `public/style.css`
- **Add email sending** → install `flask-mail` and add to the `/api/contact` route

---

## 💡 Troubleshooting

**`pip` not found?**
Try `pip3` instead:
```bash
pip3 install flask flask-cors
```

**Port 5000 already in use?**
Change the port in `server.py` last line:
```python
app.run(debug=True, port=8000)
```
Then update `API` in `public/main.js` to `http://localhost:8000/api`
