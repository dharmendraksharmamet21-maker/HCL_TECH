# 🚑 Healthcare Wellness & Preventive Care Portal

A secure, production-ready web platform for patient wellness tracking, preventive care reminders, and provider compliance monitoring.

**Built during the HCLTech Hackathon – November 2024** ✨

---

## 📌 Overview

The Healthcare Wellness & Preventive Care Portal is a **full-stack production-ready application** designed to help patients take control of their wellness goals while enabling healthcare providers to proactively monitor preventive care compliance.

### ✨ Key Highlights

- 🌐 **Modern React/Next.js Frontend** with TypeScript & Tailwind CSS
- 🔒 **Secure Node.js + Express Backend** with JWT authentication & bcrypt hashing
- 🗄️ **MongoDB Database** with 6 Mongoose models and comprehensive validation
- 🧪 **Role-Based Access Control** (Patient vs Provider vs Admin)
- 📊 **Real-Time Dashboard** for wellness metrics tracking
- 🩺 **Compliance Dashboard** for provider patient monitoring
- 💬 **Smart Reminder System** with status tracking
- 🔐 **Enterprise Security** (Rate limiting, CORS, Helmet, Logging)
- ☁️ **Cloud-Ready** with Docker & CI/CD (GitHub Actions)

---

## 🎯 Features Overview

### 👤 Authentication System
- ✅ Secure registration & login for patients and providers
- ✅ JWT-based session management with 7-day expiration
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Consent checkbox for data usage compliance
- ✅ Role-based page access control
- ✅ Persistent localStorage session recovery

### 🧍 Patient Features

#### **Wellness Dashboard**
- Daily metrics tracking: Steps, Sleep, Water intake, Active time, Calories, Heart rate, Blood pressure
- Real-time progress bars with goal indicators
- Upcoming preventive care reminders
- Daily health tips with categorization
- 30-day historical data view
- Quick actions for reminder completion

#### **Profile Management**
- Edit personal information (name, contact)
- Health profile: Height, Weight, Blood type, Gender
- Medical history: Allergies, medications, chronic conditions
- Emergency contacts management
- Wearable device field support

#### **Metrics Tracking**
- Log daily wellness metrics with timestamps
- Automatic data persistence
- Historical analytics with date filtering
- Visual progress indicators

#### **Reminder Management**
- View all assigned reminders from providers
- Filter by status: UPCOMING, MISSED, COMPLETED, CANCELLED
- Mark reminders as completed
- Priority-based sorting

### 🩺 Provider Features

#### **Compliance Dashboard**
- KPIs: Total patients, high compliance, low adherence
- Visual data representation with progress bars
- Quick access to patient details
- Adherence tracking

#### **Patient Management**
- View all assigned patients with compliance status
- Patient search and filtering
- Detailed patient profile view (health info, reminders, history)
- Assign/reassign patients

#### **Reminder Creation**
- Create preventive care reminders for patients
- Set priority levels (High, Medium, Low)
- Add detailed instructions
- Track completion status

---

## 🏗️ System Architecture

```
┌────────────────────────────────────┐
│  Frontend (Next.js + React + TS)   │
│  - 5 Pages                         │
│  - 6 Components                    │
│  - Zustand State                   │
│  - Tailwind CSS                    │
└────────────────┬────────────────────┘
                 │
           REST API (HTTPS)
                 │
┌────────────────┴────────────────────┐
│   Backend (Node.js + Express)       │
│   - 21 Endpoints                    │
│   - JWT Auth                        │
│   - Rate Limiting                   │
│   - Request Logging                 │
└────────────────┬────────────────────┘
                 │
            Mongoose ORM
                 │
┌────────────────┴────────────────────┐
│   Database (MongoDB)                │
│   - 6 Collections                   │
│   - Validation Rules                │
│   - Indexed Queries                 │
└─────────────────────────────────────┘
```

---

## 📊 Complete API Reference (21 Endpoints)

### 🔐 **Auth Routes** (`/api/auth`)
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/register` | ❌ Public |
| POST | `/login` | ❌ Public |
| GET | `/me` | ✅ Protected |

### 🧍 **Patient Routes** (`/api/patient`)
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/dashboard` | ✅ Protected |
| POST | `/metrics/log` | ✅ Protected |
| GET | `/metrics/history` | ✅ Protected |
| PUT | `/profile` | ✅ Protected |
| GET | `/reminders` | ✅ Protected |
| PUT | `/reminders/:id/complete` | ✅ Protected |

### 🩺 **Provider Routes** (`/api/provider`)
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/dashboard` | ✅ Protected |
| GET | `/patients` | ✅ Protected |
| GET | `/patients/:id` | ✅ Protected |
| POST | `/patients/assign` | ✅ Protected |
| POST | `/reminders` | ✅ Protected |
| PUT | `/reminders/:id` | ✅ Protected |

---

## 📂 Project Structure

```
HCL_TECH/
├── backend/                          # Express.js Server
│   ├── controllers/
│   │   ├── authController.js         # Auth logic
│   │   ├── patientController.js      # Patient operations
│   │   └── providerController.js     # Provider operations
│   ├── models/
│   │   ├── User.js                   # Base model (discriminator)
│   │   ├── Patient.js                # Patient schema
│   │   ├── Provider.js               # Provider schema
│   │   ├── WellnessMetric.js         # Metrics tracking
│   │   ├── PreventiveCareReminder.js # Reminders
│   │   └── HealthTip.js              # Health tips
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── patientRoutes.js
│   │   └── providerRoutes.js
│   ├── middleware/
│   │   ├── auth.js                   # JWT & authorization
│   │   ├── errorHandler.js           # Error handling
│   │   ├── validators.js             # Input validation
│   │   ├── rateLimiter.js            # Rate limiting
│   │   └── logger.js                 # Request logging
│   ├── utils/
│   │   ├── jwt.js                    # Token management
│   │   ├── response.js               # Response helpers
│   │   └── constants.js              # Constants/enums
│   ├── server.js                     # Express setup
│   ├── package.json
│   ├── seed.js                       # Database seeding
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                         # Next.js App
│   ├── pages/
│   │   ├── index.tsx                 # Home
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── patient/dashboard.tsx
│   │   └── provider/dashboard.tsx
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Loader.tsx
│   │   └── Alert.tsx
│   ├── store/authStore.ts            # Zustand auth
│   ├── lib/
│   │   ├── api.ts                    # Axios instance
│   │   └── services.ts               # API services
│   ├── styles/globals.css
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── package.json
│   └── Dockerfile
│
├── .github/workflows/ci-cd.yml       # GitHub Actions
├── docker-compose.yml
├── .gitignore
├── README.md
├── SETUP.md
├── ENV_SETUP.md
├── API_DOCUMENTATION.md
├── IMPLEMENTATION_SUMMARY.md
└── PROJECT_STATUS.md
```

---

## 🗄️ Database Models

### **User** (Base Model)
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  passwordHash: String (bcrypt),
  role: String (patient/provider),
  consentGiven: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Patient** (Extends User)
```javascript
{
  height: Number (50-300 cm),
  weight: Number (20-500 kg),
  bloodType: String,
  gender: String,
  allergies: [String],
  medications: [String],
  chronicConditions: [String],
  emergencyContacts: [{name, phone, relationship}],
  wearableDevices: [String],
  assignedProviders: [ObjectId]
}
```

### **Provider** (Extends User)
```javascript
{
  licenseNumber: String (unique),
  specialization: String,
  hospitalAffiliation: String,
  yearsOfExperience: Number (0-70),
  averageRating: Number,
  totalReviews: Number,
  assignedPatients: [ObjectId]
}
```

### **WellnessMetric**
```javascript
{
  patientId: ObjectId (indexed),
  date: Date,
  steps: Number,
  sleepDuration: Number,
  waterIntake: Number,
  activeTime: Number,
  calories: Number,
  heartRate: Number,
  bloodPressure: String,
  createdAt: Date (indexed)
}
```

### **PreventiveCareReminder**
```javascript
{
  patientId: ObjectId,
  providerId: ObjectId,
  title: String,
  description: String,
  dueDate: Date,
  status: String (upcoming/missed/completed/cancelled),
  priority: String (high/medium/low),
  notes: String,
  createdAt: Date,
  completedAt: Date
}
```

### **HealthTip**
```javascript
{
  title: String,
  content: String,
  category: String,
  source: String,
  createdAt: Date
}
```

---

## 🔐 Security Features

✅ **Authentication & Authorization**
- JWT Bearer tokens with 7-day expiration
- Bcrypt password hashing (10 rounds)
- Role-based access control (RBAC)
- Protected API routes

✅ **Rate Limiting**
- General API: 100 requests/15 minutes
- Auth endpoints: 5 requests/15 minutes
- Reminder creation: 50 requests/hour

✅ **Data Protection**
- CORS with configurable origins
- Helmet security headers
- Input validation (frontend & backend)
- XSS protection
- SQL injection prevention (MongoDB)

✅ **Logging & Monitoring**
- Request logging with daily rotation
- Error tracking
- Audit trail ready
- Logs: method, path, status, duration, IP

✅ **Production Ready**
- Environment-based config
- Secrets management (.env)
- HTTPS-ready
- Docker containerization
- CI/CD pipeline

---

## ⚙️ Quick Start

### Prerequisites
- Node.js 18+
- npm
- MongoDB 7.0+ (local or Atlas)
- Git

### 🚀 Installation (5 minutes)

#### 1. Clone Repository
```bash
git clone https://github.com/dharmendraksharmamet21-maker/HCL_TECH.git
cd HCL_TECH
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev        # Runs on http://localhost:5000
```

#### 3. Frontend Setup (new terminal)
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm run dev        # Runs on http://localhost:3000
```

#### 4. Seed Database (optional)
```bash
cd backend
npm run seed
```

#### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### 📝 Test Credentials (After Seeding)
```
Patient:    email: patient1@example.com, password: password123
Provider:   email: provider1@example.com, password: password123
```

---

## 🐳 Docker Setup

```bash
docker-compose up -d
# Access: http://localhost:3000
docker-compose down
```

---

## 📊 Tech Stack

**Backend**
- Node.js 18+, Express 4.18, MongoDB 7.0, Mongoose 7.5
- JWT Authentication, Bcrypt, Rate-limiting, Helmet

**Frontend**
- Next.js 14, React 18, TypeScript
- Tailwind CSS, Zustand, Axios, React Hook Form

**DevOps**
- Docker, Docker Compose, GitHub Actions

---

## 🧪 Testing

```bash
npm test           # Run tests
npm run build      # Build validation
npm run lint       # Code linting
```

---

## 🚀 Deployment

**Frontend (Vercel)**
```bash
vercel deploy --prod
```

**Backend (Render/Railway)**
- Connect GitHub repo
- Auto-deploy on push

**Database (MongoDB Atlas)**
- Free tier available
- Use connection string in .env

---

## 📈 Performance Features

- Pagination support for large datasets
- Indexed MongoDB queries
- Request compression (Gzip)
- Token caching (localStorage)
- Graceful error handling
- Scalable architecture

---

## 🤝 Contributing

- Report issues
- Suggest improvements
- Submit pull requests
- Fork and customize

---

## 📜 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

Built during **HCLTech Hackathon 2024** with ❤️

---

## 📞 Support

- Open an issue on GitHub
- Check documentation
- Review API_DOCUMENTATION.md

---

**Status**: ✅ Production Ready  
**Last Updated**: December 2024  
**Version**: 1.0.0

