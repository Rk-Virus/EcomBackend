# 🛠️ E-Commerce Backend (Express + MongoDB)

This is the backend API for an e-commerce application, built with **Node.js**, **Express**, and **MongoDB**. It handles user registration, authentication, product management, and more.

## 🚀 Getting Started

### 📦 Prerequisites
- Node.js v16+
- MongoDB (Atlas or local)
- npm


### 🔑 Environment Variables
Create a `.env` file in the root with the following:

```
PORT=5000
MONGO_URI=mongodb_uri
JWT_SECRET=jwt_secret
COOKIE_EXPIRE=7d
```

### ▶️ Run the Server
```bash
nodemon server.js

Server runs on `http://localhost:5000`
