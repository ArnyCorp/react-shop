import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import { Button } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Patterns/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    icon: <SearchOffOutlinedIcon fontSize="large" />,
    title: "No results found",
    description:
      "Try adjusting filters or search terms to find what you are looking for.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    icon: <Inventory2OutlinedIcon fontSize="large" />,
    title: "No products yet",
    description: "Create the first catalog item to start merchandising your shop.",
    action: <Button variant="contained">Add product</Button>,
  },
};
