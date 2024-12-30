import { Category } from 'src/category/entities/category.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'integer' })
  price: number;

  @Column('varchar', { array: true })
  categories: string[];

  @ManyToMany(() => Transaction, (transaction) => transaction.productItems)
  transactions: Transaction[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
