# Healthcare Wellness Portal - Environment Configuration

## Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional: Analytics (add when needed)
# NEXT_PUBLIC_GA_ID=
```

## Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/healthcare-wellness
MONGODB_TEST_URI=mongodb://localhost:27017/healthcare-wellness-test

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Email Service (Optional - for email notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SMTP Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# API Configuration
API_VERSION=v1
API_TIMEOUT=30000

# Logging
LOG_LEVEL=debug
LOG_DIR=./logs

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## Docker Environment

When using Docker, environment variables can be set in `docker-compose.yml` or in an `.env` file at the root.

### Production Configuration

For production deployment:
1. Change `NODE_ENV=production`
2. Use a strong, random `JWT_SECRET`
3. Use production MongoDB URI (Atlas recommended)
4. Set appropriate rate limiting values
5. Configure proper email service credentials
6. Use HTTPS URLs for frontend
7. Configure CORS for your domain

## Security Notes

⚠️ **Never commit `.env` files to version control**

- `.env` files are already in `.gitignore`
- Use `.env.example` or `.env.sample` for templates only
- Rotate secrets regularly in production
- Use environment-specific configurations
- Store secrets in a secrets management system (AWS Secrets Manager, HashiCorp Vault, etc.)

## Local Development Setup

1. **Create backend/.env:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

2. **Create frontend/.env.local:**
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > frontend/.env.local
```

3. **Install dependencies:**
```bash
cd backend && npm install
cd ../frontend && npm install
```

4. **Start services:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health
