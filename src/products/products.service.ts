import {
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }

  async create(createProductDto: CreateProductDto) {
    return await this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const records = await this.product.count({ where: { deletedAt: null } });
    const lastPage = Math.ceil(records / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { deletedAt: null },
      }),
      meta: {
        page,
        records,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, deletedAt: null },
    });

    if (!product)
      throw new RpcException({
        message: `Product with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const { id: _, ...data } = updateProductDto;

    return this.product.update({
      data,
      where: { id },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async validateProducts(ids: number[]) {
    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
        deletedAt: null,
      },
    });

    if (products.length !== ids.length) {
      const notFoundIds = ids.filter(
        (id) => products.find((product) => product.id === id) === undefined,
      );

      throw new RpcException({
        message: `Some products were not found (${notFoundIds})`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}
