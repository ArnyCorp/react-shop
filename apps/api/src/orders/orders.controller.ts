import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateOrderSchema } from "@react-shop/shared/schemas";
import { RequirePermissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"), PermissionsGuard)
  @RequirePermissions("orders:read")
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), PermissionsGuard)
  @RequirePermissions("orders:read")
  findOne(@Param("id") id: string) {
    const order = this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  @Post()
  @UseGuards(AuthGuard("jwt"), PermissionsGuard)
  @RequirePermissions("orders:write")
  create(@Body(new ZodValidationPipe(CreateOrderSchema)) body: unknown) {
    return this.ordersService.create(CreateOrderSchema.parse(body));
  }
}
