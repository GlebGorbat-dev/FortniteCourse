#!/usr/bin/env python3
"""
Скрипт для запуска FastAPI бэкенда
Можно использовать в PyCharm как Python скрипт
"""
import os
import sys
import subprocess
import socket
from pathlib import Path

# Определяем директорию скрипта
script_dir = Path(__file__).parent
os.chdir(script_dir)

# Проверка виртуального окружения
venv_path = script_dir / "venv"
if not venv_path.exists():
    venv_path = script_dir / ".venv"

if not venv_path.exists():
    print("Ошибка: виртуальное окружение не найдено!")
    print("Создайте виртуальное окружение: python -m venv venv")
    sys.exit(1)

# Определяем путь к Python из виртуального окружения
if sys.platform == "win32":
    python_path = venv_path / "Scripts" / "python.exe"
    uvicorn_path = venv_path / "Scripts" / "uvicorn.exe"
else:
    python_path = venv_path / "bin" / "python"
    uvicorn_path = venv_path / "bin" / "uvicorn"

# Проверка наличия .env файла
env_file = script_dir / ".env"
if not env_file.exists():
    print("Предупреждение: файл .env не найден!")
    print("Скопируйте env.example в .env и заполните необходимые переменные")

# Проверка и освобождение порта 8000
def is_port_in_use(port):
    """Проверяет, занят ли порт"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def kill_process_on_port(port):
    """Останавливает процесс, занимающий порт"""
    try:
        import subprocess
        result = subprocess.run(
            ['lsof', '-ti', f':{port}'],
            capture_output=True,
            text=True
        )
        if result.returncode == 0 and result.stdout.strip():
            pids = result.stdout.strip().split('\n')
            for pid in pids:
                try:
                    os.kill(int(pid), 9)
                    print(f"Остановлен процесс {pid}, занимавший порт {port}")
                except (OSError, ValueError):
                    pass
    except Exception:
        pass

# Проверка порта перед запуском
if is_port_in_use(8000):
    print("Порт 8000 занят. Останавливаю старые процессы...")
    kill_process_on_port(8000)
    import time
    time.sleep(1)

# Запуск сервера
print("Запуск FastAPI сервера...")
print("Backend будет доступен на: http://localhost:8000")
print("API документация: http://localhost:8000/docs")
print("")
print("Для остановки нажмите Ctrl+C")
print("")

try:
    # Запускаем uvicorn
    subprocess.run([
        str(python_path),
        "-m", "uvicorn",
        "app.main:app",
        "--reload",
        "--host", "0.0.0.0",
        "--port", "8000"
    ])
except KeyboardInterrupt:
    print("\nСервер остановлен")
except Exception as e:
    print(f"Ошибка при запуске: {e}")
    sys.exit(1)

