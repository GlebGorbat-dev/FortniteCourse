# Тестирование проекта без ключей оплаты

## Что можно проверить без Stripe и ЮKassa:

✅ **Регистрация пользователя**
✅ **Авторизация (вход)**
✅ **Просмотр списка курсов**
✅ **Просмотр деталей курса**
✅ **Dashboard с прогрессом**
✅ **Личный кабинет**
✅ **Ресурсы**
❌ **Оплата курсов** (требует ключи)

## Запуск проекта

### 1. Запуск Backend

```bash
cd backend
source venv/bin/activate

# Убедитесь, что .env файл создан (можно скопировать из env.example)
# Минимальные настройки для тестирования:
# DATABASE_URL=postgresql://glebgorbat@localhost:5432/fortnite_course_db
# SECRET_KEY=your-secret-key-here
# FRONTEND_URL=http://localhost:3000
# ENVIRONMENT=development

# Запуск сервера
uvicorn app.main:app --reload
```

Backend будет доступен на: http://localhost:8000
API документация: http://localhost:8000/docs

### 2. Запуск Frontend

```bash
cd frontend

# Убедитесь, что .env.local создан:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Запуск dev сервера
npm run dev
```

Frontend будет доступен на: http://localhost:3000

## Минимальный .env для backend

Создайте файл `backend/.env` с минимальными настройками:

```env
# Database (обязательно)
DATABASE_URL=postgresql://glebgorbat@localhost:5432/fortnite_course_db

# JWT (обязательно)
SECRET_KEY=test-secret-key-minimum-32-characters-long-for-development
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Stripe (можно оставить пустым для тестирования)
STRIPE_SECRET_KEY=sk_test_dummy
STRIPE_PUBLISHABLE_KEY=pk_test_dummy
STRIPE_WEBHOOK_SECRET=whsec_dummy

# ЮKassa (можно оставить пустым для тестирования)
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=test_dummy_key

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Environment
ENVIRONMENT=development
```

## Минимальный .env.local для frontend

Создайте файл `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_dummy
```

## Что можно протестировать:

### 1. Регистрация
- Перейдите на http://localhost:3000
- Нажмите "Начать обучение" или перейдите на /register
- Зарегистрируйте нового пользователя

### 2. Авторизация
- Перейдите на /login
- Войдите с созданными учетными данными

### 3. Просмотр курсов
- После входа перейдите на /platform/courses
- Увидите список курсов (если они есть в БД)

### 4. Dashboard
- На главной странице платформы (/platform) увидите Dashboard
- Если есть купленные курсы - увидите прогресс

### 5. Детали курса
- Перейдите на /platform/courses/[id]
- Увидите детали курса
- Если курс не куплен - увидите блокировку и кнопки оплаты
- **Кнопки оплаты не будут работать без реальных ключей**

### 6. Личный кабинет
- Перейдите на /platform/account
- Увидите информацию о профиле

### 7. Ресурсы
- Перейдите на /platform/resources
- Увидите список ресурсов

## Тестовые данные

Если вы запускали `python scripts/init_db.py`, то есть:
- Пользователь: `test@example.com` / `testpassword`
- Курс "Основы Fortnite" с модулями и уроками

## Что НЕ будет работать:

❌ **Создание платежа** - вернет ошибку без реальных ключей
❌ **Вебхуки оплаты** - не будут работать
❌ **Покупка курсов** - нельзя протестировать без реальных ключей

## Обработка ошибок оплаты

Если попытаетесь создать платеж без реальных ключей, увидите ошибку. Это нормально - просто не используйте функцию оплаты для тестирования.

## Проверка API через документацию

1. Откройте http://localhost:8000/docs
2. Попробуйте эндпоинты:
   - `POST /api/v1/auth/register` - регистрация
   - `POST /api/v1/auth/login` - вход
   - `GET /api/v1/auth/me` - информация о пользователе (требует авторизацию)
   - `GET /api/v1/courses/` - список курсов
   - `GET /api/v1/courses/{id}` - детали курса

## Быстрый старт

```bash
# Терминал 1 - Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Терминал 2 - Frontend
cd frontend
npm run dev
```

Откройте браузер: http://localhost:3000

