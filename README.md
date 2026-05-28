# Astro Satguru

Full-stack Astrology CRM and Consultation Management System with separate React/Vite frontend and Express/MongoDB backend.

## Apps

- `frontend/` - React, Vite, Tailwind CSS, React Router, Axios, Context API, dashboard UI
- `backend/` - Node.js, Express, MongoDB/Mongoose, JWT, HTTP-only cookies, bcrypt, RBAC, REST APIs

## Setup

1. Copy `backend/.env.example` to `backend/.env` and configure `MONGODB_URI`, `JWT_SECRET`, and optional Cloudinary keys.
2. Copy `frontend/.env.example` to `frontend/.env` if the API URL differs from `http://localhost:5000/api`.
3. Run the backend:

```bash
cd backend
npm install
npm run seed:admin
npm run dev
```

4. Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Default seeded admin credentials are controlled by the backend env values and default to `admin@astrosatguru.com` / `Admin@1234`.
