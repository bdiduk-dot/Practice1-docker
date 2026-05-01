import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Category } from '../categories/category.entity';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, JwtAuthGuard, RolesGuard],
  exports: [ProductsService],
})
export class ProductsModule {}
