import { Injectable } from "@nestjs/common";
import { SAMPLE_PRODUCTS } from "@react-shop/shared/constants";
import { ProductSchema, type Product } from "@react-shop/shared/schemas";

@Injectable()
export class ProductsService {
  private readonly products: Product[] = SAMPLE_PRODUCTS.map((product) =>
    ProductSchema.parse(product),
  );

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
}
