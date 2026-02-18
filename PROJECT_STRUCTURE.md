# Структура проекта Fortnite Course Platform

## Общая структура

```
FortniteCourseSite/
├── backend/                 # FastAPI бэкенд
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── security.py      # Регистрация, авторизация
│   │   │   │   ├── courses.py       # API курсов
│   │   │   │   ├── account.py       # API личного кабинета
│   │   │   │   ├── purchase.py      # API покупок
│   │   │   │   ├── payment.py       # API оплаты (Stripe, ЮKassa)
│   │   │   │   └── progress.py      # API прогресса
│   │   │   └── dependencies.py      # Зависимости (get_current_user)
│   │   ├── core/
│   │   │   ├── config.py            # Настройки приложения
│   │   │   ├── database.py          # Подключение к БД
│   │   │   └── security.py          # JWT, хеширование паролей
│   │   ├── models/                  # SQLAlchemy модели
│   │   │   ├── user.py
│   │   │   ├── course.py
│   │   │   ├── purchase.py
│   │   │   ├── progress.py
│   │   │   └── payment.py
│   │   ├── schemas/                 # Pydantic схемы
│   │   │   ├── user.py
│   │   │   ├── course.py
│   │   │   ├── purchase.py
│   │   │   ├── progress.py
│   │   │   └── payment.py
│   │   └── main.py                  # Точка входа FastAPI
│   ├── alembic/                     # Миграции БД
│   ├── scripts/
│   │   └── init_db.py               # Скрипт инициализации тестовых данных
│   ├── requirements.txt
│   └── README.md
│
└── frontend/                # Next.js 14 фронтенд
    ├── app/
    │   ├── page.tsx                  # Лендинг
    │   ├── login/                    # Страница входа
    │   ├── register/                 # Страница регистрации
    │   ├── platform/                 # Платформа (защищенные маршруты)
    │   │   ├── page.tsx              # Dashboard
    │   │   ├── courses/              # Курсы
    │   │   │   ├── page.tsx          # Список курсов
    │   │   │   └── [id]/page.tsx     # Детали курса
    │   │   ├── resources/           # Ресурсы
    │   │   └── account/              # Личный кабинет
    │   └── payment/                  # Страницы оплаты
    │       ├── success/
    │       └── cancel/
    ├── components/
    │   ├── landing/                  # Компоненты лендинга
    │   │   ├── HeroSection.tsx       # Hero с видео
    │   │   ├── FeaturesSection.tsx
    │   │   ├── CoursesPreview.tsx
    │   │   └── CTA.tsx
    │   └── platform/                 # Компоненты платформы
    │       ├── Navbar.tsx
    │       ├── Dashboard.tsx
    │       └── CourseContent.tsx     # Плеер и список уроков
    ├── lib/
    │   ├── api.ts                    # API клиент (axios)
    │   └── auth.ts                   # Утилиты авторизации
    ├── package.json
    └── README.md
```

## Схемы базы данных

### Users (Пользователи)
- `id` - Primary Key
- `email` - Email (уникальный)
- `username` - Имя пользователя (уникальное)
- `hashed_password` - Хешированный пароль
- `full_name` - Полное имя (опционально)
- `is_active` - Активен ли пользователь
- `is_superuser` - Администратор
- `created_at`, `updated_at` - Даты создания/обновления

### Courses (Курсы)
- `id` - Primary Key
- `title` - Название курса
- `description` - Полное описание
- `short_description` - Краткое описание
- `price` - Цена
- `currency` - Валюта (RUB, USD, EUR)
- `image_url` - URL изображения
- `is_active` - Активен ли курс
- `created_at`, `updated_at` - Даты

### CourseModules (Модули курса)
- `id` - Primary Key
- `course_id` - Foreign Key → Courses
- `title` - Название модуля
- `description` - Описание
- `order` - Порядок сортировки
- `created_at` - Дата создания

### CourseLessons (Уроки)
- `id` - Primary Key
- `module_id` - Foreign Key → CourseModules
- `title` - Название урока
- `description` - Описание
- `video_url` - URL видео (YouTube или другой источник)
- `video_duration` - Длительность в секундах
- `order` - Порядок сортировки
- `created_at` - Дата создания

### Purchases (Покупки)
- `id` - Primary Key
- `user_id` - Foreign Key → Users
- `course_id` - Foreign Key → Courses
- `payment_id` - Foreign Key → Payments
- `price` - Цена покупки
- `currency` - Валюта
- `status` - Статус (pending, completed, cancelled)
- `purchased_at` - Дата покупки

### Progress (Прогресс)
- `id` - Primary Key
- `user_id` - Foreign Key → Users
- `lesson_id` - Foreign Key → CourseLessons
- `watched_duration` - Просмотрено секунд
- `is_completed` - Завершен ли урок
- `last_watched_at` - Последний просмотр
- `created_at` - Дата создания

### Payments (Платежи)
- `id` - Primary Key
- `user_id` - Foreign Key → Users
- `course_id` - Foreign Key → Courses (опционально)
- `amount` - Сумма
- `currency` - Валюта
- `payment_method` - Метод оплаты (stripe, yookassa)
- `payment_id_external` - ID от платежной системы
- `status` - Статус (pending, succeeded, failed, cancelled)
- `payment_url` - Ссылка для оплаты
- `metadata` - JSON с дополнительными данными
- `created_at`, `updated_at` - Даты

## API Endpoints

### Security API (`/api/v1/auth`)
- `POST /register` - Регистрация нового пользователя
- `POST /login` - Вход (возвращает JWT токен)
- `GET /me` - Информация о текущем пользователе

### Courses API (`/api/v1/courses`)
- `GET /` - Список всех активных курсов
- `GET /{course_id}` - Детали курса с модулями и уроками
- `GET /{course_id}/access` - Проверка доступа пользователя к курсу

### Account API (`/api/v1/account`)
- `GET /me` - Информация об аккаунте
- `GET /purchases` - Список покупок пользователя
- `GET /progress/{course_id}` - Прогресс по конкретному курсу

### Purchase API (`/api/v1/purchases`)
- `GET /` - Список всех покупок пользователя
- `GET /{purchase_id}` - Детали конкретной покупки

### Payment API (`/api/v1/payment`)
- `POST /create` - Создание платежа (возвращает ссылку на оплату)
- `POST /webhook/stripe` - Вебхук от Stripe
- `POST /webhook/yookassa` - Вебхук от ЮKassa
- `GET /status/{payment_id}` - Статус платежа

### Progress API (`/api/v1/progress`)
- `POST /update` - Обновление прогресса просмотра урока
- `GET /lesson/{lesson_id}` - Прогресс по конкретному уроку

## Процесс оплаты

1. Пользователь нажимает "Купить курс"
2. Фронтенд делает запрос `POST /api/v1/payment/create` с `course_id` и `payment_method`
3. Бэкенд создает запись Payment и получает ссылку на оплату от Stripe/ЮKassa
4. Бэкенд возвращает `payment_url` фронтенду
5. Фронтенд перенаправляет пользователя на `payment_url`
6. Пользователь оплачивает на странице платежной системы
7. Платежная система отправляет вебхук на бэкенд
8. Бэкенд обрабатывает вебхук, создает Purchase и обновляет статус Payment
9. Платежная система перенаправляет пользователя обратно на фронтенд (`/payment/success`)

## Отслеживание прогресса

- При просмотре видео фронтенд периодически (каждые 10 секунд) отправляет запрос `POST /api/v1/progress/update`
- Бэкенд сохраняет `watched_duration` и проверяет, просмотрено ли >= 90% видео для отметки как завершенного
- Dashboard показывает прогресс по каждому курсу на основе суммы просмотренных секунд всех уроков

## Технологии

### Backend
- Python 3.12
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic (миграции)
- Stripe SDK
- YooKassa SDK
- JWT (python-jose)
- bcrypt (passlib)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Player (для YouTube видео)
- Axios
- js-cookie

