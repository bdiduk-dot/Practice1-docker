import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1777700000000 implements MigrationInterface {
  name = 'CreateUsers1777700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "users_role_enum" AS ENUM ('user', 'admin')`,
    );

    await queryRunner.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        "passwordHash" VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        role "users_role_enum" NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMP DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS users');
    await queryRunner.query('DROP TYPE IF EXISTS "users_role_enum"');
  }
}
