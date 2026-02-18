#!/usr/bin/env bash
set -e
# Run migrations (creates/updates tables)
cd /app && alembic upgrade head
# Seed data if tables are empty (idempotent)
python scripts/init_db.py || true
# Start the app
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
