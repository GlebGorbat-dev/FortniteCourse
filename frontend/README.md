# Frontend - Next.js 14

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env.local` на основе `.env.local.example` и заполните переменные

3. Запустите dev сервер:
```bash
npm run dev
```

Приложение будет доступно по адресу http://localhost:3000

## Структура проекта

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Главная страница (лендинг)
│   ├── login/             # Страница входа
│   ├── register/          # Страница регистрации
│   ├── platform/          # Платформа (требует авторизации)
│   │   ├── page.tsx       # Dashboard
│   │   ├── courses/       # Список курсов и детали
│   │   └── resources/     # Ресурсы
│   └── payment/           # Страницы оплаты
├── components/            # React компоненты
│   ├── landing/          # Компоненты лендинга
│   └── platform/         # Компоненты платформы
└── lib/                  # Утилиты и API клиент
```

## Основные страницы

- `/` - Лендинг с hero section и видео приветствия
- `/login` - Вход
- `/register` - Регистрация
- `/platform` - Dashboard с прогрессом
- `/platform/courses` - Список всех курсов
- `/platform/courses/[id]` - Детали курса и просмотр уроков
- `/platform/resources` - Дополнительные ресурсы
- `/payment/success` - Успешная оплата
- `/payment/cancel` - Отмененная оплата

## Особенности

- Автоматическое отслеживание прогресса просмотра видео
- Интеграция с Stripe и ЮKassa для оплаты
- Защищенные маршруты (требуют авторизации)
- Адаптивный дизайн с Tailwind CSS

