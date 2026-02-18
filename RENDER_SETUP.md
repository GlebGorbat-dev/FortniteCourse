# Render Setup Checklist

Use this checklist when deploying manually to Render.

## ✅ Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Docker files created (`backend/Dockerfile`, `frontend/Dockerfile`)
- [ ] `.dockerignore` files created
- [ ] `next.config.js` configured for standalone mode
- [ ] No secrets in code (all in environment variables)

## ✅ Database Setup

- [ ] PostgreSQL database created on Render
- [ ] Database name: `fortnite_course`
- [ ] Database user: `fortnite_user`
- [ ] **Internal Database URL** copied
- [ ] Database region selected

## ✅ Backend Service Setup

- [ ] Web service created
- [ ] Name: `fortnite-course-backend`
- [ ] Environment: Docker
- [ ] Dockerfile Path: `./backend/Dockerfile`
- [ ] Docker Context: `./backend`
- [ ] Region: Same as database

### Backend Environment Variables

- [ ] `DATABASE_URL` = Internal Database URL
- [ ] `SECRET_KEY` = Generated random string (32+ chars)
- [ ] `ALGORITHM` = `HS256`
- [ ] `ACCESS_TOKEN_EXPIRE_MINUTES` = `30`
- [ ] `ENVIRONMENT` = `production`
- [ ] `SMTP_HOST` = `smtp.gmail.com`
- [ ] `SMTP_PORT` = `587`
- [ ] `SMTP_USER` = Your email
- [ ] `SMTP_PASSWORD` = Email app password
- [ ] `SMTP_FROM_EMAIL` = Your email
- [ ] `SMTP_FROM_NAME` = `Fortnite Course`
- [ ] `GOOGLE_CLIENT_ID` = (Optional)
- [ ] `GOOGLE_CLIENT_SECRET` = (Optional)
- [ ] `FRONTEND_URL` = (Set after frontend deployment)
- [ ] `CORS_ORIGINS` = (Set after frontend deployment)

## ✅ Frontend Service Setup

- [ ] Web service created
- [ ] Name: `fortnite-course-frontend`
- [ ] Environment: Docker
- [ ] Dockerfile Path: `./frontend/Dockerfile`
- [ ] Docker Context: `./frontend`
- [ ] Region: Same as backend

### Frontend Environment Variables

- [ ] `NEXT_PUBLIC_API_URL` = Backend URL
- [ ] `NODE_ENV` = `production`

## ✅ Post-Deployment

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Backend health check: `/health` returns `{"status": "healthy"}`
- [ ] Frontend loads correctly
- [ ] `FRONTEND_URL` updated in backend
- [ ] `CORS_ORIGINS` updated in backend
- [ ] Backend restarted after CORS update
- [ ] Database migrations run: `alembic upgrade head`
- [ ] Test data initialized: `python scripts/init_db.py`

## ✅ Testing

- [ ] Frontend can connect to backend API
- [ ] User registration works
- [ ] User login works
- [ ] Course listing works
- [ ] Course details load
- [ ] Video playback works
- [ ] Progress tracking works
- [ ] No CORS errors in browser console
- [ ] No 404 errors

## 🔧 Troubleshooting

If something doesn't work:

1. **Check Logs**: Render Dashboard → Service → Logs
2. **Verify Environment Variables**: All required vars are set
3. **Check Database Connection**: Use Internal URL, not External
4. **Verify CORS**: Frontend URL matches `CORS_ORIGINS`
5. **Check Build Logs**: Look for Docker build errors
6. **Test Health Endpoints**: `/health` for backend

## 📝 Service URLs Template

After deployment, save these URLs:

```
Frontend: https://fortnite-course-frontend.onrender.com
Backend:  https://fortnite-course-backend.onrender.com
Health:   https://fortnite-course-backend.onrender.com/health
Database: <Internal URL from Render>
```

## 🔄 Auto-Deploy Setup

- [ ] Auto-deploy enabled (default)
- [ ] Branch: `main`
- [ ] Deploys on push to `main`

## 💡 Tips

- Use **Internal Database URL** for `DATABASE_URL` (faster, more secure)
- Generate `SECRET_KEY` using: `openssl rand -hex 32`
- Free tier services sleep after 15 min inactivity
- First build takes 5-10 minutes
- Subsequent builds are faster (cached layers)
