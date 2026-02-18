# Manual Deployment Guide for Render

This guide explains how to deploy backend and frontend as separate web services on Render without using Blueprint.

## Prerequisites

- GitHub repository with your code
- Render account (https://render.com)

## Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `fortnite-course-db`
   - **Database**: `fortnite_course`
   - **User**: `fortnite_user`
   - **Region**: Choose closest to you (e.g., `Oregon`)
   - **Plan**: `Free` (or `Starter` for production)
4. Click **"Create Database"**
5. **Important**: Copy the **Internal Database URL** (you'll need it for backend)

## Step 2: Deploy Backend Service

### 2.1 Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `GlebGorbat-dev/FortniteCourse`
4. Configure the service:

   **Basic Settings:**
   - **Name**: `fortnite-course-backend`
   - **Region**: Same as database (e.g., `Oregon`)
   - **Branch**: `main`
   - **Root Directory**: Leave **EMPTY**
   - **Environment**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile` (без точки в начале!)
   - **Docker Context**: `.` (точка - корень репозитория)
   
   **⚠️ ВАЖНО**: 
   - Docker Context должен быть `.` (точка), а НЕ `./backend`
   - Dockerfile Path должен быть `backend/Dockerfile` (относительно корня)

   **Advanced Settings:**
   - **Build Command**: Leave empty
   - **Start Command**: Leave empty (handled by Dockerfile)
   - **Plan**: `Free` (or `Starter` for production)

### 2.2 Configure Environment Variables

Scroll down to **"Environment Variables"** and add:

```
DATABASE_URL=<Internal Database URL from Step 1>
SECRET_KEY=<Generate a random secret key (32+ characters)>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<Your email>
SMTP_PASSWORD=<Your email app password>
SMTP_FROM_EMAIL=<Your email>
SMTP_FROM_NAME=Fortnite Course
GOOGLE_CLIENT_ID=<Your Google OAuth Client ID (optional)>
GOOGLE_CLIENT_SECRET=<Your Google OAuth Secret (optional)>
```

**Important**: 
- `DATABASE_URL` should be the **Internal Database URL** from PostgreSQL service
- `SECRET_KEY` - Generate a secure random string (you can use: `openssl rand -hex 32`)
- `FRONTEND_URL` and `CORS_ORIGINS` will be set after frontend is deployed

### 2.3 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for build to complete
3. Copy the backend URL (e.g., `https://fortnite-course-backend.onrender.com`)

### 2.4 Update Backend Environment Variables

After deployment, go back to backend service settings and add:

```
FRONTEND_URL=<Your frontend URL from Step 3>
CORS_ORIGINS=<Your frontend URL from Step 3>
```

## Step 3: Deploy Frontend Service

### 3.1 Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect the same GitHub repository: `GlebGorbat-dev/FortniteCourse`
4. Configure the service:

   **Basic Settings:**
   - **Name**: `fortnite-course-frontend`
   - **Region**: Same as backend (e.g., `Oregon`)
   - **Branch**: `main`
   - **Root Directory**: Leave **EMPTY**
   - **Environment**: `Docker`
   - **Dockerfile Path**: `frontend/Dockerfile` (без точки в начале!)
   - **Docker Context**: `.` (точка - корень репозитория)
   
   **⚠️ ВАЖНО**: 
   - Docker Context должен быть `.` (точка), а НЕ `./frontend`
   - Dockerfile Path должен быть `frontend/Dockerfile` (относительно корня)

   **Advanced Settings:**
   - **Build Command**: Leave empty
   - **Start Command**: Leave empty (handled by Dockerfile)
   - **Plan**: `Free` (or `Starter` for production)

### 3.2 Configure Environment Variables

Add environment variables:

```
NEXT_PUBLIC_API_URL=<Your backend URL from Step 2.3>
NODE_ENV=production
```

**Important**: 
- `NEXT_PUBLIC_API_URL` should be your backend URL (e.g., `https://fortnite-course-backend.onrender.com`)

### 3.3 Deploy Frontend

1. Click **"Create Web Service"**
2. Wait for build to complete
3. Copy the frontend URL (e.g., `https://fortnite-course-frontend.onrender.com`)

### 3.4 Update Backend CORS

Go back to backend service settings and update:

```
FRONTEND_URL=<Your frontend URL>
CORS_ORIGINS=<Your frontend URL>
```

Then **"Save Changes"** - backend will automatically redeploy.

## Step 4: Initialize Database

After both services are deployed:

### Option A: Using Render Shell

1. Go to backend service → **"Shell"** tab
2. Run:
   ```bash
   alembic upgrade head
   python scripts/init_db.py
   ```

### Option B: Using Local Machine

1. Install PostgreSQL client locally
2. Connect using External Database URL from Render
3. Run migrations:
   ```bash
   cd backend
   export DATABASE_URL="<External Database URL>"
   alembic upgrade head
   python scripts/init_db.py
   ```

## Step 5: Verify Deployment

1. **Backend Health Check**: 
   - Visit: `https://fortnite-course-backend.onrender.com/health`
   - Should return: `{"status": "healthy"}`

2. **Frontend**: 
   - Visit: `https://fortnite-course-frontend.onrender.com`
   - Should load the landing page

3. **API Connection**:
   - Open browser console on frontend
   - Check for API connection errors
   - Try logging in/registering

## Troubleshooting

### Backend Issues

**Service won't start:**
- Check logs in Render dashboard
- Verify `DATABASE_URL` is correct (use Internal URL)
- Ensure all required environment variables are set

**Database connection errors:**
- Use **Internal Database URL** (not External) for `DATABASE_URL`
- Verify database is in the same region as backend
- Check database is running

**CORS errors:**
- Ensure `CORS_ORIGINS` includes your frontend URL
- Check `FRONTEND_URL` is set correctly
- Restart backend service after updating CORS settings

### Frontend Issues

**Build fails:**
- Check build logs in Render dashboard
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Ensure Dockerfile is correct

**API connection errors:**
- Verify `NEXT_PUBLIC_API_URL` points to backend URL
- Check backend is running and accessible
- Verify CORS is configured correctly on backend

**404 errors:**
- Next.js routing might need adjustment
- Check `next.config.js` settings
- Verify standalone build is working

### Database Issues

**Migrations fail:**
- Ensure database is accessible
- Check `DATABASE_URL` format is correct
- Verify Alembic is installed in Docker image

**Init script fails:**
- Check database connection
- Verify all required tables exist
- Check logs for specific errors

## Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SECRET_KEY` | JWT secret key | Random 32+ char string |
| `FRONTEND_URL` | Frontend URL for redirects | `https://fortnite-course-frontend.onrender.com` |
| `CORS_ORIGINS` | Allowed CORS origins | `https://fortnite-course-frontend.onrender.com` |

### Backend Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration | `30` |
| `ENVIRONMENT` | Environment name | `production` |
| `SMTP_*` | Email configuration | - |
| `GOOGLE_CLIENT_ID` | Google OAuth | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | - |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://fortnite-course-backend.onrender.com` |
| `NODE_ENV` | Node environment | `production` |

## Service URLs

After deployment, you'll have:

- **Frontend**: `https://fortnite-course-frontend.onrender.com`
- **Backend API**: `https://fortnite-course-backend.onrender.com`
- **Backend Health**: `https://fortnite-course-backend.onrender.com/health`
- **Database**: Managed by Render (Internal URL only)

## Notes

- **Free Tier Limitations**: Services sleep after 15 minutes of inactivity
- **Build Time**: First build takes 5-10 minutes
- **Auto-Deploy**: Services auto-deploy on git push to `main` branch
- **Logs**: Available in Render dashboard for each service
- **Scaling**: Can upgrade plans for better performance

## Next Steps

1. Set up custom domains (optional)
2. Configure SSL certificates (automatic on Render)
3. Set up monitoring and alerts
4. Configure backups for database
5. Set up CI/CD workflows
