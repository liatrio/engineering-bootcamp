"""Frontend web service for the simple task list system.

Renders an HTML UI and talks to the backend API over HTTP. This is the
"presentation" layer — it has no direct access to the database.
"""
import os

import requests
from flask import Flask, redirect, render_template, request, url_for

app = Flask(__name__)

BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:5001")


@app.get("/")
def index():
    response = requests.get(f"{BACKEND_URL}/tasks", timeout=5)
    response.raise_for_status()
    tasks = response.json()
    return render_template("index.html", tasks=tasks)


@app.post("/tasks")
def add_task():
    title = request.form.get("title", "")
    requests.post(f"{BACKEND_URL}/tasks", json={"title": title}, timeout=5)
    return redirect(url_for("index"))


@app.post("/tasks/<int:task_id>/toggle")
def toggle_task(task_id):
    requests.post(f"{BACKEND_URL}/tasks/{task_id}/toggle", timeout=5)
    return redirect(url_for("index"))


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
