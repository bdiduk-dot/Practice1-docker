import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Електроніка',
    description: 'Назва категорії',
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'Гаджети та пристрої',
    description: 'Опис категорії',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
