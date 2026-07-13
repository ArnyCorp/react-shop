import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  image: z.string().url(),
  category: z.string().min(1),
});

export type Product = z.infer<typeof ProductSchema>;

export const CartItemSchema = z.object({
  product: ProductSchema,
  quantity: z.number().int().positive(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const CartStateSchema = z.object({
  items: z.array(CartItemSchema),
});

export type CartState = z.infer<typeof CartStateSchema>;

export const AddToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;

export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  email: z.string().email(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  items: z.array(CartItemSchema),
  total: z.number().nonnegative(),
  createdAt: z.string().datetime(),
});

export type Order = z.infer<typeof OrderSchema>;
