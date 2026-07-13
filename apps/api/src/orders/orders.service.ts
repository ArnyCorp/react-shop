import { BadRequestException, Injectable } from "@nestjs/common";
import {
  type CreateOrderInput,
  type Order,
  OrderSchema,
} from "@react-shop/shared/schemas";
import { ProductsService } from "../products/products.service";
import { randomUUID } from "node:crypto";

@Injectable()
export class OrdersService {
  private readonly orders: Order[] = [];

  constructor(private readonly productsService: ProductsService) {}

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }

  create(input: CreateOrderInput): Order {
    const items = input.items.map((line) => {
      const product = this.productsService.findOne(line.productId);
      if (!product) {
        throw new BadRequestException(`Unknown product ${line.productId}`);
      }
      return { product, quantity: line.quantity };
    });

    const order = OrderSchema.parse({
      id: randomUUID(),
      email: input.email,
      items,
      total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      createdAt: new Date().toISOString(),
    });

    this.orders.push(order);
    return order;
  }
}
