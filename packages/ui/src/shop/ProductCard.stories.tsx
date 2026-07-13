import type { Meta, StoryObj } from "@storybook/react";
import { SAMPLE_PRODUCTS } from "@react-shop/shared";
import { fn } from "@storybook/test";
import { ProductCard } from "./ProductCard";

const meta = {
  title: "Shop/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  args: {
    product: SAMPLE_PRODUCTS[0],
    onAddToCart: fn(),
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutCartAction: Story = {
  args: {
    onAddToCart: undefined,
  },
};
