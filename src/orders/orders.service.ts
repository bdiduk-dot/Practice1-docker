import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: any,
  ) {}

  async create(dto: CreateOrderDto, userId: number): Promise<any> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      let totalPrice = 0;
      const orderItems: any[] = [];

      for (const item of dto.items) {
        const product = await qr.manager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product #${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}": available ${product.stock}, requested ${item.quantity}`,
          );
        }

        product.stock -= item.quantity;
        await qr.manager.save(product);

        const orderItem = qr.manager.create(OrderItem, {
          product,
          quantity: item.quantity,
          price: product.price,
        });
        orderItems.push(orderItem);

        totalPrice += Number(product.price) * item.quantity;
      }

      const order = qr.manager.create(Order, {
        user: { id: userId } as any,
        items: orderItems,
        totalPrice,
        status: OrderStatus.PENDING,
      });

      const saved = await qr.manager.save(order);
      await qr.commitTransaction();

      await this.clearProductsCache();
      return saved;
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  async findAll(query: OrderQueryDto, userId: number, userRole: Role) {
    const page = (query.page as number) || 1;
    const pageSize = (query.pageSize as number) || 10;
    const status = query.status;

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product');

    if (userRole !== Role.ADMIN) {
      qb.andWhere('order.userId = :userId', { userId });
    }

    if (status) {
      qb.andWhere('order.status = :status', { status });
    }

    qb.orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: number, userId: number, userRole: Role): Promise<any> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    if (userRole !== Role.ADMIN && order.user.id !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return order;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<any> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    const currentStatus = order.status;
    const nextStatus = dto.status;

    const allowedTransitions: any = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!allowedTransitions[currentStatus].includes(nextStatus)) {
      throw new BadRequestException(
        `Transition from ${currentStatus} to ${nextStatus} is not allowed`,
      );
    }

    if (nextStatus === OrderStatus.CANCELLED) {
      const qr = this.dataSource.createQueryRunner();
      await qr.connect();
      await qr.startTransaction();
      try {
        for (const item of order.items) {
          const product = await qr.manager.findOne(Product, {
            where: { id: item.product.id },
          });
          if (product) {
            product.stock += item.quantity;
            await qr.manager.save(product);
          }
        }
        order.status = nextStatus;
        await qr.manager.save(order);
        await qr.commitTransaction();
        await this.clearProductsCache();
      } catch (err) {
        await qr.rollbackTransaction();
        throw err;
      } finally {
        await qr.release();
      }
    } else {
      order.status = nextStatus;
      await this.orderRepo.save(order);
    }

    return this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
  }

  async remove(id: number) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return this.orderRepo.remove(order);
  }

  private async clearProductsCache() {
    try {
      const cacheManager: any = this.cacheManager;
      const store = cacheManager.stores?.[0]?.store || cacheManager.store;
      if (store && typeof store.keys === 'function') {
        const keys: string[] = await store.keys('products:*');
        if (keys && keys.length > 0) {
          await Promise.all(keys.map((k: string) => cacheManager.del(k)));
        }
      }
    } catch (e) {
      console.warn('Could not clear products cache:', (e as any).message);
    }
  }
}
