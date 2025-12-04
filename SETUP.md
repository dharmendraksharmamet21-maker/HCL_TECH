# Healthcare Wellness & Preventive Care Portal - Developer Setup

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 7.0+
- Docker & Docker Compose (optional)

## Development Setup

### Option 1: Local Development

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

The backend will run on `http://localhost:5000`

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

### Option 2: Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Patient Routes
- `GET /api/patient/dashboard` - Get patient dashboard
- `POST /api/patient/metrics/log` - Log wellness metrics
- `GET /api/patient/metrics/history` - Get wellness history
- `PUT /api/patient/profile` - Update profile
- `GET /api/patient/reminders` - Get reminders
- `PUT /api/patient/reminders/:reminderId/complete` - Mark reminder as complete

### Provider Routes
- `GET /api/provider/dashboard` - Get provider dashboard
- `GET /api/provider/patients` - Get assigned patients
- `GET /api/provider/patients/:patientId` - Get patient details
- `POST /api/provider/patients/assign` - Assign patient
- `POST /api/provider/reminders` - Create reminder
- `PUT /api/provider/reminders/:reminderId` - Update reminder

## Database Models

- **User** - Base user model with discriminator for Patient/Provider
- **Patient** - Extends User with health-specific fields
- **Provider** - Extends User with provider-specific fields
- **WellnessMetric** - Daily wellness tracking data
- **PreventiveCareReminder** - Preventive care reminders
- **HealthTip** - Health tips for patients

## Project Structure

```
HCL_TECH/
├── backend/
│   ├── models/           # MongoDB models
│   ├── controllers/      # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Express server entry point
├── frontend/
│   ├── pages/           # Next.js pages
│   ├── components/      # React components
│   ├── store/           # Zustand stores
│   ├── lib/             # Utilities (API client)
│   └── styles/          # Global styles
└── docker-compose.yml   # Docker compose file
```

## Features Implemented

### Patient Portal
- ✅ User registration & login
- ✅ Wellness dashboard with metrics
- ✅ Daily wellness tracking (steps, sleep, water, active time)
- ✅ Preventive care reminders
- ✅ Health tips

### Provider Portal
- ✅ User registration & login
- ✅ Patient compliance dashboard
- ✅ View assigned patients
- ✅ Create preventive care reminders
- ✅ Monitor patient adherence

### Security
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Protected routes

## Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## Deployment

### Using Docker
```bash
docker-compose -f docker-compose.yml up -d
```

### Manual Deployment
1. Build backend: `cd backend && npm run build`
2. Build frontend: `cd frontend && npm run build`
3. Deploy to your cloud provider

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/healthcare-wellness
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Future Enhancements

- [ ] Real-time notifications
- [ ] Email reminders
- [ ] Mobile app
- [ ] Integration with wearables
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment integration for premium features

## Support

For issues or questions, please create an issue in the repository.

---

Built during HCLTech Hackathon 2024
