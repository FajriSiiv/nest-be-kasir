import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { In, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Product)
    private readonly repoProduct: Repository<Product>,
    @InjectRepository(Transaction)
    private readonly repoTransaction: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { productItems } = createTransactionDto;

    const products = await this.repoProduct.find({
      where: {
        id: In(productItems.map((item) => item.productId)),
      },
    });

    const foundProductIds = products.map((product) => product.id);
    const missingProducts = productItems.filter(
      (item) => !foundProductIds.includes(item.productId),
    );

    if (missingProducts.length > 0) {
      const missingProductIds = missingProducts.map((item) => item.productId);
      return new HttpException(
        `Produk dengan ID ${missingProductIds.join(', ')} tidak ditemukan`,
        HttpStatus.NOT_FOUND,
      );
    }

    const total = productItems.reduce((acc, item) => {
      const product = products.find((prod) => prod.id === item.productId);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);

    const transaction = this.repoTransaction.create({
      total,
      productItems: products,
    });

    return this.repoTransaction.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.repoTransaction.find({ relations: ['productItems'] });
  }

  async findOne(id: string) {
    const transaction = await this.repoTransaction.findOne({
      where: {
        id: id,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    return this.repoProduct.findOne({
      where: {
        id: id,
      },
      relations: ['productItems'],
    });
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.repoTransaction.findOne({
      where: {
        id: id,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    const { productItems } = updateTransactionDto;

    const products = await this.repoProduct.find({
      where: {
        id: In(productItems.map((item) => item.productId)),
      },
    });

    const foundProductIds = products.map((product) => product.id);
    const missingProducts = productItems.filter(
      (item) => !foundProductIds.includes(item.productId),
    );

    if (missingProducts.length > 0) {
      const missingProductIds = missingProducts.map((item) => item.productId);
      return new HttpException(
        `Produk dengan ID ${missingProductIds.join(', ')} tidak ditemukan`,
        HttpStatus.NOT_FOUND,
      );
    }

    const total = productItems.reduce((acc, item) => {
      const product = products.find((prod) => prod.id === item.productId);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);

    transaction.total = total;
    transaction.productItems = products;

    return this.repoTransaction.save(transaction);
  }

  async remove(id: string) {
    const transaction = await this.repoTransaction.findOne({
      where: {
        id: id,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    await this.repoTransaction.delete(id);

    return { message: 'Berhasil di hapus' };
  }
}
