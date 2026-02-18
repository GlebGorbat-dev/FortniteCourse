# Backend API - FastAPI

## Установка

1. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Установите зависимости:
```bash
pip install -r requirements.txt
```

3. Создайте файл `.env` на основе `.env.example` и заполните все переменные

4. Создайте базу данных PostgreSQL и укажите `DATABASE_URL` в `.env`

5. Запустите миграции:
```bash
alembic upgrade head
```

6. Запустите сервер:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

### Security (Auth)
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход
- `GET /api/v1/auth/me` - Информация о текущем пользователе

### Courses
- `GET /api/v1/courses/` - Список курсов
- `GET /api/v1/courses/{course_id}` - Детали курса
- `GET /api/v1/courses/{course_id}/access` - Проверка доступа

### Account
- `GET /api/v1/account/me` - Информация об аккаунте
- `GET /api/v1/account/purchases` - Покупки пользователя
- `GET /api/v1/account/progress/{course_id}` - Прогресс по курсу

### Purchases
- `GET /api/v1/purchases/` - Список покупок
- `GET /api/v1/purchases/{purchase_id}` - Детали покупки

### Payment
- `POST /api/v1/payment/create` - Создание платежа
- `POST /api/v1/payment/webhook/stripe` - Вебхук Stripe
- `POST /api/v1/payment/webhook/yookassa` - Вебхук ЮKassa
- `GET /api/v1/payment/status/{payment_id}` - Статус платежа

### Progress
- `POST /api/v1/progress/update` - Обновление прогресса
- `GET /api/v1/progress/lesson/{lesson_id}` - Прогресс урока

## Структура БД

### Users
- id, email, username, hashed_password, full_name, is_active, is_superuser, created_at, updated_at

### Courses
- id, title, description, short_description, price, currency, image_url, is_active, created_at, updated_at

### CourseModules
- id, course_id, title, description, order, created_at

### CourseLessons
- id, module_id, title, description, video_url, video_duration, order, created_at

### Purchases
- id, user_id, course_id, payment_id, price, currency, status, purchased_at

### Progress
- id, user_id, lesson_id, watched_duration, is_completed, last_watched_at, created_at

### Payments
- id, user_id, course_id, amount, currency, payment_method, payment_id_external, status, payment_url, metadata, created_at, updated_at

