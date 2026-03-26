# CRUD REST API для MiniShop — NestJS + PostgreSQL + Redis

## 📌 Студент
- **Ім'я:** Дідик Богдан
- **Група:** 232/2 of

---

## 📋 Практичне заняття №3 — CRUD REST API для MiniShop: Entity, міграції, контролери

### Цілі практики
✅ Переведено на міграції (synchronize: false)
✅ Створено Entity (Category, Product) зі зв'язком ManyToOne
✅ Написано міграцію вручну (CreateTables)
✅ Згенеровано другу міграцію (AddIndexesToProducts)
✅ Реалізовано CategoriesModule з CRUD (5 ендпоінтів)
✅ Реалізовано ProductsModule з CRUD (5 ендпоінтів)
✅ Протестовано всі 10 ендпоінтів API

---

## 📁 Структура репозиторію (Практика 3)

```
src/
├── migrations/
│   ├── 1774519795976-CreateTables.ts         # Міграція (ручна)
│   └── 1774520000000-AddIndexesToProducts.ts # Міграція (індекси)
├── categories/
│   ├── category.entity.ts        # Entity для категорії
│   ├── categories.module.ts       # NestJS модуль
│   ├── categories.service.ts      # Бізнес-логіка
│   └── categories.controller.ts   # HTTP ендпоінти (5)
├── products/
│   ├── product.entity.ts          # Entity для продукту (ManyToOne до Category)
│   ├── products.module.ts         # NestJS модуль
│   ├── products.service.ts        # Бізнес-логіка
│   └── products.controller.ts     # HTTP ендпоінти (5)
├── data-source.ts                 # TypeORM CLI конфігурація
├── app.module.ts                  # Головний модуль (з миграціями)
└── main.ts                         # Точка входу

Dockerfile, docker-compose.yml, .env.example
```

---

## 🚀 Запуск проекту

```bash
# 1. Копіювати змінні оточення
cp .env.example .env

# 2. Запустити контейнери
docker compose up --build

# 3. Застосунок буде доступний на http://localhost:3000
```

Міграції виконуються автоматично при старті (migrationsRun: true).

---

## 📊 Структура БД

### Таблиця `categories`
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  "createdAt" TIMESTAMP DEFAULT now()
);
```

### Таблиця `products` 
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
```

---

## 🔌 REST API Ендпоінти

### Categories (5 ендпоінтів)

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/api/categories` | Список всіх категорій |
| GET | `/api/categories/:id` | Отримати одну категорію |
| POST | `/api/categories` | Створити нову категорію |
| PATCH | `/api/categories/:id` | Оновити категорію |
| DELETE | `/api/categories/:id` | Видалити категорію |

### Products (5 ендпоінтів)

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/api/products` | Список всіх продуктів (з категоріями) |
| GET | `/api/products/:id` | Отримати один продукт |
| POST | `/api/products` | Створити новий продукт |
| PATCH | `/api/products/:id` | Оновити продукт |
| DELETE | `/api/products/:id` | Видалити продукт |

---

## ✅ Приклади запитів до API

### 1. Створення категорії
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
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

---

## 🎓 Оцінювання

**Максимальна кількість балів: 11**

- ✅ 2 бали: synchronize: false + міграції
- ✅ 1 бал: Entity Category + Product зі зв'язком
- ✅ 2 бали: CategoriesModule — CRUD працює
- ✅ 2 бали: ProductsModule — CRUD працює  
- ✅ 2 бали: docker compose up --build — проєкт запускається з нуля
- ✅ 1 бал: README зі звітом + коміти (мін. 3)
- ✅ 1 бал: Загальна якість коду та структура

---

## 📚 Додаткова інформація

### Практика 1 — Docker Basics
- Встановлено Docker Desktop з WSL2
- Налаштовано Docker Compose мережу

### Практика 2 — NestJS + БД + Cache
- Запущено NestJS, PostgreSQL, Redis
- Налаштовано TypeORM з synchronize: true

### Практика 3 — CRUD API з міграціями (ЦЯ ПРАКТИКА)
- Переведено на контрольовані міграції (synchronize: false)
- Реалізовано повний REST CRUD API для категорій та продуктів
- Документовано всі ендпоінти та их функціональність

---

*Практична робота №3 | Дідик Богдан | Група 232/2 of | 26.03.2026*
