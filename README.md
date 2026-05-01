# MiniShop REST API — Практика 5 (JWT, Guards, RBAC)

## Студент
- Имя: Дідик Богдан
- Группа: 232/2

## Запуск проекта
```bash
cp .env.example .env
docker compose up --build
```

## Структура репозитория
```text
.
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── auth.controller.ts
│   ├── users/
│   │   ├── user.entity.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── common/
│   │   ├── enums/
│   │   │   └── role.enum.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   └── pipes/
│   │     └── trim.pipe.ts
│   ├── categories/
│   ├── products/
│   ├── migrations/
│   ├── data-source.ts
│   ├── main.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints
| Method | URL | Auth | Role |
|--------|-----|------|------|
| POST | /auth/register | - | - |
| POST | /auth/login | - | - |
| GET | /api/categories | - | - |
| POST | /api/categories | JWT | admin |
| PATCH | /api/categories/:id | JWT | admin |
| DELETE | /api/categories/:id | JWT | admin |
| GET | /api/products | - | - |
| GET | /api/products/:id | - | - |
| POST | /api/products | JWT | admin |
| PATCH | /api/products/:id | JWT | admin |
| DELETE | /api/products/:id | JWT | admin |

## Подготовка для тестов
Сделать пользователя админом:
```bash
docker compose exec postgres psql -U nestuser -d nestdb -c "UPDATE users SET role = 'admin' WHERE email = 'admin5@test.com';"
```

## Тесты (curl)

### 1) Регистрация пользователя
Команда:
```bash
curl --% -s -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"email\": \"admin5@test.com\", \"password\": \"password123\", \"name\": \"Admin\"}"
```
Ответ:
```json
{"id":1,"email":"admin5@test.com","name":"Admin","role":"user","createdAt":"2026-05-01T09:20:33.709Z"}
```

### 2) Логин (получение токена)
Команда:
```bash
curl --% -s -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\": \"admin5@test.com\", \"password\": \"password123\"}"
```
Ответ:
```json
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW41QHRlc3QuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc3NjI3MjQ5LCJleHAiOjE3Nzc2MzA4NDl9.jwM59OD4oH1Yq_GvwGhkOLrW24s3AxGN2nfZ4ZqFETA"}
```

### 3) 401 Unauthorized (без токена)
Команда:
```bash
curl --% -s -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d "{\"name\": \"Hacked Product\", \"price\": 1}"
```
Ответ:
```json
{"message":"Missing authorization token","error":"Unauthorized","statusCode":401}
```

### 4) 403 Forbidden (роль user)
Команда:
```bash
curl --% -s -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoidXNlcjVAdGVzdC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3NzYyNzI1NCwiZXhwIjoxNzc3NjMwODU0fQ.564WiIoH6X9fTzOFhASE5lntkZ9jWf7Hjc0iYuTZZYo" -d "{\"name\": \"Blocked Product\", \"price\": 99}"
```
Ответ:
```json
{"message":"Insufficient permissions","error":"Forbidden","statusCode":403}
```

### 5) Успешное создание продукта (роль admin)
Команда:
```bash
curl --% -s -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW41QHRlc3QuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc3NjI3MjQ5LCJleHAiOjE3Nzc2MzA4NDl9.jwM59OD4oH1Yq_GvwGhkOLrW24s3AxGN2nfZ4ZqFETA" -d "{\"name\": \"MacBook Pro\", \"price\": 2499.99, \"stock\": 10}"
```
Ответ:
```json
{"id":3,"name":"MacBook Pro","description":null,"price":2499.99,"stock":10,"isActive":true,"createdAt":"2026-05-01T09:21:12.340Z","updatedAt":"2026-05-01T09:21:12.340Z"}
```

## Troubleshooting

1) "Cannot read properties of undefined (reading 'role')" в RolesGuard
- Проверьте порядок Guards: @UseGuards(JwtAuthGuard, RolesGuard)
- Проверьте, что JwtAuthGuard записывает user в request
- Проверьте, что JWT payload содержит role

2) "Nest can't resolve dependencies of the JwtAuthGuard"
- Проверьте, что модуль импортирует AuthModule
- Проверьте, что AuthModule exports JwtModule
- Пересоберите контейнер: docker compose up --build

3) "invalid signature" при verify
- Проверьте, что JWT_SECRET одинаковый при генерации и проверке
- После смены JWT_SECRET нужно логиниться заново

4) Роль изменилась в БД, но токен все еще user
- Роль записывается в JWT при логине, нужен повторный логин
- Проверка в БД: docker compose exec postgres psql -U nestuser -d nestdb -c "SELECT id, email, role FROM users;"

5) "relation 'users' does not exist"
- Проверьте, что миграция для users добавлена и применена
- Проверьте, что migrationsRun: true
- Перезапуск: docker compose down && docker compose up --build

6) Ошибка типов bcrypt
- Проверьте, что установлен @types/bcrypt
- Используйте import * as bcrypt from 'bcrypt'
