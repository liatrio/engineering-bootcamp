"""Backend API service for the simple task list system.

Provides a REST API backed by SQLite. This is the "business logic and
data access" layer that the frontend service calls over HTTP.
"""
import os
import sqlite3
from pathlib import Path

from flask import Flask, g, jsonify, request

app = Flask(__name__)

DB_PATH = os.environ.get("DB_PATH", str(Path(__file__).parent / "tasks.db"))


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(_exception=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = sqlite3.connect(DB_PATH)
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            done INTEGER NOT NULL DEFAULT 0
        )
        """
    )
    db.commit()
    db.close()


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/tasks")
def list_tasks():
    db = get_db()
    rows = db.execute("SELECT id, title, done FROM tasks ORDER BY id").fetchall()
    tasks = [{"id": r["id"], "title": r["title"], "done": bool(r["done"])} for r in rows]
    return jsonify(tasks)


@app.post("/tasks")
def create_task():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "title is required"}), 400

    db = get_db()
    cursor = db.execute("INSERT INTO tasks (title, done) VALUES (?, 0)", (title,))
    db.commit()
    return jsonify({"id": cursor.lastrowid, "title": title, "done": False}), 201


@app.post("/tasks/<int:task_id>/toggle")
def toggle_task(task_id):
    db = get_db()
    row = db.execute("SELECT id, done FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if row is None:
        return jsonify({"error": "task not found"}), 404

    new_done = 0 if row["done"] else 1
    db.execute("UPDATE tasks SET done = ? WHERE id = ?", (new_done, task_id))
    db.commit()
    return jsonify({"id": task_id, "done": bool(new_done)})


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5001)
