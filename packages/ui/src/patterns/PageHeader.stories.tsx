import { Button } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./PageHeader";

const meta = {
  title: "Patterns/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  args: {
    eyebrow: "Operations",
    title: "Orders dashboard",
    description:
      "Track fulfillment status, review open issues, and keep the team aligned on today's orders.",
    breadcrumbs: [
      { label: "Dashboard", href: "#" },
      { label: "Orders" },
    ],
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="outlined" color="inherit">
          Export
        </Button>
        <Button variant="contained">Create order</Button>
      </>
    ),
  },
};
