# ⚙️ Nested Comment Backend

This is the **backend** for the Nested Comment Web App — a secure, scalable REST API built using **Node.js**, **Express**, and **MongoDB**.  
It handles authentication, authorization, nested comment retrieval, and admin-level comment management.

---

## 🚀 Tech Stack

- 🟢 **Node.js**
- ⚡ **Express.js** `^5.1.0`
- 🍃 **MongoDB + Mongoose** `^8.19.1`
- 🔐 **JWT (jsonwebtoken)** `^9.0.2`
- 🧂 **bcryptjs** `^3.0.2`
- 🍪 **cookie-parser** `^1.4.7`
- 🌍 **CORS** `^2.8.5`
- 🧩 **dotenv** `^17.2.3`
- 🌀 **uuid** `^13.0.0`
- 🔁 **nodemon** `^3.1.10` (for development)

---

## 🔐 Authentication & Security Flow

- Users can **Sign Up**, **Login**, and **Logout** securely.
- On successful login, a **JWT token** is issued and stored in cookies.
- **Protected routes** are secured using `authMiddleware` which verifies the JWT.
- When a user logs out, the current JWT is added to the **BlacklistToken** collection — preventing reuse even before expiry.
- Admin users can sign up separately using the `adminSignup` route.

---

## 💬 Comment Functionality

- The **Comment Controller** retrieves all comments and constructs a **nested comment structure** recursively.
- Admin users can **delete comments** using the admin-protected route.
- Regular users can **view comments**, **reply**, and **interact** based on permissions.

---

## 🧠 Schemas Overview

### 1️⃣ User Schema
Stores user information including:
- `name`, `email`, `password`, and `role` (user/admin)

### 2️⃣ Comment Schema
Handles nested comment relationships:
- `userId`, `parentId`, `content`, and `upvotes`
- Supports **infinite-level nesting**

### 3️⃣ BlacklistToken Schema
Stores JWTs that are invalidated on logout:
- `token` (string)
- `expiresAt` (Date)

Ensures logged-out users cannot reuse old tokens.

