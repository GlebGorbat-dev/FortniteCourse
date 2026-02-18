# Образовательная платформа - Fortnite Course Site

Full-stack проект на Next.js 14 (TypeScript, Tailwind) и FastAPI для образовательной платформы.

## Структура проекта

```
FortniteCourseSite/
├── frontend/          # Next.js 14 приложение
├── backend/           # FastAPI приложение
└── README.md
```

## Технологии

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Python 3.12
- Stripe (EU)
- ЮKassa (СБП для РФ)

## Установка и запуск

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Функционал

- Лендинг с hero section и видео приветствия
- Регистрация и авторизация
- Dashboard с прогрессом обучения
- Раздел "Программы" (купленные курсы открыты, остальные под замком)
- Раздел "Ресурсы" с файлами
- Интеграция оплаты через Stripe и ЮKassa
- Отслеживание прогресса просмотра видео

