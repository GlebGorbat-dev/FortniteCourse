# Быстрый старт для тестирования

## Шаг 1: Проверка .env файла

Убедитесь, что в `backend/.env` есть минимум:

```env
DATABASE_URL=postgresql://glebgorbat@localhost:5432/fortnite_course_db
SECRET_KEY=test-secret-key-minimum-32-characters-long-for-development
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
```

Ключи Stripe и ЮKassa теперь опциональны - можно оставить значения по умолчанию.

## Шаг 2: Запуск Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

✅ Backend запущен на http://localhost:8000
✅ API документация: http://localhost:8000/docs

## Шаг 3: Запуск Frontend

В **новом терминале**:

```bash
cd frontend
npm run dev
```

✅ Frontend запущен на http://localhost:3000

## Шаг 4: Тестирование

### 1. Откройте браузер: http://localhost:3000

### 2. Регистрация:
- Нажмите "Начать обучение" или перейдите на `/register`
- Заполните форму регистрации
- После регистрации автоматически войдете в систему

### 3. Просмотр курсов:
- Перейдите на `/platform/courses`
- Увидите список курсов (если они есть в БД)

### 4. Dashboard:
- На главной странице платформы увидите Dashboard
- Если есть купленные курсы - увидите прогресс

### 5. Детали курса:
- Перейдите на `/platform/courses/1` (или другой ID)
- Увидите детали курса
- Если курс не куплен - увидите блокировку
- **Кнопки оплаты покажут ошибку** (это нормально без реальных ключей)

## Тестовый пользователь

Если запускали `python scripts/init_db.py`:
- Email: `test@example.com`
- Пароль: `testpassword`

## Что работает БЕЗ ключей оплаты:

✅ Регистрация
✅ Авторизация
✅ Просмотр курсов
✅ Dashboard
✅ Личный кабинет
✅ Ресурсы
✅ API документация

## Что НЕ работает БЕЗ ключей оплаты:

❌ Создание платежа (вернет понятную ошибку)
❌ Покупка курсов

## Проверка через API документацию

1. Откройте http://localhost:8000/docs
2. Попробуйте:
   - `POST /api/v1/auth/register` - регистрация
   - `POST /api/v1/auth/login` - вход (получите токен)
   - Нажмите "Authorize" и вставьте токен
   - `GET /api/v1/auth/me` - информация о пользователе
   - `GET /api/v1/courses/` - список курсов

## Устранение проблем

### Backend не запускается:
- Проверьте, что PostgreSQL запущен: `brew services list | grep postgresql`
- Проверьте DATABASE_URL в .env
- Проверьте, что виртуальное окружение активировано

### Frontend не запускается:
- Проверьте, что зависимости установлены: `npm install`
- Проверьте, что порт 3000 свободен

### Ошибки CORS:
- Убедитесь, что FRONTEND_URL в .env правильный
- Проверьте, что фронтенд запущен на порту 3000

