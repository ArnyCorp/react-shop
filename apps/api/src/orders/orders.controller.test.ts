import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { PERMISSIONS_KEY } from "../auth/permissions.decorator";
import { OrdersController } from "./orders.controller";

describe("OrdersController", () => {
  it("requires orders:read on list and detail endpoints", () => {
    expect(Reflect.getMetadata(PERMISSIONS_KEY, OrdersController.prototype.findAll)).toEqual([
      "orders:read",
    ]);
    expect(Reflect.getMetadata(PERMISSIONS_KEY, OrdersController.prototype.findOne)).toEqual([
      "orders:read",
    ]);
  });

  it("requires orders:write and delegates create to OrdersService", () => {
    const ordersService = {
      create: vi.fn().mockReturnValue({ id: "order-1", status: "pending" }),
    };
    const controller = new OrdersController(ordersService as never);
    const body = {
      email: "user@react-shop.dev",
      items: [{ productId: "prod-1", quantity: 1 }],
    };

    const result = controller.create(body);

    expect(Reflect.getMetadata(PERMISSIONS_KEY, OrdersController.prototype.create)).toEqual([
      "orders:write",
    ]);
    expect(ordersService.create).toHaveBeenCalledWith(body);
    expect(result).toEqual({ id: "order-1", status: "pending" });
  });
});
