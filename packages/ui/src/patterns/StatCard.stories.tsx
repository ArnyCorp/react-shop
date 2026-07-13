import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { StatCard } from "./StatCard";

const meta = {
  title: "Patterns/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  args: {
    value: "$24.8k",
    label: "Revenue",
    helperText: "Up 12% from last week",
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Linked: Story = {
  args: {
    value: "128",
    label: "Open orders",
    helperText: "24 need review",
    href: "#orders",
    detailLabel: "View order details",
  },
};

export const DetailAction: Story = {
  args: {
    value: "18",
    label: "Support tickets",
    helperText: "6 waiting on a manager",
    onClick: fn(),
    detailLabel: "View ticket details",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const detailControl =
      canvas.queryByRole("link", { name: /view ticket details/i }) ??
      canvas.queryByRole("button", { name: /view ticket details/i });

    if (detailControl) {
      await userEvent.click(detailControl);
      await expect(args.onClick).toHaveBeenCalled();
    }
  },
};
