# Инструкция по установке и запуску

## Предварительные требования

- Python 3.12
- Node.js 18+ и npm
- PostgreSQL
- Аккаунты Stripe и ЮKassa (для тестирования оплаты)

## Установка Backend

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

5. Заполните переменные в `.env`:
- `DATABASE_URL` - строка подключения к PostgreSQL
- `SECRET_KEY` - секретный ключ для JWT (сгенерируйте случайную строку)
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` - ключи от Stripe
- `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY` - ключи от ЮKassa
- `FRONTEND_URL` - URL фронтенда (по умолчанию http://localhost:3000)

6. Создайте базу данных PostgreSQL:

#### Вариант 1: Через командную строку (psql)

**macOS/Linux:**
```bash
# Подключитесь к PostgreSQL (обычно пользователь postgres)
psql -U postgres

# Или если у вас другой пользователь:
psql -U your_username

# В консоли PostgreSQL выполните:
CREATE DATABASE fortnite_course_db;

# Выход из psql:
\q
```

**Windows:**
```bash
# Откройте командную строку или PowerShell
# Перейдите в директорию установки PostgreSQL (обычно C:\Program Files\PostgreSQL\<version>\bin)
# Или добавьте PostgreSQL в PATH

# Подключитесь к PostgreSQL:
psql -U postgres

# В консоли PostgreSQL выполните:
CREATE DATABASE fortnite_course_db;

# Выход:
\q
```

#### Вариант 2: Через pgAdmin (графический интерфейс)

1. Откройте pgAdmin
2. Подключитесь к серверу PostgreSQL
3. Правой кнопкой мыши на "Databases" → "Create" → "Database..."
4. В поле "Database" введите: `fortnite_course_db`
5. Нажмите "Save"

#### Вариант 3: Через Docker

Если PostgreSQL запущен в Docker:
```bash
# Подключитесь к контейнеру PostgreSQL
docker exec -it <container_name> psql -U postgres

# Создайте базу данных:
CREATE DATABASE fortnite_course_db;

# Выход:
\q
```

#### Вариант 4: Одной командой из терминала

**macOS/Linux:**
```bash
createdb -U postgres fortnite_course_db
```

**Windows:**
```bash
# В командной строке (из директории bin PostgreSQL):
createdb -U postgres fortnite_course_db
```

#### Проверка создания базы данных

```bash
# Подключитесь к PostgreSQL:
psql -U postgres

# Просмотрите список баз данных:
\l

# Должна быть видна база fortnite_course_db

# Выход:
\q
```

#### Настройка DATABASE_URL в .env

После создания базы данных обновите `DATABASE_URL` в файле `.env`:

**Формат строки подключения:**
```
DATABASE_URL=postgresql://username:password@localhost:5432/fortnite_course_db
```

**Примеры:**
- Если пользователь `postgres` без пароля:
  ```
  DATABASE_URL=postgresql://postgres@localhost:5432/fortnite_course_db
  ```

- Если пользователь `postgres` с паролем `mypassword`:
  ```
  DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/fortnite_course_db
  ```

- Если другой пользователь и порт:
  ```
  DATABASE_URL=postgresql://myuser:mypassword@localhost:5433/fortnite_course_db
  ```

**Примечание:** По умолчанию PostgreSQL использует порт `5432`. Если у вас другой порт, укажите его в URL.

7. Запустите миграции:
```bash
alembic upgrade head
```

8. (Опционально) Заполните БД тестовыми данными:
```bash
python scripts/init_db.py
```

9. Запустите сервер:
```bash
uvicorn app.main:app --reload
```

Backend будет доступен по адресу http://localhost:8000

API документация: http://localhost:8000/docs

## Установка Frontend

1. Перейдите в директорию frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env.local`:
```bash
cp .env.local.example .env.local
```

4. Заполните переменные в `.env.local`:
- `NEXT_PUBLIC_API_URL` - URL бэкенда (по умолчанию http://localhost:8000)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - публичный ключ Stripe

5. Запустите dev сервер:
```bash
npm run dev
```

Frontend будет доступен по адресу http://localhost:3000

## Настройка вебхуков для оплаты

### Stripe

1. В панели Stripe перейдите в Developers → Webhooks
2. Добавьте endpoint: `http://your-backend-url/api/v1/payment/webhook/stripe`
3. Выберите событие: `checkout.session.completed`
4. Скопируйте Webhook Signing Secret в `.env` как `STRIPE_WEBHOOK_SECRET`

### ЮKassa

1. В личном кабинете ЮKassa перейдите в Настройки → HTTP-уведомления
2. Добавьте URL: `http://your-backend-url/api/v1/payment/webhook/yookassa`
3. Выберите события: `payment.succeeded`, `payment.canceled`

## Тестовые данные

После запуска скрипта `init_db.py` будет создан:
- Тестовый пользователь: `test@example.com` / `testpassword`
- Тестовый курс "Основы Fortnite" с модулями и уроками (видео с YouTube)

## Структура проекта

Подробная структура описана в файле `PROJECT_STRUCTURE.md`

## Основные маршруты

### Frontend
- `/` - Лендинг
- `/login` - Вход
- `/register` - Регистрация
- `/platform` - Dashboard
- `/platform/courses` - Список курсов
- `/platform/courses/[id]` - Детали курса
- `/platform/resources` - Ресурсы
- `/payment/success` - Успешная оплата
- `/payment/cancel` - Отмененная оплата

### Backend API
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход
- `GET /api/v1/courses/` - Список курсов
- `GET /api/v1/courses/{id}` - Детали курса
- `POST /api/v1/payment/create` - Создание платежа
- И другие (см. документацию на /docs)

## Решение проблем

### Ошибка подключения к БД
- Проверьте, что PostgreSQL запущен
- Проверьте правильность `DATABASE_URL` в `.env`
- Убедитесь, что база данных создана

### Ошибки CORS
- Проверьте `CORS_ORIGINS` в `backend/app/core/config.py`
- Убедитесь, что URL фронтенда добавлен в список разрешенных

### Ошибки оплаты
- Проверьте правильность ключей Stripe/ЮKassa
- Убедитесь, что вебхуки настроены правильно
- Проверьте логи бэкенда

