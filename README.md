## Student
- Name: Р”С–РґРёРє Р‘РѕРіРґР°РЅ
- Group: 232/2
 
## РџСЂР°РєС‚РёС‡РЅРµ Р·Р°РЅСЏС‚С‚СЏ в„–6 вЂ” Interceptors + Exception Filters + Swagger
 
### РЎС‚СЂСѓРєС‚СѓСЂР° СЂРµРїРѕР·РёС‚РѕСЂС–СЋ
```
.
в”њв”Ђв”Ђ src/
в”‚   в”њв”Ђв”Ђ auth/ ...
в”‚   в”њв”Ђв”Ђ users/ ...
в”‚   в”њв”Ђв”Ђ categories/ ...
в”‚   в”њв”Ђв”Ђ products/ ...
в”‚   в”њв”Ђв”Ђ common/
в”‚   в”‚   в”њв”Ђв”Ђ enums/
в”‚   в”‚   в”‚   в””в”Ђв”Ђ role.enum.ts
в”‚   в”‚   в”њв”Ђв”Ђ guards/
в”‚   в”‚   в”‚   в”њв”Ђв”Ђ jwt-auth.guard.ts
в”‚   в”‚   в”‚   в””в”Ђв”Ђ roles.guard.ts
в”‚   в”‚   в”њв”Ђв”Ђ decorators/
в”‚   в”‚   в”‚   в”њв”Ђв”Ђ current-user.decorator.ts
в”‚   в”‚   в”‚   в””в”Ђв”Ђ roles.decorator.ts
в”‚   в”‚   в”њв”Ђв”Ђ interceptors/
в”‚   в”‚   в”‚   в”њв”Ђв”Ђ logging.interceptor.ts
в”‚   в”‚   в”‚   в””в”Ђв”Ђ transform.interceptor.ts
в”‚   в”‚   в”њв”Ђв”Ђ filters/
в”‚   в”‚   в”‚   в””в”Ђв”Ђ http-exception.filter.ts
в”‚   в”‚   в””в”Ђв”Ђ pipes/
в”‚   в”‚   	в””в”Ђв”Ђ trim.pipe.ts
в”‚   в”њв”Ђв”Ђ migrations/
в”‚   в”њв”Ђв”Ђ main.ts
в”‚   в””в”Ђв”Ђ app.module.ts
в”њв”Ђв”Ђ swagger-screenshot.png
в”њв”Ђв”Ђ Dockerfile
в”њв”Ђв”Ђ docker-compose.yml
в””в”Ђв”Ђ README.md
```
 
### Р—Р°РїСѓСЃРє РїСЂРѕРµРєС‚Сѓ
```bash
cp .env.example .env
docker compose up --build
```
 
### Swagger UI
http://localhost:3000/api/docs
 
![Swagger](swagger-screenshot.png)
 
### Р¤РѕСЂРјР°С‚ СѓСЃРїС–С€РЅРѕС— РІС–РґРїРѕРІС–РґС–
```json
{
  "data": {
    "id": 1,
    "name": "iPhone 16",
    "price": 999.99
  },
  "statusCode": 200,
  "timestamp": "2026-05-01T09:49:12.929Z"
}
```
 
### Р¤РѕСЂРјР°С‚ РїРѕРјРёР»РєРё
```json
{
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": [
      "name must be longer than or equal to 2 characters"
    ],
    "traceId": "0b26ba0d-e16e-438a-a1b8-0dd234443c99"
  },
  "timestamp": "2026-05-01T09:49:32.104Z"
}
```
 
### РџСЂРёРєР»Р°Рґ Р»РѕРіС–РІ (LoggingInterceptor)
```text
[Nest] 29  - 05/01/2026, 9:49:09 AM     LOG [HTTP] GET /api/products вЂ” 200 вЂ” 18ms
[Nest] 29  - 05/01/2026, 9:49:12 AM     LOG [HTTP] GET /api/products вЂ” 200 вЂ” 2ms
```
 
### РўРµСЃС‚ РїРѕРјРёР»РєРё Р· traceId
```text
curl.exe -s http://localhost:3000/api/products/999
{"error":{"code":404,"message":"РџСЂРѕРґСѓРєС‚ Р· ID #999 РЅРµ Р·РЅР°Р№РґРµРЅРёР№","traceId":"529f8192-0923-4ec3-95cd-6dd7f5f7f101"},"timestamp":"2026-05-01T09:49:24.953Z"}
```

## Практичне заняття №7: Redis кешування + Query параметри + Pagination

### Нові можливості
- **Пагінація**: page та pageSize (max 100).
- **Сортування**: sort (name, price, stock, createdAt) та order (asc, desc).
- **Фільтрація**: categoryId, minPrice, maxPrice.
- **Пошук**: search (по назві, ILIKE).
- **Redis Кешування**: Список продуктів кешується на 60 секунд. Кеш автоматично очищується при створенні/оновленні/видаленні продуктів.

### Приклад запиту
GET /api/products?page=1&pageSize=10&categoryId=1&sort=price&order=asc&search=iPhone

### Сідінг даних
Для тестування додано скрипт наповнення бази:
\\\ash
docker compose run --rm app npm run seed
\\\`nВін створює 3 категорії та 30 тестових продуктів.
