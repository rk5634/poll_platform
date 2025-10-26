# 🌐 Poll Platform Frontend

The **Poll Platform Frontend** is a modern web application built using **Next.js (App Router)**.  
It provides an intuitive, real-time interface for **creating**, **voting**, and **managing polls**, following clean architecture principles for scalability, reliability, and maintainability.

---

## ⚙️ Tech Stack

- **Framework:** [Next.js 14+](https://nextjs.org/) with App Router
- **Language:** TypeScript
- **UI Library:** React + Tailwind CSS
- **Components:** shadcn/ui + lucide-react icons
- **State Management:** React Hooks + Context
- **Data Fetching:** Fetch API / Axios (depending on implementation)
- **Real-time Updates:** WebSockets
- **Toast Notifications:** Custom `Toast` provider

---

## 🧩 System Design & Architecture

The frontend follows a **modular, layered architecture** using Next.js and the App Router:
App Router → Pages → Components → Services → Backend API


### 1. **Next.js**
- React-based full-stack framework.
- Supports **server-side rendering (SSR)** and **static site generation (SSG)**.
- Automatic **code-splitting**, **routing**, and **asset optimization**.

### 2. **App Router**
- Defines the application’s routes in the `/app` directory.
- Enables **dynamic routing**, **nested layouts**, and **server components**.
- Provides **client-side navigation** and **data fetching** support.

### 3. **Components**
- Encapsulated, reusable UI components.
- Organized by functionality and page context.
- Examples:
  - `HeaderNav` – App navigation bar.
  - `PollCard` – Displays a poll and voting options.
  - `Toast` – Displays notifications globally.

### 4. **Services**
- Encapsulate API communication with the backend.
- Example files:
  - `api.ts` – Generic API request handler.
  - `usePolls.ts` – Custom React hook to fetch and manage poll data.
- Handle **data fetching**, **error handling**, and **state synchronization**.

### 5. **Backend API Integration**
The frontend connects to the **Poll Platform Backend** (FastAPI) via REST APIs and websocket.  
Typical base URL (adjustable in environment variables):

---

## 🚀 Running the Project Locally

### 1. Clone the repository
- git clone https://github.com/rk5634/poll-platform-frontend.git
- cd poll-platform-frontend


### 2. Install dependencies
- npm install
- yarn install

### 3. Configure environment variables
- Create a .env.local with these two values
- NEXT_PUBLIC_API_URL=
- NEXT_PUBLIC_WS_URL=

### 4. Start the development server
- npm run dev
- Your app will be available at:
👉 http://localhost:3000