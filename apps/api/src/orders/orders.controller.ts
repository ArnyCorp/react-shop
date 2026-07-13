import { Body, Controller, Get, Param, Post, NotFoundException } from "@nestjs/common";
import { CreateOrderSchema } from "@react-shop/shared/schemas";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    const order = this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  @Post()
  create(@Body(new ZodValidationPipe(CreateOrderSchema)) body: unknown) {
    return this.ordersService.create(CreateOrderSchema.parse(body));
  }
}
