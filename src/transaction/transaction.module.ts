import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [TypeOrmModule.forFeature([Product, Transaction])],
})
export class TransactionModule {}
