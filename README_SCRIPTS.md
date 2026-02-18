# Скрипты для запуска проекта

## Доступные скрипты

### 1. `backend/run_backend.sh` - Запуск Backend
Shell скрипт для запуска FastAPI сервера.

**Использование:**
```bash
cd backend
./run_backend.sh
```

**Или из корня проекта:**
```bash
./backend/run_backend.sh
```

### 2. `backend/run_backend.py` - Запуск Backend (Python)
Python скрипт для запуска FastAPI сервера. Можно использовать в PyCharm как Python конфигурацию.

**Использование:**
```bash
cd backend
python run_backend.py
```

### 3. `frontend/run_frontend.sh` - Запуск Frontend
Shell скрипт для запуска Next.js dev сервера.

**Использование:**
```bash
cd frontend
./run_frontend.sh
```

**Или из корня проекта:**
```bash
./frontend/run_frontend.sh
```

### 4. `run_all.sh` - Запуск обоих серверов
Запускает Backend и Frontend одновременно.

**Использование:**
```bash
./run_all.sh
```

## Настройка в PyCharm

### Способ 1: Shell Script конфигурации

1. **Run** → **Edit Configurations...**
2. **+** → **Shell Script**

**Backend:**
- Name: `Backend Server`
- Script path: `$PROJECT_DIR$/backend/run_backend.sh`
- Working directory: `$PROJECT_DIR$/backend`

**Frontend:**
- Name: `Frontend Server`
- Script path: `$PROJECT_DIR$/frontend/run_frontend.sh`
- Working directory: `$PROJECT_DIR$/frontend`

### Способ 2: Python + npm конфигурации

**Backend (Python):**
1. **Run** → **Edit Configurations...**
2. **+** → **Python**
3. Script path: `$PROJECT_DIR$/backend/run_backend.py`
4. Python interpreter: `backend/venv/bin/python`
5. Working directory: `$PROJECT_DIR$/backend`

**Frontend (npm):**
1. **Run** → **Edit Configurations...**
2. **+** → **npm**
3. package.json: `$PROJECT_DIR$/frontend/package.json`
4. Command: `run`
5. Scripts: `dev`
6. Working directory: `$PROJECT_DIR$/frontend`

### Способ 3: Compound конфигурация (оба сервера)

1. Создайте конфигурации для Backend и Frontend (любым способом выше)
2. **Run** → **Edit Configurations...**
3. **+** → **Compound**
4. Name: `Start All Servers`
5. Добавьте обе конфигурации в список
6. Запустите - оба сервера запустятся одновременно

## Быстрый запуск из терминала

### Вариант 1: Отдельные терминалы

**Терминал 1:**
```bash
./backend/run_backend.sh
```

**Терминал 2:**
```bash
./frontend/run_frontend.sh
```

### Вариант 2: Один скрипт
```bash
./run_all.sh
```

## Что делают скрипты

### `run_backend.sh`:
- ✅ Проверяет наличие виртуального окружения
- ✅ Активирует виртуальное окружение
- ✅ Проверяет наличие .env файла
- ✅ Запускает uvicorn с автоперезагрузкой

### `run_frontend.sh`:
- ✅ Проверяет наличие node_modules
- ✅ Устанавливает зависимости при необходимости
- ✅ Проверяет наличие .env.local
- ✅ Создает минимальный .env.local если нужно
- ✅ Запускает Next.js dev сервер

### `run_backend.py`:
- ✅ Все то же самое, но как Python скрипт
- ✅ Удобно для PyCharm Python конфигураций

## Проверка работы

После запуска:
- Backend: http://localhost:8000/docs
- Frontend: http://localhost:3000

## Устранение проблем

### Скрипт не исполняется:
```bash
chmod +x backend/run_backend.sh
chmod +x frontend/run_frontend.sh
chmod +x run_all.sh
```

### Backend не запускается:
- Проверьте виртуальное окружение
- Убедитесь, что .env файл существует
- Проверьте, что PostgreSQL запущен

### Frontend не запускается:
- Убедитесь, что зависимости установлены
- Проверьте наличие .env.local

