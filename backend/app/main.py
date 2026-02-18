from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response
import logging
from app.core.config import settings
from app.api.v1 import security, courses, account, progress, resources, auth

# Настройка логирования
logging.basicConfig(
    level=logging.DEBUG if settings.ENVIRONMENT == "development" else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(
    title="Fortnite Course Platform API",
    description="API для образовательной платформы",
    version="1.0.0"
)

# CORS — allow preflight OPTIONS; allow Render frontend by regex so origin always matches
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.onrender\.com",  # any Render *.onrender.com
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Explicit OPTIONS handlers so preflight always gets 200 (CORS middleware adds headers)
async def _options_ok():
    return Response(status_code=200)

for _path in (
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/forgot-password",
    "/api/v1/auth/reset-password",
    "/api/v1/auth/google/callback",
):
    app.add_api_route(_path, _options_ok, methods=["OPTIONS"])

# Подключение роутеров
app.include_router(security.router, prefix="/api/v1/auth", tags=["Security"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(courses.router, prefix="/api/v1/courses", tags=["Courses"])
app.include_router(account.router, prefix="/api/v1/account", tags=["Account"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Progress"])
app.include_router(resources.router, prefix="/api/v1/resources", tags=["Resources"])


@app.get("/")
async def root():
    return {"message": "Fortnite Course Platform API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

