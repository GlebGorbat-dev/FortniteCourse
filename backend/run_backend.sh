#!/bin/bash

# Скрипт для запуска FastAPI бэкенда
# Использование: ./run_backend.sh

# Переход в директорию скрипта
cd "$(dirname "$0")"

# Активация виртуального окружения
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d ".venv" ]; then
    source .venv/bin/activate
else
    echo "Ошибка: виртуальное окружение не найдено!"
    echo "Создайте виртуальное окружение: python -m venv venv"
    exit 1
fi

# Проверка наличия .env файла
if [ ! -f ".env" ]; then
    echo "Предупреждение: файл .env не найден!"
    echo "Скопируйте env.example в .env и заполните необходимые переменные"
fi

# Запуск сервера
echo "Запуск FastAPI сервера..."
echo "Backend будет доступен на: http://localhost:8000"
echo "API документация: http://localhost:8000/docs"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

