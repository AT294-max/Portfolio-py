"""
server.py — Portfolio Backend API (Python + Flask)

Endpoints:
  GET  /api/health       → health check
  GET  /api/projects     → all projects
  GET  /api/projects/<id>→ single project
  POST /api/contact      → contact form
  GET  /api/messages     → view received messages

Run:
  pip install flask flask-cors
  python server.py
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from datetime import datetime
import os, re

app = Flask(__name__, static_folder="public", static_url_path="")
CORS(app)  # Allow frontend to talk to backend

# ── In-memory message store (use a DB in production) ─────────
messages = []

# ── Project data ─────────────────────────────────────────────
PROJECTS = [
    {
        "id": 1,
        "title": "Portfolio Website",
        "emoji": "🌐",
        "description": "My personal portfolio website showcasing projects, skills, and contact information.",
        "tags": ["HTML", "CSS", "JavaScript", "Flask"],
        "liveUrl": "#",
        "githubUrl": "https://github.com/AT294-max/Portfolio-py"
    },
     {
        "id": 2,
        "title": "Project Advisors Hub",
        "emoji": "🎓",
        "description": "A desktop application developed in C# Windows Forms with SQL Server for managing student projects, advisors, project allocations, and academic records.",
        "tags": ["C#", "WinForms", "SQL Server", "DBMS"],
        "liveUrl": "#",
        "githubUrl": "https://github.com/AT294-max"
    },
   
   
]


# ─────────────────────────────────────────────────────────────
#  ROUTES
# ─────────────────────────────────────────────────────────────

# Serve frontend
@app.route("/")
def index():
    return send_from_directory("public", "index.html")


# Health check
@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})


# GET all projects (optional ?tag= filter)
@app.get("/api/projects")
def get_projects():
    tag = request.args.get("tag", "").lower()
    result = PROJECTS
    if tag:
        result = [p for p in PROJECTS if any(t.lower() == tag for t in p["tags"])]
    return jsonify(result)


# GET single project
@app.get("/api/projects/<int:project_id>")
def get_project(project_id):
    project = next((p for p in PROJECTS if p["id"] == project_id), None)
    if not project:
        return jsonify({"error": "Project not found."}), 404
    return jsonify(project)


# POST contact form
@app.post("/api/contact")
def contact():
    data = request.get_json(silent=True) or {}

    name    = str(data.get("name",    "")).strip()
    email   = str(data.get("email",   "")).strip().lower()
    message = str(data.get("message", "")).strip()

    # Validation
    errors = []
    if len(name) < 2:
        errors.append("Name must be at least 2 characters.")
    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        errors.append("Valid email is required.")
    if len(message) < 10:
        errors.append("Message must be at least 10 characters.")

    if errors:
        return jsonify({"error": " ".join(errors)}), 422

    entry = {
        "id":         len(messages) + 1,
        "name":       name,
        "email":      email,
        "message":    message,
        "receivedAt": datetime.now().isoformat(),
    }
    messages.append(entry)

    print(f"\n📬 New message from {entry['name']} <{entry['email']}>")
    print(f"   \"{entry['message'][:80]}\"")
    print(f"   Saved as message #{entry['id']}\n")

    return jsonify({
        "success": True,
        "message": "Thank you! Your message has been received.",
        "id":      entry["id"],
    }), 201


# GET all messages (add auth in production!)
@app.get("/api/messages")
def get_messages():
    return jsonify({"count": len(messages), "messages": messages})


# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n  ✅  Portfolio Python server running!")
    print("  🌐  Open:  http://localhost:5000")
    print("  📡  API:   http://localhost:5000/api/health")
    print("\n  Routes:")
    print("    GET  /api/health")
    print("    GET  /api/projects")
    print("    GET  /api/projects/<id>")
    print("    POST /api/contact")
    print("    GET  /api/messages\n")
    app.run(debug=True, port=5000)
