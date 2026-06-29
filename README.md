# ✅ Task Master

A full-stack task management application built with the **MERN stack** (MongoDB, Express, React, Node.js).

## ✨ Features

- 📝 **Create, edit, and delete tasks** with a clean modal UI
- 🏷️ **Labels / Categories** — College 🏫, Work 💼, Personal 🏠, Ideas 💡
- 🎯 **Priority levels** — 🔴 High, 🟡 Medium, 🟢 Low
- 📅 **Due dates** with overdue detection
- 🔍 **Search** tasks by title or description
- 🔽 **Filter** by status, priority, and category
- 📊 **Stats sidebar** — overview cards, progress bar, smart alerts
- 🔔 **Smart notifications** — overdue, due-soon, high-priority (clickable to filter)
- 🌙 **Dark / Light mode** toggle (persisted in localStorage)
- 📄 **Pagination** — 5 tasks per page
- ⚡ **Real-time stats** that refresh on every change

## 🛠️ Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, Vite, Axios, lucide-react, date-fns   |
| Backend   | Node.js, Express.js                             |
| Database  | MongoDB Atlas + Mongoose                        |
| Styling   | Vanilla CSS (custom design system)              |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/Anushri248/Task-Master.git
cd Task-Master
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your MongoDB Atlas URI
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app
Visit **http://localhost:5173**

## 📁 Project Structure

```
task_tracker/
├── backend/
│   ├── controllers/    # Route handlers (tasks, stats)
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── middleware/     # Error handling
│   └── server.js
└── frontend/
    └── src/
        ├── components/ # Modal, TaskForm, TaskList, TaskItem,
        │               # Filters, SearchBar, StatsPanel, Pagination
        ├── context/    # TaskContext — global state & API calls
        ├── api/        # Axios instance
        └── App.jsx
```

## 🔧 Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
NODE_ENV=development
```

---

Made with ❤️ using the MERN stack
