# Исправление конфигурации Backend Server в PyCharm

## Проблема
PyCharm пытается использовать интерпретатор из `/Users/glebgorbat/PycharmProjects/FortniteCourseSite/.venv/bin/python`, но этот путь не существует (окружение находится в `backend/venv`).

## Решение

### Шаг 1: Удалить старую конфигурацию
1. В PyCharm: **Run** → **Edit Configurations...**
2. Найдите конфигурацию **Backend Server**
3. Выделите её и нажмите **-** (удалить)

### Шаг 2: Создать новую конфигурацию

**Вариант A: Python скрипт (рекомендуется)**

1. **Run** → **Edit Configurations...**
2. Нажмите **+** → **Python**
3. Заполните:
   - **Name**: `Backend Server`
   - **Script path**: `$PROJECT_DIR$/backend/run_backend.py`
   - **Python interpreter**: 
     - Нажмите на выпадающий список справа
     - Выберите **Show All...**
     - Нажмите **+** → **Add Local...**
     - Укажите путь: `/Users/glebgorbat/PycharmProjects/FortniteCourseSite/backend/venv/bin/python`
     - Или выберите существующий интерпретатор из `backend/venv`
   - **Working directory**: `$PROJECT_DIR$/backend`
4. Нажмите **OK**

**Вариант B: Shell Script**

1. **Run** → **Edit Configurations...**
2. Нажмите **+** → **Shell Script**
3. Заполните:
   - **Name**: `Backend Server`
   - **Script path**: `$PROJECT_DIR$/backend/run_backend.sh`
   - **Working directory**: `$PROJECT_DIR$/backend`
4. Нажмите **OK**

### Шаг 3: Проверка интерпретатора Python

1. **File** → **Settings** (или **PyCharm** → **Preferences** на macOS)
2. **Project: FortniteCourseSite** → **Python Interpreter**
3. Убедитесь, что выбран интерпретатор: `/Users/glebgorbat/PycharmProjects/FortniteCourseSite/backend/venv/bin/python`
4. Если его нет:
   - Нажмите на шестеренку → **Add...**
   - Выберите **Existing environment**
   - Укажите путь: `/Users/glebgorbat/PycharmProjects/FortniteCourseSite/backend/venv/bin/python`
   - Нажмите **OK**

### Шаг 4: Запуск

Теперь запустите конфигурацию **Backend Server** через кнопку Run в PyCharm.

## Проверка

После запуска сервер должен быть доступен:
- API: http://localhost:8000
- Документация: http://localhost:8000/docs

Если всё работает, вы увидите в консоли:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

