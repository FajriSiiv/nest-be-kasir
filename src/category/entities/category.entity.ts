import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  // @Column({ type: 'text', nullable: true })
  // description: string;

  // @OneToMany(() => Product, (product) => product.category)
  // products: Product[];
}
