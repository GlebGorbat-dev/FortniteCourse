# Deployment Guide for Render

This guide explains how to deploy the Fortnite Course Platform to Render using Docker and GitHub.

## Prerequisites

1. GitHub account
2. Render account (sign up at https://render.com)
3. PostgreSQL database (can be created via Render)

## Deployment Steps

### 1. Prepare Your Repository

Make sure all files are committed and pushed to GitHub:
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `render.yaml`
- All source code

### 2. Connect GitHub to Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create services

### 3. Configure Environment Variables

After services are created, configure environment variables in Render dashboard:

#### Backend Environment Variables:
- `DATABASE_URL` - PostgreSQL connection string (auto-generated if using Render PostgreSQL)
- `SECRET_KEY` - Generate a secure random string
- `FRONTEND_URL` - Your frontend URL (e.g., https://fortnite-course-frontend.onrender.com)
- `CORS_ORIGINS` - Your frontend URL
- `SMTP_USER` - Your email for password reset
- `SMTP_PASSWORD` - Your email app password
- `SMTP_FROM_EMAIL` - Your email address
- `GOOGLE_CLIENT_ID` - If using Google OAuth
- `GOOGLE_CLIENT_SECRET` - If using Google OAuth

#### Frontend Environment Variables:
- `NEXT_PUBLIC_API_URL` - Your backend URL (e.g., https://fortnite-course-backend.onrender.com)

### 4. Database Setup

1. Create a PostgreSQL database in Render
2. Copy the Internal Database URL
3. Set it as `DATABASE_URL` in backend environment variables
4. Run migrations:
   ```bash
   # SSH into backend service or use Render Shell
   alembic upgrade head
   ```
5. Initialize test data:
   ```bash
   python scripts/init_db.py
   ```

### 5. Manual Deployment (Alternative)

If you prefer manual setup:

#### Backend:
1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect your GitHub repository
3. Set:
   - **Name**: fortnite-course-backend
   - **Environment**: Docker
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Docker Context**: `./backend`
   - **Start Command**: (leave empty, handled by Dockerfile)
4. Add environment variables (see above)
5. Deploy

#### Frontend:
1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect your GitHub repository
3. Set:
   - **Name**: fortnite-course-frontend
   - **Environment**: Docker
   - **Dockerfile Path**: `./frontend/Dockerfile`
   - **Docker Context**: `./frontend`
   - **Start Command**: (leave empty, handled by Dockerfile)
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
5. Deploy

### 6. Update CORS Settings

After deployment, update backend `CORS_ORIGINS` to include your frontend URL:
```
https://fortnite-course-frontend.onrender.com
```

### 7. Health Checks

Both services include health check endpoints:
- Backend: `https://your-backend.onrender.com/health`
- Frontend: Built into Next.js

## Local Development with Docker

To run locally with Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Database: localhost:5432

## Troubleshooting

### Backend Issues:
- Check logs in Render dashboard
- Verify `DATABASE_URL` is correct
- Ensure all environment variables are set
- Check health endpoint: `/health`

### Frontend Issues:
- Verify `NEXT_PUBLIC_API_URL` points to backend
- Check build logs for errors
- Ensure backend CORS allows frontend origin

### Database Issues:
- Verify connection string format
- Check database is accessible from backend service
- Run migrations: `alembic upgrade head`

## Environment Variables Reference

### Backend Required:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key
- `FRONTEND_URL` - Frontend URL for redirects
- `CORS_ORIGINS` - Allowed CORS origins

### Backend Optional:
- `SMTP_*` - Email configuration
- `GOOGLE_CLIENT_ID/SECRET` - OAuth configuration
- `STRIPE_*` - Payment configuration (if needed)

### Frontend Required:
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Notes

- Render provides free tier with limitations (services sleep after inactivity)
- For production, consider upgrading to paid plans
- Database backups are recommended for production
- Use environment variables for all secrets (never commit to Git)
