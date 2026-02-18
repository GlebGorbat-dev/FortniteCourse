# Исправление ошибки деплоя Backend на Render

## Ошибка
```
error: invalid local: resolve : lstat /opt/render/project/src/backendx: no such file or directory
```

## Причина
Неправильно настроен Docker Context в Render. Render клонирует репозиторий в `/opt/render/project/src/`, и Docker не может найти файлы.

## Решение

### Вариант 1: Правильная настройка Docker Context (Рекомендуется)

В настройках Backend сервиса в Render:

1. **Settings** → **Build & Deploy**

2. **Docker Settings:**
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Docker Context**: `.` (точка, корень репозитория)
   
   ИЛИ
   
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Docker Context**: `.` (точка, корень репозитория)

3. **Root Directory**: Оставьте пустым

4. Сохраните и перезапустите деплой

### Вариант 2: Обновить Dockerfile для работы из корня

Если Вариант 1 не работает, обновите Dockerfile:

```dockerfile
# Backend Dockerfile для деплоя из корня репозитория
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from backend directory
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy backend application code
COPY backend/ .

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Вариант 3: Использовать Root Directory

В настройках Render:

1. **Settings** → **Build & Deploy**
2. **Root Directory**: `backend`
3. **Dockerfile Path**: `Dockerfile` (без `backend/`)
4. **Docker Context**: `.` (точка)

## Проверка настроек

После настройки проверьте:

1. **Dockerfile Path** должен указывать на файл относительно корня репозитория или Root Directory
2. **Docker Context** должен быть `.` (корень) или пустым
3. **Root Directory** может быть пустым или `backend`

## Рекомендуемые настройки для Render

### Backend Service:
```
Name: fortnite-course-backend
Environment: Docker
Root Directory: (пусто)
Dockerfile Path: backend/Dockerfile
Docker Context: .
Build Command: (пусто)
Start Command: (пусто)
```

### Frontend Service:
```
Name: fortnite-course-frontend
Environment: Docker
Root Directory: (пусто)
Dockerfile Path: frontend/Dockerfile
Docker Context: .
Build Command: (пусто)
Start Command: (пусто)
```

## Если ничего не помогает

1. Удалите сервис в Render
2. Создайте заново с правильными настройками
3. Убедитесь, что код в GitHub актуален
4. Проверьте, что Dockerfile существует в репозитории
