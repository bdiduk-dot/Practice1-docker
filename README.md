# MiniShop REST API — NestJS, PostgreSQL, Redis

## Студент
- **Ім'я:** Дідик Богдан
- **Група:** 232/2

## Практичне заняття №4: DTO, class-validator, Pipes

### Структура репозиторію
```
.
├── src/
│   ├── categories/
│   │   ├── dto/
│   │   │   ├── create-category.dto.ts
│   │   │   └── update-category.dto.ts
│   │   ├── category.entity.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── categories.controller.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── common/
│   │   └── pipes/
│   │     └── trim.pipe.ts
│   ├── migrations/
│   ├── data-source.ts
│   ├── main.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Запуск проекту
```bash
cp .env.example .env
docker compose up --build
```

### Тест валідації — порожнє ім'я категорії
```text
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 104
ETag: W/"68-QQoQMoGWo427YCpDKWhkpJ+XbE0"
Date: Fri, 01 May 2026 09:03:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":["name must be longer than or equal to 2 characters"],"error":"Bad Request","statusCode":400}
```

### Тест валідації — від'ємна ціна продукту
```text
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 87
ETag: W/"57-MJKZQ9pE6jw6kXj6cwcgLMW1I1I"
Date: Fri, 01 May 2026 09:03:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":["price must not be less than 0.01"],"error":"Bad Request","statusCode":400}
```

### Тест валідації — зайве поле
```text
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 88
ETag: W/"58-EYMM4JjPU5mHLuAIfjqOIhjlM34"
Date: Fri, 01 May 2026 09:03:51 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":["property isAdmin should not exist"],"error":"Bad Request","statusCode":400}
```

### Тест TrimPipe
```text
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 91
ETag: W/"5b-kpeAf0oVAPnUZsuBfXUVxJW1ABI"
Date: Fri, 01 May 2026 09:04:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":3,"name":"Trimmed Example","description":null,"createdAt":"2026-05-01T09:04:08.755Z"}
```

### Тест валідне створення продукту
```text
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 269
ETag: W/"10d-vhHYq11iAFUTRWtu+FgRWIxSJLw"
Date: Fri, 01 May 2026 09:04:17 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":2,"name":"iPhone 16","description":null,"price":999.99,"stock":50,"isActive":true,"category":{"id":3,"name":"Trimmed Example","description":null,"createdAt":"2026-05-01T09:04:08.755Z"},"createdAt":"2026-05-01T09:04:17.336Z","updatedAt":"2026-05-01T09:04:17.336Z"}
```

Troubleshooting — типові проблеми
1) "An unknown value was passed to the validate function"
Симптоми: помилка при виклику POST/PATCH ендпоінтів.
Що зробити:
•   Переконатись, що class-transformer встановлений: docker compose run --rm app npm ls class-transformer
•   Перевірити, що transform: true увімкнено в ValidationPipe
•   Перезібрати образ: docker compose up --build

2) Валідація не працює — будь-які дані проходять
Симптоми: POST з порожнім тілом або невалідними даними повертає 201 замість 400.
Що зробити:
•   Перевірити, що ValidationPipe додано в main.ts: app.useGlobalPipes(...)
•   Перевірити, що контролер використовує DTO-тип: @Body() dto: CreateProductDto (не body: any)
•   Перевірити, що у tsconfig.json є: "emitDecoratorMetadata": true та "experimentalDecorators": true

3) "Cannot find module './dto/create-category.dto'"
Симптоми: помилка при компіляції TypeScript.
Що зробити:
•   Перевірити шлях: файл має бути в src/categories/dto/create-category.dto.ts
•   Перевірити правильність імпорту в контролері та сервісі
•   Перевірити, що ім'я файлу точно збігається (case-sensitive в Linux)

4) "property isAdmin should not exist" — але я не надсилав isAdmin
Симптоми: 400 помилка з несподіваним полем.
Що зробити:
•   Перевірити JSON в curl — можлива помилка в лапках або структурі
•   Спробувати через Postman — буде видно точне тіло запиту
•   Якщо потрібно тимчасово дозволити зайві поля — змінити forbidNonWhitelisted на false (але для здачі має бути true)

5) TrimPipe не працює — пробіли залишаються
Симптоми: name зберігається з пробілами.
Що зробити:
•   Перевірити порядок Pipes в main.ts: TrimPipe має бути ПЕРЕД ValidationPipe
•   Перевірити, що TrimPipe імпортований правильно
•   Перезапустити: docker compose restart app



