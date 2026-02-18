# Настройка Python интерпретатора в PyCharm

## Проблема: unresolved reference в api/v1

Это происходит потому, что PyCharm не знает, какой интерпретатор Python использовать и где находятся установленные пакеты.

## Решение:

### 1. Настройка интерпретатора Python

1. **File** → **Settings** (или **PyCharm** → **Preferences** на macOS)
2. Перейдите в **Project: FortniteCourseSite** → **Python Interpreter**
3. Нажмите на шестеренку справа → **Add...**
4. Выберите **Existing environment**
5. Укажите путь к интерпретатору:
   ```
   /Users/glebgorbat/PycharmProjects/FortniteCourseSite/backend/venv/bin/python
   ```
6. Нажмите **OK**

### 2. Настройка Sources Root

1. **File** → **Settings** → **Project: FortniteCourseSite** → **Project Structure**
2. Выберите папку `backend/app`
3. Нажмите **Mark Directory as** → **Sources Root**
4. Также отметьте `backend` как **Sources Root** (если нужно)

### 3. Или через контекстное меню:

1. Правой кнопкой на папку `backend/app`
2. **Mark Directory as** → **Sources Root**

### 4. Проверка

После настройки:
- Импорты типа `from app.core.database import get_db` должны работать
- PyCharm должен видеть все модули из `app/`

## Альтернативное решение (если не помогает):

### Создать файл `.python-version` в корне backend:

```bash
cd backend
echo "3.12" > .python-version
```

### Или создать `pyrightconfig.json`:

```json
{
  "include": ["app"],
  "exclude": ["venv", ".venv"],
  "pythonVersion": "3.12",
  "pythonPlatform": "Darwin"
}
```

## Быстрая проверка:

Откройте любой файл в `backend/app/api/v1/` - импорты должны подсвечиваться правильно, без красных подчеркиваний.

Если проблема сохраняется:
1. **File** → **Invalidate Caches...** → **Invalidate and Restart**
2. Дождитесь переиндексации проекта

