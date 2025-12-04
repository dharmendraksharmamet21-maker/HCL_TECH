🚑 Healthcare Wellness & Preventive Care Portal
A secure, privacy-focused web platform for patient wellness tracking, preventive care reminders, and provider compliance monitoring.
 Built during the HCLTech Hackathon – 15 Nov.

📌 Overview
The Healthcare Wellness & Preventive Care Portal is designed to help patients take control of their wellness goals while enabling healthcare providers to proactively monitor preventive care compliance.
This MVP demonstrates:
🌐 A deployed React/Next.js frontend


🔒 A secure Node.js + Express + MongoDB backend


🧪 Authentication & role-based access (Patient vs Provider)


📊 Patient wellness dashboard


🩺 Provider compliance dashboard


💬 Preventive care reminders, goal tracking, health tips


☁️ Cloud deployment + CI/CD (GitHub Actions)



✨ Features
👤 Authentication System
Secure registration & login for patients and providers


JWT-based session management


Password hashing (bcrypt)


Consent checkbox for data usage


Role-based page access



🧍‍♂️ Patient Features
1. Wellness Dashboard
Steps, sleep, water intake, and active time progress


Daily goal completion bars


Upcoming preventive care reminders


Health Tip of the Day


2. Profile Management
Edit personal and health information


Allergies, medications, chronic conditions


Emergency contact


3. Goal Tracking
Daily logs for wellness metrics


View personal progress in intuitive UI


4. Preventive Care Reminders
Automatically categorized as UPCOMING, MISSED, or COMPLETED


Mark checkups as completed



🩺 Provider Features
1. Provider Dashboard
View all assigned patients


Compliance indicators:


Missed preventive checkups


Low adherence to wellness goals


2. Patient Detail View
Quick access to a patient’s:


Profile


Recent goal logs


Reminder statuses



🌍 Public Health Information Page
A non-login page with:
Health awareness cards


Preventive care tips


Seasonal flu, COVID-19, and mental health info


Privacy policy



🏗️ System Architecture
Frontend (Next.js/React)
    |
    |  REST API Calls (HTTPS)
    v
Backend (Node.js + Express)
    |
    |  Mongoose ORM
    v
Database (MongoDB Atlas)

Additional Components:
JWT Auth Middleware


Role-Based Access Control


CI/CD Pipeline with GitHub Actions


Deployed Frontend + Backend



📂 Project Structure
root/
 ├── frontend/               # React/Next.js app
 │    ├── pages/
 │    ├── components/
 │    └── styles/
 │
 ├── backend/                # Node.js Express server
 │    ├── src/
 │    │    ├── controllers/
 │    │    ├── models/
 │    │    ├── routes/
 │    │    ├── middleware/
 │    │    └── utils/
 │    └── server.js
 │
 ├── .github/workflows/
 │    └── ci-cd.yml          # Build & deploy pipeline
 │
 └── README.md


🗄️ Database Schema (MongoDB)
users
email, passwordHash, role, lastLoginAt, createdAt

patientProfiles
userId, providerId, allergies, medications, chronicConditions, etc.

goals
patientId, type, targetValue, unit

goalLogs
goalId, patientId, date, value

preventiveReminders
patientId, title, dueDate, status

healthTips
text, category

auditLogs
userId, action, metadata, createdAt


🔐 Security Measures
HTTPS-only deployment


bcrypt password hashing


JWT authentication


Role-based access (patient/provider)


Audit logs for profile/data access


Consent checkbox during registration


Privacy Policy included in public pages



⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/yourusername/healthcare-wellness-portal.git
cd healthcare-wellness-portal


🛠️ Backend Setup (Node.js + Express)
2. Install Dependencies
cd backend
npm install

3. Create .env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
PORT=5000
CORS_ORIGIN=https://your-frontend-url.com

4. Run Backend
npm run dev


💻 Frontend Setup (React/Next.js)
5. Install Dependencies
cd frontend
npm install

6. Create .env.local
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api

7. Run Frontend
npm run dev


☁️ Deployment
Frontend:
Vercel / Netlify


Automatic deployment from GitHub main branch


Backend:
Render / Railway / Azure / AWS EC2


Auto-redeploy on push


MongoDB:
MongoDB Atlas Free Tier



🔄 CI/CD (GitHub Actions)
Included workflow:
Install dependencies


Run builds for frontend & backend


Deploy automatically on successful build


Can be extended for testing, linting, Docker builds, etc.



🧪 API Endpoints Summary
🔐 Auth
POST /auth/register


POST /auth/login


GET /auth/me


🧍 Patient
GET /patient/profile


PUT /patient/profile


GET /patient/dashboard


POST /patient/goals/log


GET /patient/reminders


POST /patient/reminders/:id/complete


🩺 Provider
GET /provider/patients


GET /provider/patients/:id


🌍 Public
GET /public/health-info



🎯 Hackathon Deliverables Achieved
✔ Functional authentication system
 ✔ Patient dashboard (goals, reminders, tips)
 ✔ Provider compliance dashboard
 ✔ Profile management
 ✔ Goal tracking system
 ✔ Public health information page
 ✔ REST API backend
 ✔ Deployed frontend & backend
 ✔ CI/CD pipeline
 ✔ Secure design with audit logs

📸 Screenshots (Add After Deployment)
/screenshots/login.png
/screenshots/patient-dashboard.png
/screenshots/provider-dashboard.png
/screenshots/health-info.png


🤝 Contributors
Your Name – Full-stack developer


Hackathon Team – HCLTech



📜 License
MIT License (or choose your own)

