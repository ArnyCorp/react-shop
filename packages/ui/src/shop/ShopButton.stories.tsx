import type { Meta, StoryObj } from "@storybook/react";
import { ShopButton } from "./ShopButton";

const meta = {
  title: "Primitives/ShopButton",
  component: ShopButton,
  tags: ["autodocs"],
  args: {
    children: "Shop now",
  },
} satisfies Meta<typeof ShopButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    color: "secondary",
    children: "Checkout",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    color: "inherit",
    children: "View cart",
  },
};
