import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  declare name?: string;
  declare price?: number;
  declare description?: string;
  declare stock?: number;
  declare categoryId?: number;
}
