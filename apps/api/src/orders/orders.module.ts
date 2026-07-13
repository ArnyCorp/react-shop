import { Module } from "@nestjs/common";
import { PermissionsGuard } from "../auth/permissions.guard";
import { ProductsModule } from "../products/products.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService, PermissionsGuard],
})
export class OrdersModule {}
