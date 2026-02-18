# Настройка запуска в PyCharm

## Вариант 1: Использование shell скриптов

### Для Backend:

1. В PyCharm: **Run** → **Edit Configurations...**
2. Нажмите **+** → **Shell Script**
3. Заполните:
   - **Name**: `Backend Server`
   - **Script path**: `$PROJECT_DIR$/backend/run_backend.sh`
   - **Working directory**: `$PROJECT_DIR$/backend`
4. Нажмите **OK**

### Для Frontend:

1. В PyCharm: **Run** → **Edit Configurations...**
2. Нажмите **+** → **Shell Script**
3. Заполните:
   - **Name**: `Frontend Server`
   - **Script path**: `$PROJECT_DIR$/frontend/run_frontend.sh`
   - **Working directory**: `$PROJECT_DIR$/frontend`
4. Нажмите **OK**

## Вариант 2: Использование Python скрипта для Backend

### Для Backend:

1. В PyCharm: **Run** → **Edit Configurations...**
2. Нажмите **+** → **Python**
3. Заполните:
   - **Name**: `Backend Server`
   - **Script path**: `$PROJECT_DIR$/backend/run_backend.py`
   - **Python interpreter**: Выберите интерпретатор из `backend/venv`
   - **Working directory**: `$PROJECT_DIR$/backend`
4. Нажмите **OK**

### Для Frontend (npm):

1. В PyCharm: **Run** → **Edit Configurations...**
2. Нажмите **+** → **npm**
3. Заполните:
   - **Name**: `Frontend Server`
   - **package.json**: `$PROJECT_DIR$/frontend/package.json`
   - **Command**: `run`
   - **Scripts**: `dev`
   - **Working directory**: `$PROJECT_DIR$/frontend`
4. Нажмите **OK**

## Вариант 3: Прямой запуск через терминал в PyCharm

### Для Backend:

1. Откройте терминал в PyCharm (Alt+F12 или View → Tool Windows → Terminal)
2. Выполните:
   ```bash
   cd backend
   ./run_backend.sh
   ```

### Для Frontend:

1. Откройте второй терминал (можно через Split Terminal)
2. Выполните:
   ```bash
   cd frontend
   ./run_frontend.sh
   ```

## Рекомендуемый способ для PyCharm

**Используйте npm конфигурацию для Frontend и Python скрипт для Backend:**

### Backend (Python):
- **Type**: Python
- **Script**: `backend/run_backend.py`
- **Interpreter**: `backend/venv/bin/python`

### Frontend (npm):
- **Type**: npm
- **Command**: `run`
- **Scripts**: `dev`
- **package.json**: `frontend/package.json`

## Запуск обоих серверов одновременно

1. Создайте **Compound** конфигурацию:
   - **Run** → **Edit Configurations...**
   - Нажмите **+** → **Compound**
   - **Name**: `Start All Servers`
   - Добавьте обе конфигурации (Backend и Frontend)
2. Запустите через эту конфигурацию - оба сервера запустятся одновременно

## Проверка работы

После запуска:
- Backend: http://localhost:8000/docs
- Frontend: http://localhost:3000

## Устранение проблем

### Backend не запускается:
- Проверьте, что виртуальное окружение активировано
- Убедитесь, что файл `.env` существует
- Проверьте, что PostgreSQL запущен

### Frontend не запускается:
- Убедитесь, что зависимости установлены: `npm install`
- Проверьте наличие файла `.env.local`
- Убедитесь, что порт 3000 свободен

