import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesToProducts1774520000000 implements MigrationInterface {
  name = 'AddIndexesToProducts1774520000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX idx_products_category_id ON products(category_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_products_is_active ON products("isActive")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_products_is_active`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_products_category_id`);
  }
}
