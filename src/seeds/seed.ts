import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

const ds = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  username: process.env.POSTGRES_USER || 'nestuser',
  password: process.env.POSTGRES_PASSWORD || 'nestpassword',
  database: process.env.POSTGRES_DB || 'nestdb',
});

async function seed() {
  await ds.initialize();

  // Користувачі
  console.log('Seeding users...');
  const salt = await bcrypt.genSalt();
  const adminPass = await bcrypt.hash('admin123', salt);
  const userPass = await bcrypt.hash('user123', salt);

  await ds.query(
    `INSERT INTO users (email, "passwordHash", name, role)
     VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)
     ON CONFLICT (email) DO NOTHING`,
    [
      'admin@test.com', adminPass, 'Admin User', 'admin',
      'user@test.com', userPass, 'Regular User', 'user'
    ],
  );

  // Категорії
  console.log('Seeding categories...');
  const cats = ['Electronics', 'Accessories', 'Clothing'];
  const catIds: Record<string, number> = {};
  
  for (const name of cats) {
    const res = await ds.query(
      `INSERT INTO categories (name) VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [name],
    );
    catIds[name] = res[0].id;
  }

  // Продукти
  console.log('Seeding products...');
  const products = [
    { name: 'iPhone 16', price: 999, stock: 50, cat: 'Electronics' },
    { name: 'Galaxy S24', price: 849, stock: 40, cat: 'Electronics' },
    { name: 'MacBook Pro', price: 2499, stock: 15, cat: 'Electronics' },
    { name: 'iPad Air', price: 599, stock: 30, cat: 'Electronics' },
    { name: 'AirPods Pro', price: 249, stock: 100, cat: 'Accessories' },
    { name: 'USB-C Cable', price: 19, stock: 500, cat: 'Accessories' },
    { name: 'MagSafe Charger', price: 39, stock: 80, cat: 'Accessories' },
    { name: 'Laptop Sleeve', price: 49, stock: 60, cat: 'Accessories' },
    { name: 'T-Shirt Dev', price: 25, stock: 200, cat: 'Clothing' },
    { name: 'Hoodie NestJS', price: 55, stock: 75, cat: 'Clothing' },
  ];

  for (let i = 0; i < 3; i++) {
    for (const p of products) {
      const suffix = i > 0 ? ` v${i + 1}` : '';
      await ds.query(
        `INSERT INTO products
           (name, price, stock, category_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [`${p.name}${suffix}`, p.price + i * 10,
         p.stock, catIds[p.cat]],
      );
    }
  }

  console.log('Seed complete: 2 users, 3 categories, 30 products');
  await ds.destroy();
}

seed().catch(console.error);
