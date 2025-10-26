# 🗳️ Poll Platform Backend

The **Poll Platform Backend** is a scalable web application built with **Python** and **FastAPI**.  
It provides APIs for creating and managing polls, designed with clean architecture principles for scalability, reliability, and maintainability.

---

## ⚙️ Tech Stack

- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **ORM:** [SQLAlchemy](https://www.sqlalchemy.org/)
- **Database:** SQLite (easily switchable to PostgreSQL or MySQL)
- **Language:** Python 3.11+
- **Web Server:** Uvicorn

---



## 🧩 System Design & Architecture

The backend follows a layered, modular architecture:
Client → API Routes → Services → Repositories → Database

### 1. **Client**
The client can be a frontend app, CLI, or any service that consumes the backend API.

### 2. **API Routes**
- Define API endpoints using FastAPI.
- Handle HTTP requests/responses.
- Delegate logic to service classes.

### 3. **Services**
- Contain core **business logic**.
- Orchestrate operations between repositories and routes.
- Examples: creating polls, managing votes, handling options.

### 4. **Repositories**
- Abstract database operations.
- Handle CRUD via SQLAlchemy ORM.
- Keep DB logic independent of business rules.

### 5. **Database**
- Stores persistent application data (polls, options, votes, etc.).
- Schema defined using **SQLAlchemy models**.

---

## 🚀 Running the Project Locally

### 1. Clone the repository
- git clone https://github.com/rk5634/poll-platform-backend.git
- cd poll-platform-backend

### 2. Set up a virtual environment
- python -m venv venv
- source venv/bin/activate       # For Linux/Mac
- venv\Scripts\activate          # For Windows

### 3. Install dependencies
- pip install -r requirements.txt

### 4. Start the application
- python -m app.main
- The backend will be running at:
👉 http://localhost:8000
- Websocket url will be ws://localhost:8000/ws


