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

### Результати тестів валідації

**Тест: Порожнє ім'я категорії**
```text
{"message":["name must be longer than or equal to 2 characters"],"error":"Bad Request","statusCode":400}
```

**Тест: Від'ємна ціна продукту**
```text
{"message":["price must not be less than 0.01"],"error":"Bad Request","statusCode":400}
```

**Тест: Зайве поле в запиті**
```text
{"message":["property isAdmin should not exist"],"error":"Bad Request","statusCode":400}
```

**Тест: Робота TrimPipe**
```text
{"id":1,"name":"Trimmed","description":null,"createdAt":"2026-04-22T09:01:16.197Z"}
```

**Тест: Успішне створення продукту**
```text
{"id":1,"name":"Valid Product","description":null,"price":99.99,"stock":5,"isActive":true,"category":{"id":1},"createdAt":"2026-04-22T09:01:37.868Z","updatedAt":"2026-04-22T09:01:37.868Z"}
```




  -d '{"name":"Електроніка","description":"Гаджети і пристрої"}'
```

**Результат:**
```json
{
  "id": 1,
  "name": "Електроніка",
  "description": "Гаджети і пристрої",
  "createdAt": "2026-03-26T11:11:23.175Z"
}
```

### 2. Список категорій
```bash
curl http://localhost:3000/api/categories
```

**Результат:**
```json
[
  {
    "id": 1,
    "name": "Електроніка",
    "description": "Гаджети і пристрої",
    "createdAt": "2026-03-26T11:11:23.175Z",
    "products": []
  }
]
```

### 3. Створення продукту з категорією
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name":"iPhone 15",
    "description":"Смартфон",
    "price":999.99,
    "stock":50,
    "categoryId":1
  }'
```

**Результат:**
```json
{
  "id": 1,
  "name": "iPhone 15",
  "description": "Смартфон",
  "price": 999.99,
  "stock": 50,
  "isActive": true,
  "category": {
    "id": 1,
    "name": "Електроніка",
    "description": "Гаджети і пристрої",
    "createdAt": "2026-03-26T11:11:23.175Z"
  },
  "createdAt": "2026-03-26T11:11:31.153Z",
  "updatedAt": "2026-03-26T11:11:31.153Z"
}
```

### 4. Список продуктів
```bash
curl http://localhost:3000/api/products
```

### 5. Отримати один продукт
```bash
curl http://localhost:3000/api/products/1
```

### 6. Оновити продукт
```bash
curl -X PATCH http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":899.99,"stock":45}'
```

### 7. Видалити продукт
```bash
curl -X DELETE http://localhost:3000/api/products/2
```

### 8. Тест 404 помилки
```bash
curl http://localhost:3000/api/products/999
```

**Результат:**
```json
{
  "statusCode": 404,
  "message": "Продукт з ID #999 не знайдений",
  "error": "Not Found"
}
```

---

## 🗄️ Перевірка таблиць у БД

```bash
# Список таблиць
docker compose exec postgres psql -U nestuser -d nestdb -c "\dt"

# Результат:
#            List of relations
#  Schema |    Name    | Type  |  Owner
# --------+------------+-------+----------
#  public | categories | table | nestuser
#  public | migrations | table | nestuser
#  public | products   | table | nestuser
```

### Структура таблиці products
```bash
docker compose exec postgres psql -U nestuser -d nestdb -c "\d products"
```

### Список виконаних міграцій
```bash
docker compose exec postgres psql -U nestuser -d nestdb -c "SELECT * FROM migrations;"
```

---

## 🔧 Командні скрипти для миграцій

```bash
# Генерувати нову міграцію
docker compose run --rm app npm run migration:generate -- src/migrations/UpdateProductSchema

# Запустити міграції
docker compose run --rm app npm run migration:run

# Скасувати останню міграцію
docker compose run --rm app npm run migration:revert
```

---

## 📝 Git Коміти (4 коміти)

```
1. Налаштувати TypeORM міграції, вимкнути synchronize
   - Створено data-source.ts для TypeORM CLI
   - Додано скрипти для роботи з міграціями
   - Встановлено dotenv, ts-node, tsconfig-paths

2. Додати Entity Category та Product зі зв'язком
   - Category entity з OneToMany до Product
   - Product entity з ManyToOne до Category (SET NULL on delete)
   - Створено дві міграції (ручна та згенерована)

3. Реалізувати CRUD модулі Categories та Products
   - CategoriesModule з Service та Controller (5 ендпоінтів)
   - ProductsModule з Service та Controller (5 ендпоінтів)
   - Зареєстровано модулі в AppModule

4. Оновити README зі звітом практики 3
   - Задокументована структура Entity та БД
   - Вказані всі REST API ендпоінти
   - Додані приклади curl запитів та результатів
```

---

## 🏗️ Архітектура рішення

### Entity відносини
```
Category
  ├─ id (PK)
  ├─ name (UNIQUE)
  ├─ description
  ├─ createdAt
  └─ products: Product[]  ← OneToMany

Product
  ├─ id (PK)
  ├─ name
  ├─ description
  ├─ price (DECIMAL 10,2)
  ├─ stock
  ├─ isActive
  ├─ category_id (FK)     ← ManyToOne (SET NULL on delete)
  ├─ createdAt
  ├─ updatedAt
  └─ category: Category
```

### Модульна структура
```
AppModule
├─ ConfigModule (глобальний)
├─ TypeOrmModule (глобальний, з миграціями)
├─ CacheModule (глобальний, Redis)
├─ CategoriesModule
│  ├─ CategoriesService (бізнес-логіка)
│  └─ CategoriesController (5 маршрутів)
└─ ProductsModule
   ├─ ProductsService (бізнес-логіка)
   └─ ProductsController (5 маршрутів)
```

---

## ⭐ Поліпшення якості коду

✅ Міграції: Полна контрольована схема (synchronize: false)
✅ Relations: ManyToOne з CASCADE, індекси та constraints
✅ Error Handling: NotFoundException для 404 помилок
✅ Modules: Модульна архітектура за NestJS best practices
✅ Services: Бізнес-логіка відокремлена від контролерів
✅ Controllers: REST операції через HTTP методи
✅ Git History: Чиста історія з логічними комітами
✅ Environment: .env у .gitignore, .env.example у репо

---

## 📦 Залежності (Практика 3)

```
- TypeORM: ^0.3.28
- @nestjs/typeorm: ^11.0.0
- dotenv: (для CLI міграцій)
- ts-node: (для виконання TypeScript в CLI)
- tsconfig-paths: (для розв'язання module paths)
- pg: ^8.20.0 (PostgreSQL драйвер)
```


