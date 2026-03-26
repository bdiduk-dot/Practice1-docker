# Docker + NestJS + PostgreSQL + Redis Setup

## Student
- Name: Дiдик Богдан
- Group: 232/2 off

---

## 📋 Практичне заняття №1 — Docker + Docker Compose

### Що виконано:
- ✅ Docker Desktop встановлений та запущений (WSL2)
- ✅ Docker Compose налаштований та перевірений
- ✅ NestJS CLI встановлений в Dockerfile

### Файли практики 1:
- `Dockerfile` — базовий образ з node:20-alpine та @nestjs/cli
- `docker-compose.yml` — конфігурація мережі та база

---

## 📋 Практичне заняття №2 — NestJS + PostgreSQL + Redis

### Структура репозиторію
```
.
├── src/              # NestJS source code
├── Dockerfile
├── docker-compose.yml
├── .env.example      # шаблон змінних оточення
├── package.json
├── tsconfig.json
└── README.md
```

### Запуск проекту
```bash
cp .env.example .env   # налаштувати значення (якщо потрібно)
docker compose up --build
```

### Перевірка сервісів
```text
NAME                   IMAGE                COMMAND                   SERVICE    CREATED              STATUS                    PORTS
practice1-app-1        practice1-app        "docker-entrypoint.s…"   app        57 seconds ago       Up 19 seconds             0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
practice1-postgres-1   postgres:16-alpine   "docker-entrypoint.s…"   postgres   About a minute ago   Up 25 seconds (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
practice1-redis-1      redis:7-alpine       "docker-entrypoint.s…"   redis      About a minute ago   Up 25 seconds (healthy)   0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp
```

### Перевірка PostgreSQL
```text
                                                      List of databases
   Name    |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | ICU Locale | ICU Rules |   Access privileges   
-----------+----------+----------+-----------------+------------+------------+------------+-----------+-----------------------
 nestdb    | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 postgres  | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 template0 | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/nestuser          +
           |          |          |                 |            |            |            |           | nestuser=CTc/nestuser
 template1 | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/nestuser          +
           |          |          |                 |            |            |            |           | nestuser=CTc/nestuser
(4 rows)
```

### Перевірка Redis
```text
PONG
```

### Перевірка застосунку
```text
Hello World!
```

### Логи NestJS (фрагмент успішного запуску)
```text
[10:48:15 AM] Starting compilation in watch mode...

[10:48:18 AM] Found 0 errors. Watching for file changes.

[Nest] 29  - 03/26/2026, 10:48:18 AM     LOG [NestFactory] Starting Nest application...
[Nest] 29  - 03/26/2026, 10:48:18 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +39ms
[Nest] 29  - 03/26/2026, 10:48:18 AM     LOG [InstanceLoader] ConfigHostModule dependencies initialized +0ms
[Nest] 29  - 03/26/2026, 10:48:18 AM     LOG [InstanceLoader] AppModule dependencies initialized +0ms
[Nest] 29  - 03/26/2026, 10:48:18 AM     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
[Nest] 29  - 03/26/2026, 10:48:18 AM     LOG [InstanceLoader] CacheModule dependencies initialized +7ms
[Nest] 29  - 03/26/2026, 10:48:18 AM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +29ms
[Nest] 29  - 03/26/2026, 10:48:18 AM     LOG [RoutesResolver] AppController {/}: +2ms
[Nest] 29  - 03/26/2026, 10:48:18 AM     LOG [RouterExplorer] Mapped {/, GET} route +1ms
[Nest] 29  - 03/26/2026, 10:48:18 AM     LOG [NestApplication] Nest application successfully started +1ms
```

## Деталі реалізації

### Dockerfile
- Використовує `node:20-alpine` для мікроскопічного розміру образу
- Встановлює `@nestjs/cli` глобально для розробки
- Запускає приложение в режимі `npm run start:dev` для watch-mode розробки

### docker-compose.yml
- **app**: NestJS контейнер на порту 3000
- **postgres**: PostgreSQL 16 на порту 5432 з healthcheck
- **redis**: Redis 7 на порту 6379 з healthcheck
- Всі сервіси підключені до спільної мережі `nestnet`
- PostgreSQL має persistent volume `postgres_data`

### app.module.ts
- Підключено `ConfigModule` для завантаження змінних з `.env`
- Підключено `TypeOrmModule` з параметрами з env-змінних
- Підключено `CacheModule` з Redis store для кеширування
- `synchronize: true` для розробки (НЕ ВИКОРИСТОВУВАТИ У PRODUCTION)

### Файли практики 2:
- `src/` — NestJS проект з app.module.ts, app.controller.ts, main.ts
- `docker-compose.yml` — розширена конфігурація з app, postgres, redis
- `.env.example` — змінні оточення для PostgreSQL та Redis
- `Dockerfile` — оновлено для NestJS розробки з npm start:dev

## Примітки
- `.env.example` містить шаблон змінних оточення
- `.env` повинен бути у `.gitignore` (для навчання додатий до репо)
- Всі три сервіси успішно запускаються та комунікують один з одним
