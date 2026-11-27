# Student Help Desk

A full-stack university student help desk, learning management, campus activities, and career support platform built with React, Vite, Express, and MongoDB.

**GitHub Repository:** [https://github.com/thimiraprashan/Student-Help-Desk](https://github.com/thimiraprashan/Student-Help-Desk)

---

## Features

- **Student Support & Academic Resources:** Study guides, past papers, AI chat assistant, quality assurance, contact messaging, and notifications.
- **Learning Management (Courses & Educators):** Course catalog, course details, video player, student enrollments, Stripe checkout webhooks, and educator portal (create/edit courses, track enrolled students, department-head approvals).
- **Campus Activities:** University events, sports, and clubs management with scheduled reminders.
- **Career & Internship Portal:** Student profiles, CV uploads, company profiles, job/internship applications, interview scheduling, and student–company messaging.
- **Admin Panels:** Integrated admin routes in the main client plus a dedicated `admin` Vite app for managing study guides, past papers, and messages.

---

## Project Structure

```text
Student Help Desk/
├── client/                 # Main React + Vite frontend (students, educators, admin)
├── admin/                  # Standalone React + Vite admin panel (study guides, past papers, messages)
├── server/                 # Express + MongoDB backend API, webhooks, file uploads, cron scheduler
├── tests/                  # Playwright end-to-end tests
├── playwright.config.js    # Playwright configuration (targets http://localhost:5173)
└── package.json            # Root dependencies (Playwright, Axios)
```

---

## Tech Stack

- **Frontend (`client/`):** React 18, Vite, Tailwind CSS, React Router, Clerk (`@clerk/clerk-react`), Axios, Framer Motion, Vitest, React Testing Library
- **Admin (`admin/`):** React 19, Vite, Tailwind CSS, Axios, Lucide React
- **Backend (`server/`):** Node.js (ES Modules), Express, Mongoose (with `mongodb-memory-server` fallback), Clerk (`@clerk/express`), Stripe, Cloudinary, Multer, `node-cron`
- **E2E Testing:** Playwright

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- MongoDB Atlas / local MongoDB instance (optional for local testing—the server automatically falls back to an in-memory MongoDB server with seeded sample data if `MONGODB_URI` is unreachable)

---

## Getting Started (Clone from GitHub)

```bash
git clone https://github.com/thimiraprashan/Student-Help-Desk.git
cd "Student Help Desk"
```

### 1. Install Dependencies

Install dependencies at the root and in each workspace (`server`, `client`, `admin`):

```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
cd admin && npm install && cd ..
```

### 2. Configure Environment Variables

Create `.env` files in the corresponding folders as needed (never commit `.env` files to GitHub):

**`server/.env`**
```env
HOST=127.0.0.1
PORT=5000
MONGODB_URI=your_mongodb_connection_string

# Optional integrations (skipped gracefully or required per feature)
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
HF_API_KEY=your_huggingface_api_key
CURRENCY=USD
```

**`client/.env`**
```env
VITE_BACKEND_URL=http://127.0.0.1:5000
VITE_API_BASE_URL=http://127.0.0.1:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CURRENCY=$
```

### 3. Run the Applications

Open separate terminals for each service:

- **Backend API (`http://127.0.0.1:5000`):**
  ```bash
  cd server
  npm run dev
  ```
- **Main Client (`http://localhost:5173`):**
  ```bash
  cd client
  npm run dev
  ```
- **Admin Panel:**
  ```bash
  cd admin
  npm run dev
  ```

---

## Running Tests

- **Client Unit Tests (Vitest):**
  ```bash
  cd client
  npm test
  ```
- **End-to-End Tests (Playwright):**
  ```bash
  npx playwright test
  ```

---

## GitHub Workflow

### Verify or Set the GitHub Remote

```bash
git remote -v
# If not already set:
git remote add origin https://github.com/thimiraprashan/Student-Help-Desk.git
```

### Push Local Changes to GitHub

```bash
git status
git add README.md
git commit -m "Add project README with GitHub setup instructions"
git push -u origin main
```

> **Note:** Replace `main` with your active branch name (check with `git branch`). Make sure `.env`, `node_modules/`, and build artifacts remain ignored via `.gitignore`.
