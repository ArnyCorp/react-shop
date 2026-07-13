import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ShopHeader } from "./ShopHeader";

const meta = {
  title: "Shop/ShopHeader",
  component: ShopHeader,
  tags: ["autodocs"],
  args: {
    brand: "React Shop",
    cartCount: 3,
    onCartClick: fn(),
  },
} satisfies Meta<typeof ShopHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyCart: Story = {
  args: {
    cartCount: 0,
  },
};
