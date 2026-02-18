# Подробное руководство по настройке .env файла

## Структура файла .env

Создайте файл `backend/.env` на основе `backend/env.example`:

```bash
cd backend
cp env.example .env
```

## 1. Database (База данных)

### DATABASE_URL

**Формат:**
```
postgresql://username:password@host:port/database_name
```

**Примеры:**

Для локальной базы данных (без пароля):
```
DATABASE_URL=postgresql://glebgorbat@localhost:5432/fortnite_course_db
```

Для локальной базы данных (с паролем):
```
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/fortnite_course_db
```

Для Docker контейнера:
```
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/fortnite_course_db
```

**Как получить:**
- `username` - имя пользователя PostgreSQL (обычно `postgres` или ваше системное имя)
- `password` - пароль PostgreSQL (если установлен)
- `host` - обычно `localhost` для локальной БД
- `port` - обычно `5432` (стандартный порт PostgreSQL)
- `database_name` - `fortnite_course_db` (уже создана)

**Проверка подключения:**
```bash
psql -U glebgorbat -d fortnite_course_db
# или
psql -U postgres -d fortnite_course_db
```

---

## 2. JWT (JSON Web Tokens)

### SECRET_KEY

**Что это:** Секретный ключ для подписи JWT токенов. Должен быть случайной строкой.

**Как создать:**

**Вариант 1: Через Python**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Вариант 2: Через OpenSSL**
```bash
openssl rand -hex 32
```

**Вариант 3: Онлайн генератор**
Используйте https://randomkeygen.com/ (выберите "CodeIgniter Encryption Keys")

**Пример:**
```
SECRET_KEY=your-super-secret-key-here-minimum-32-characters-long-change-in-production
```

**Важно:** 
- Используйте длинный случайный ключ (минимум 32 символа)
- НЕ используйте один и тот же ключ в production и development
- НЕ коммитьте реальный ключ в git

### ALGORITHM

Оставьте как есть:
```
ALGORITHM=HS256
```

### ACCESS_TOKEN_EXPIRE_MINUTES

Время жизни токена в минутах:
```
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Можно изменить на:
- `60` - 1 час
- `1440` - 24 часа
- `10080` - 7 дней

---

## 3. Stripe (Платежная система для EU)

### Шаг 1: Регистрация в Stripe

1. Перейдите на https://stripe.com
2. Нажмите "Sign up" или "Start now"
3. Заполните форму регистрации (email, пароль)
4. Подтвердите email

### Шаг 2: Получение API ключей

1. После входа перейдите в **Dashboard** (https://dashboard.stripe.com)
2. В левом меню выберите **Developers** → **API keys**
3. Вы увидите два ключа:

**Test mode (для разработки):**
- **Publishable key** (начинается с `pk_test_...`) → `STRIPE_PUBLISHABLE_KEY`
- **Secret key** (начинается с `sk_test_...`) → `STRIPE_SECRET_KEY`

**Live mode (для production):**
- Переключите тумблер "Test mode" в "Live mode"
- Получите Live ключи (начинаются с `pk_live_...` и `sk_live_...`)

### Шаг 3: Настройка вебхука

1. В Dashboard перейдите в **Developers** → **Webhooks**
2. Нажмите **"Add endpoint"**
3. Заполните:
   - **Endpoint URL**: `http://your-backend-url/api/v1/payment/webhook/stripe`
     - Для локальной разработки используйте ngrok: `https://your-ngrok-url.ngrok.io/api/v1/payment/webhook/stripe`
   - **Description**: "Fortnite Course Platform Webhook"
   - **Events to send**: Выберите `checkout.session.completed`
4. Нажмите **"Add endpoint"**
5. После создания нажмите на endpoint
6. Скопируйте **"Signing secret"** (начинается с `whsec_...`) → `STRIPE_WEBHOOK_SECRET`

### Заполнение в .env:

```
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

**Примечание:** 
- Для тестирования используйте Test keys
- Для production замените на Live keys
- Webhook secret нужен только для бэкенда

---

## 4. ЮKassa (СБП для РФ)

### Шаг 1: Регистрация в ЮKassa

1. Перейдите на https://yookassa.ru
2. Нажмите **"Войти"** или **"Регистрация"**
3. Зарегистрируйте аккаунт (требуется подтверждение телефона и email)
4. Заполните данные организации или ИП

### Шаг 2: Создание магазина

1. После входа перейдите в **"Настройки"** → **"Магазины"**
2. Нажмите **"Создать магазин"**
3. Заполните данные:
   - Название магазина
   - Описание
   - Категория товаров/услуг
4. Сохраните

### Шаг 3: Получение ключей

1. Перейдите в **"Настройки"** → **"API"**
2. Вы увидите:
   - **Shop ID** (число, например `123456`) → `YOOKASSA_SHOP_ID`
   - **Secret Key** (строка) → `YOOKASSA_SECRET_KEY`

**Важно:**
- Для тестирования используйте ключи из раздела "Тестовые ключи"
- Для production используйте ключи из раздела "Боевые ключи"
- Secret Key показывается только один раз при создании - сохраните его!

### Шаг 4: Настройка HTTP-уведомлений (вебхуков)

1. Перейдите в **"Настройки"** → **"HTTP-уведомления"**
2. Нажмите **"Подключить HTTP-уведомления"**
3. Заполните:
   - **URL для уведомлений**: `http://your-backend-url/api/v1/payment/webhook/yookassa`
     - Для локальной разработки используйте ngrok
   - **HTTP-метод**: POST
   - **События**: Выберите `payment.succeeded` и `payment.canceled`
4. Сохраните

### Заполнение в .env:

```
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=live_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz
```

**Примечание:**
- Для тестирования используйте тестовые ключи
- Для production используйте боевые ключи
- Secret Key может начинаться с `test_` (тестовый) или `live_` (боевой)

---

## 5. Frontend URL

### FRONTEND_URL

URL вашего фронтенд приложения:

**Для локальной разработки:**
```
FRONTEND_URL=http://localhost:3000
```

**Для production:**
```
FRONTEND_URL=https://your-domain.com
```

---

## 6. Environment

### ENVIRONMENT

Тип окружения:

**Для разработки:**
```
ENVIRONMENT=development
```

**Для production:**
```
ENVIRONMENT=production
```

---

## Полный пример .env файла

```env
# Database
DATABASE_URL=postgresql://glebgorbat@localhost:5432/fortnite_course_db

# JWT
SECRET_KEY=your-super-secret-key-minimum-32-characters-long-generated-randomly
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Stripe
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# ЮKassa
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=test_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Environment
ENVIRONMENT=development
```

---

## Настройка ngrok для локальной разработки (вебхуки)

Для тестирования вебхуков локально нужен публичный URL. Используйте ngrok:

### Установка ngrok:

**macOS:**
```bash
brew install ngrok
```

**Или скачайте с:** https://ngrok.com/download

### Запуск ngrok:

```bash
# Запустите ваш бэкенд на порту 8000
uvicorn app.main:app --reload

# В другом терминале запустите ngrok
ngrok http 8000
```

Вы получите URL вида: `https://abc123.ngrok.io`

### Настройка вебхуков с ngrok:

**Stripe:**
- Endpoint URL: `https://abc123.ngrok.io/api/v1/payment/webhook/stripe`

**ЮKassa:**
- URL для уведомлений: `https://abc123.ngrok.io/api/v1/payment/webhook/yookassa`

**Важно:** При каждом перезапуске ngrok URL меняется, нужно обновлять в настройках вебхуков.

---

## Проверка настроек

### Проверка подключения к БД:

```bash
cd backend
source venv/bin/activate
python -c "from app.core.database import engine; engine.connect(); print('✓ БД подключена')"
```

### Проверка Stripe:

```bash
python -c "import stripe; from app.core.config import settings; stripe.api_key = settings.STRIPE_SECRET_KEY; print('✓ Stripe настроен')"
```

### Проверка ЮKassa:

```bash
python -c "from yookassa import Configuration; from app.core.config import settings; Configuration.account_id = settings.YOOKASSA_SHOP_ID; print('✓ ЮKassa настроен')"
```

---

## Безопасность

⚠️ **ВАЖНО:**

1. **НЕ коммитьте .env в git** - он уже в .gitignore
2. **Используйте разные ключи для development и production**
3. **Храните секретные ключи в безопасном месте**
4. **Регулярно ротируйте ключи (особенно SECRET_KEY)**
5. **Для production используйте переменные окружения сервера, а не файл .env**

---

## Решение проблем

### Ошибка подключения к БД:
- Проверьте, что PostgreSQL запущен
- Проверьте правильность DATABASE_URL
- Убедитесь, что база данных создана

### Ошибки Stripe:
- Проверьте, что используете правильные ключи (test/live)
- Убедитесь, что вебхук настроен правильно
- Проверьте логи в Stripe Dashboard → Developers → Logs

### Ошибки ЮKassa:
- Проверьте правильность Shop ID и Secret Key
- Убедитесь, что магазин активирован
- Проверьте настройки HTTP-уведомлений

---

## Полезные ссылки

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe API Docs:** https://stripe.com/docs/api
- **ЮKassa Личный кабинет:** https://yookassa.ru/my
- **ЮKassa API Docs:** https://yookassa.ru/developers/api
- **ngrok:** https://ngrok.com

