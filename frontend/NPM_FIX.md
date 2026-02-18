# Решение проблемы с npm кэшем

## Проблема была решена

Зависимости установлены успешно с использованием альтернативного кэша.

## Что было сделано:

```bash
npm install --legacy-peer-deps --cache /tmp/npm-cache
```

## Для постоянного исправления проблемы с кэшем:

Выполните в терминале (потребуется пароль):

```bash
sudo chown -R 501:20 "/Users/glebgorbat/.npm"
```

Или:

```bash
sudo chown -R $(whoami):staff "/Users/glebgorbat/.npm"
```

## Альтернативное решение (если sudo не работает):

Используйте альтернативный кэш для npm:

```bash
npm config set cache /tmp/npm-cache
```

Или установите переменную окружения:

```bash
export npm_config_cache=/tmp/npm-cache
```

## Обновление Next.js

Next.js 14.0.4 имеет уязвимость безопасности. Рекомендуется обновить до последней версии:

```bash
npm install next@latest --legacy-peer-deps
```

## Предупреждения

- `--legacy-peer-deps` используется для обхода проблем с peer dependencies
- Это нормально для Next.js 14 проектов
- Предупреждения о deprecated пакетах не критичны

## Проверка установки

```bash
npm run dev
```

Приложение должно запуститься на http://localhost:3000

