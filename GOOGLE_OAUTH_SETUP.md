# Настройка Google OAuth и сброса пароля

## 1. Установка зависимостей

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

## 2. Создание миграции для новых полей

```bash
cd backend
source venv/bin/activate
alembic revision --autogenerate -m "add_google_oauth_and_password_reset"
alembic upgrade head
```

## 3. Настройка Google OAuth

1. Перейдите на [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Перейдите в "Credentials" → "Create Credentials" → "OAuth client ID"
5. Выберите "Web application"
6. Добавьте Authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (для разработки)
   - `https://yourdomain.com/auth/google/callback` (для продакшена)
7. Скопируйте Client ID и Client Secret

## 4. Настройка SMTP для отправки email

### Вариант 1: Gmail

1. Включите "Менее безопасные приложения" или создайте "Пароль приложения":
   - Перейдите в настройки аккаунта Google
   - Безопасность → Двухэтапная аутентификация → Пароли приложений
   - Создайте пароль для "Почта" и "Другое устройство"
   - Используйте этот пароль как `SMTP_PASSWORD`

### Вариант 2: Другой SMTP сервер

Настройте параметры SMTP в `.env` файле.

## 5. Обновление .env файла

Добавьте в `backend/.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# SMTP для отправки email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here
SMTP_FROM_EMAIL=your_email@gmail.com
SMTP_FROM_NAME=Fortnite Course
```

## 6. Проверка работы

1. Запустите backend: `python run_backend.py`
2. Запустите frontend: `npm run dev`
3. Перейдите на страницу входа
4. Нажмите "Войти через Google" - должно произойти перенаправление на Google
5. После авторизации вы будете перенаправлены обратно на сайт

## 7. Тестирование сброса пароля

1. На странице входа нажмите "Забыли пароль?"
2. Введите email зарегистрированного пользователя
3. Проверьте почту (включая спам)
4. Перейдите по ссылке из письма
5. Введите новый пароль

## Примечания

- Если SMTP не настроен, письма не будут отправляться, но в логах будет предупреждение
- Для тестирования можно использовать сервисы типа [Mailtrap](https://mailtrap.io/) или [Ethereal Email](https://ethereal.email/)
- В продакшене рекомендуется использовать специализированные сервисы отправки email (SendGrid, Mailgun, AWS SES)

