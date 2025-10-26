# 🗳️ Poll Platform

The **Poll Platform** is a full-stack web application that allows users to **create**, **vote**, and **manage polls** in real time.  
It is built using **Next.js (App Router)** for the frontend and **FastAPI** for the backend — designed with **clean architecture principles** for scalability, reliability, and maintainability.

---

## ⚙️ Tech Stack Overview

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Frontend** | Next.js 14+, TypeScript, Tailwind CSS | Modern web app using App Router & SSR |
| **Backend** | FastAPI, Python 3.11+, SQLAlchemy | Scalable, async-ready API service |
| **Database** | SQLite (extensible to PostgreSQL/MySQL) | Persistent poll, vote, and option storage |
| **Real-Time** | WebSockets | Live vote updates |
| **DevOps** | Docker, CI/CD Ready | Easy deployment & scalability |

---


## 🌐 Frontend — Poll Platform Frontend

The **Poll Platform Frontend** provides an intuitive, real-time interface for interacting with polls.  
Built with **Next.js** and **React**, it ensures a responsive and seamless user experience.

## 🧩 Architecture

App Router → Pages → Components → Services → Backend API


### 1. **Next.js**
- React-based full-stack framework.
- Supports **SSR**, **SSG**, and **ISR**.
- Offers automatic **routing**, **code-splitting**, and **asset optimization**.

### 2. **App Router**
- Defines routes in the `/app` directory.
- Supports **nested layouts** and **server components**.
- Enables fast client-side navigation and data fetching.

### 3. **Components**
Encapsulated, reusable UI elements designed for modularity and maintainability.

**Examples:**
- `HeaderNav` – App navigation bar.
- `PollCard` – Displays polls and voting options.
- `Toast` – Displays global notifications.

### 4. **Services**
Abstract the backend API communication and state synchronization.

**Examples:**
- `api.ts` – Generic API request handler.
- `usePolls.ts` – Custom React hook to manage polls.

### 5. **Backend API Integration**
Communicates with the **FastAPI backend** via REST and WebSocket endpoints.

---

## 🚀 Running the Frontend Locally


### 1. Clone the repository
- git clone https://github.com/rk5634/poll-platform-frontend.git
- cd poll-platform-frontend

### 2. Install dependencies
- npm install or yarn install

### 3. Configure environment variables
- Create a `.env.local` file
- NEXT_PUBLIC_API_URL=http://localhost:8000
- NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws

### 4. Start the development server
- npm run dev

### App will be available at:
👉 http://localhost:3000




# 🧠 Backend — Poll Platform Backend
The Poll Platform Backend is a robust, scalable API built using FastAPI.
It powers poll creation, voting, and real-time updates through REST and WebSocket endpoints.

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
