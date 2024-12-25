import { IsArray, IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsArray()
  @IsNotEmpty()
  productItems: { productId: string; quantity: number }[];

  @IsInt()
  total: number;
}
