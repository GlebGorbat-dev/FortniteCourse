#!/bin/bash

# Скрипт для запуска Next.js фронтенда
# Использование: ./run_frontend.sh

# Переход в директорию скрипта
cd "$(dirname "$0")"

# Проверка наличия node_modules
if [ ! -d "node_modules" ]; then
    echo "Установка зависимостей..."
    npm install --legacy-peer-deps
fi

# Проверка наличия .env.local файла
if [ ! -f ".env.local" ]; then
    echo "Предупреждение: файл .env.local не найден!"
    echo "Создаю минимальный .env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
fi

# Запуск dev сервера
echo "Запуск Next.js dev сервера..."
echo "Frontend будет доступен на: http://localhost:3000"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

npm run dev

