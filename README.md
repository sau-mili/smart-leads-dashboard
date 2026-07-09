# 🚀 Smart Leads Dashboard

A full-stack, enterprise-grade CRM dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. This application allows users to securely authenticate, manage customer leads, and track pipeline analytics in real-time.

**[View Live Demo]** *[(Insert your Vercel URL here!)](https://smart-leads-dashboard-bay.vercel.app/)* 🎥 **Demo Video:** A full demonstration video of the application in action is attached to this repository.

---

## ✨ Key Features

* **Secure Authentication:** Complete Login/Registration system using JWT (JSON Web Tokens) and bcrypt password hashing.
* **Lead Management:** Create, Read, Update, and organize leads efficiently.
* **Advanced Data Table:** Features server-side pagination, real-time search (debounced), and multi-criteria filtering (Status, Source, Date).
* **Pipeline Analytics:** Dynamic metric cards summarizing total leads, new leads, qualified prospects, and lost opportunities.
* **Premium UI/UX:** Responsive, modern design with smooth state transitions and global toast notifications.

---

## 🛠️ Tech Stack

**Frontend (Client)**
* React.js (with Vite)
* TypeScript
* Tailwind CSS (Styling)
* Axios (API Client with Interceptors)
* React-Hot-Toast (Notifications)

**Backend (Server)**
* Node.js & Express.js
* TypeScript
* MongoDB & Mongoose (Database & ODM)
* JSON Web Tokens (Auth)

---

## 🌐 Virtual Deployment Configuration

> **Note on Production URLs:** The API base URLs required for Render (Backend) and Vercel (Frontend) deployment are currently commented out in the codebase (e.g., inside `frontend/src/api/axios.ts`). To deploy virtually rather than running locally, simply uncomment the production URLs and comment out the local `localhost` URLs before pushing your code.

---

## 💻 Local Development

Follow these steps to run the project on your local machine.

### Prerequisites
* Node.js (v18 or higher)
* A MongoDB Atlas connection string (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/smart-leads-dashboard.git](https://github.com/your-username/smart-leads-dashboard.git)
cd smart-leads-dashboard
