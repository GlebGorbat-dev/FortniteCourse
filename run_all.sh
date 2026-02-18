#!/bin/bash

# Скрипт для одновременного запуска Backend и Frontend
# Использование: ./run_all.sh

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Запуск Fortnite Course Platform${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Функция для очистки при выходе
cleanup() {
    echo ""
    echo -e "${YELLOW}Остановка серверов...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Установка обработчика сигналов
trap cleanup SIGINT SIGTERM

# Запуск Backend
echo -e "${GREEN}Запуск Backend...${NC}"
cd "$(dirname "$0")/backend"
if [ -f "run_backend.sh" ]; then
    chmod +x run_backend.sh
    ./run_backend.sh &
    BACKEND_PID=$!
else
    echo -e "${YELLOW}Ошибка: run_backend.sh не найден${NC}"
    exit 1
fi

# Небольшая задержка
sleep 2

# Запуск Frontend
echo -e "${GREEN}Запуск Frontend...${NC}"
cd "$(dirname "$0")/frontend"
if [ -f "run_frontend.sh" ]; then
    chmod +x run_frontend.sh
    ./run_frontend.sh &
    FRONTEND_PID=$!
else
    echo -e "${YELLOW}Ошибка: run_frontend.sh не найден${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Оба сервера запущены!${NC}"
echo -e "${BLUE}Backend:${NC}  http://localhost:8000"
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}API Docs:${NC} http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}Для остановки нажмите Ctrl+C${NC}"
echo ""

# Ожидание завершения
wait

