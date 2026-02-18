# Подробная инструкция по настройке PostgreSQL

## Установка PostgreSQL

### macOS

**Через Homebrew:**
```bash
brew install postgresql@14
# или
brew install postgresql@15

# Запуск PostgreSQL:
brew services start postgresql@14
```

**Через официальный установщик:**
1. Скачайте с https://www.postgresql.org/download/macosx/
2. Установите через установщик
3. PostgreSQL будет запущен автоматически

### Linux (Ubuntu/Debian)

```bash
# Обновление списка пакетов
sudo apt update

# Установка PostgreSQL
sudo apt install postgresql postgresql-contrib

# Запуск службы
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows

1. Скачайте установщик с https://www.postgresql.org/download/windows/
2. Запустите установщик
3. Во время установки:
   - Выберите порт (по умолчанию 5432)
   - Установите пароль для пользователя `postgres`
   - Выберите локаль (обычно "Russian, Russia")
4. После установки PostgreSQL будет запущен как служба

### Docker

```bash
# Запуск PostgreSQL в Docker
docker run --name postgres-fortnite \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=fortnite_course_db \
  -p 5432:5432 \
  -d postgres:15

# Или с docker-compose (создайте docker-compose.yml):
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: postgres-fortnite
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: fortnite_course_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Запуск:
```bash
docker-compose up -d
```

## Создание базы данных

### Способ 1: Через psql (командная строка)

**macOS/Linux:**
```bash
# Подключение к PostgreSQL
psql -U postgres

# Если требуется пароль, используйте:
psql -U postgres -h localhost
```

**Windows:**
```bash
# Откройте "SQL Shell (psql)" из меню PostgreSQL
# Или используйте командную строку:
"C:\Program Files\PostgreSQL\<version>\bin\psql.exe" -U postgres
```

**В консоли psql выполните:**
```sql
-- Создание базы данных
CREATE DATABASE fortnite_course_db;

-- Проверка создания
\l

-- Выход из psql
\q
```

### Способ 2: Одной командой

**macOS/Linux:**
```bash
createdb -U postgres fortnite_course_db
```

**Windows:**
```bash
# Из командной строки (перейдите в bin директорию PostgreSQL):
cd "C:\Program Files\PostgreSQL\<version>\bin"
createdb.exe -U postgres fortnite_course_db
```

### Способ 3: Через pgAdmin

1. Откройте pgAdmin 4
2. Подключитесь к серверу PostgreSQL (двойной клик)
3. Введите пароль, если требуется
4. Правой кнопкой мыши на "Databases" → "Create" → "Database..."
5. В поле "Database" введите: `fortnite_course_db`
6. Нажмите "Save"

### Способ 4: Через SQL файл

Создайте файл `create_db.sql`:
```sql
CREATE DATABASE fortnite_course_db;
```

Затем выполните:
```bash
psql -U postgres -f create_db.sql
```

## Настройка пользователя и прав доступа (опционально)

Если хотите создать отдельного пользователя для приложения:

```sql
-- Подключитесь к PostgreSQL как суперпользователь
psql -U postgres

-- Создание пользователя
CREATE USER fortnite_user WITH PASSWORD 'your_secure_password';

-- Создание базы данных
CREATE DATABASE fortnite_course_db OWNER fortnite_user;

-- Предоставление всех прав на базу данных
GRANT ALL PRIVILEGES ON DATABASE fortnite_course_db TO fortnite_user;

-- Выход
\q
```

## Настройка DATABASE_URL

После создания базы данных обновите `DATABASE_URL` в файле `backend/.env`:

### Формат строки подключения

```
postgresql://[user[:password]@][host][:port][/database]
```

### Примеры

**С пользователем postgres и паролем:**
```
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/fortnite_course_db
```

**С пользователем postgres без пароля:**
```
DATABASE_URL=postgresql://postgres@localhost:5432/fortnite_course_db
```

**С отдельным пользователем:**
```
DATABASE_URL=postgresql://fortnite_user:your_secure_password@localhost:5432/fortnite_course_db
```

**Для Docker контейнера:**
```
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/fortnite_course_db
```

**Для удаленного сервера:**
```
DATABASE_URL=postgresql://user:password@remote-host.com:5432/fortnite_course_db
```

## Проверка подключения

### Через psql

```bash
# Подключение к созданной базе данных
psql -U postgres -d fortnite_course_db

# Или с указанием хоста и порта
psql -h localhost -p 5432 -U postgres -d fortnite_course_db
```

### Через Python (после настройки .env)

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python -c "from app.core.database import engine; engine.connect(); print('Подключение успешно!')"
```

### Через pgAdmin

1. Откройте pgAdmin
2. Разверните сервер → Databases
3. Должна быть видна база `fortnite_course_db`
4. Двойной клик для подключения

## Решение проблем

### Ошибка: "role does not exist"

```bash
# Создайте пользователя postgres, если его нет
createuser -s postgres
```

### Ошибка: "could not connect to server"

**Проверьте, запущен ли PostgreSQL:**
```bash
# macOS/Linux
brew services list  # для Homebrew
# или
sudo systemctl status postgresql  # для Linux

# Windows: проверьте службы Windows
```

**Запустите PostgreSQL:**
```bash
# macOS (Homebrew)
brew services start postgresql@14

# Linux
sudo systemctl start postgresql

# Windows: через Services или командную строку
net start postgresql-x64-14
```

### Ошибка: "password authentication failed"

- Проверьте правильность пароля в `DATABASE_URL`
- Если забыли пароль пользователя postgres, сбросьте его:
  ```bash
  # macOS/Linux: отредактируйте pg_hba.conf для временного доступа без пароля
  # Windows: используйте pgAdmin для сброса пароля
  ```

### Ошибка: "database does not exist"

- Убедитесь, что база данных создана: `psql -U postgres -l`
- Проверьте правильность имени базы в `DATABASE_URL`

### Ошибка: "connection refused"

- Проверьте, что PostgreSQL слушает на правильном порту (по умолчанию 5432)
- Проверьте настройки файрвола
- Для Docker: убедитесь, что порт проброшен правильно

## Полезные команды PostgreSQL

```sql
-- Список всех баз данных
\l

-- Подключение к базе данных
\c fortnite_course_db

-- Список таблиц
\dt

-- Описание таблицы
\d table_name

-- Выход из psql
\q

-- Справка по командам
\?
```

