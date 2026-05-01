import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrders1777634845986 implements MigrationInterface {
    name = 'CreateOrders1777634845986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "totalPrice" numeric(10,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "orderId" integer, "productId" integer, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_cdb99c05982d5191ac8465ac010"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "updatedAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "createdAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "isActive" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "stock" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "createdAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordHash"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordHash" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "users_email_key" UNIQUE ("email")`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`CREATE INDEX "idx_products_is_active" ON "products" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "idx_products_category_id" ON "products" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
