# Настройка npm конфигурации в PyCharm

## Для Frontend (npm конфигурация)

В npm конфигурации PyCharm **нет явного поля "Working directory"**, потому что рабочая директория определяется автоматически на основе пути к `package.json`.

### Настройка:

1. **Run** → **Edit Configurations...**
2. **+** → **npm**
3. Заполните:
   - **Name**: `Frontend Server`
   - **package.json**: `$PROJECT_DIR$/frontend/package.json`
     - Или нажмите "..." и выберите файл `frontend/package.json`
   - **Command**: `run`
   - **Scripts**: `dev`
   - **Node interpreter**: Оставьте по умолчанию или выберите нужную версию Node.js
   - **Package manager**: Оставьте по умолчанию (npm)

**Важно:** Рабочая директория автоматически будет `frontend/`, так как `package.json` находится в этой папке.

### Если нужно явно указать рабочую директорию:

**Вариант 1: Использовать Shell Script конфигурацию**

1. **Run** → **Edit Configurations...**
2. **+** → **Shell Script**
3. Заполните:
   - **Name**: `Frontend Server`
   - **Script path**: `$PROJECT_DIR$/frontend/run_frontend.sh`
   - **Working directory**: `$PROJECT_DIR$/frontend` ← **Здесь есть поле!**

**Вариант 2: Добавить через Environment variables**

В npm конфигурации можно добавить переменную окружения:
- Нажмите на иконку справа от "Environment variables"
- Добавьте: `PWD=$PROJECT_DIR$/frontend`

Но это не обязательно, так как рабочая директория определяется автоматически.

## Для Backend (Python конфигурация)

1. **Run** → **Edit Configurations...**
2. **+** → **Python**
3. Заполните:
   - **Name**: `Backend Server`
   - **Script path**: `$PROJECT_DIR$/backend/run_backend.py`
   - **Python interpreter**: 
     - Нажмите "..." справа
     - Выберите "Existing environment"
     - Укажите: `$PROJECT_DIR$/backend/venv/bin/python`
   - **Working directory**: `$PROJECT_DIR$/backend` ← **Здесь есть поле!**

## Проверка рабочей директории

После запуска конфигурации, рабочая директория будет автоматически установлена в:
- Frontend: `frontend/` (на основе package.json)
- Backend: `backend/` (указано явно в Python конфигурации)

## Рекомендация

Для Frontend используйте **npm конфигурацию** - она проще и рабочая директория определяется автоматически.

Для Backend используйте **Python конфигурацию** с `run_backend.py` - там можно явно указать рабочую директорию.

