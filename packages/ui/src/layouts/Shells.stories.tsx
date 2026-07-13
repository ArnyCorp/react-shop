import { Box, Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "../patterns/EmptyState";
import { PageHeader } from "../patterns/PageHeader";
import { StatCard } from "../patterns/StatCard";
import { DashboardShell } from "./DashboardShell";
import { UserShell } from "./UserShell";

const meta = {
  title: "Layouts/Shells",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "UserShell reads the account name from the auth store. DashboardShell filters its sidebar with useCan, so changing the Storybook Role toolbar changes which dashboard nav items are visible.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BothShells: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box sx={{ overflow: "hidden", borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <UserShell>
          <PageHeader
            eyebrow="Customer account"
            title="Welcome back"
            description="Review recent orders and keep account preferences up to date."
          />
        </UserShell>
      </Box>

      <Box sx={{ overflow: "hidden", borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <DashboardShell title="Operations overview">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            <StatCard value="42" label="Open orders" helperText="8 need review" href="#orders" />
            <StatCard value="12" label="Active users" helperText="3 new this week" href="#users" />
            <StatCard value="96%" label="Fulfillment SLA" helperText="On target" />
          </Box>
          <EmptyState
            title="No escalations"
            description="Everything that needs a manager review has been cleared."
          />
        </DashboardShell>
      </Box>
    </Stack>
  ),
};

export const DashboardOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the Role toolbar to compare guest, user, support, manager, and admin dashboard navigation.",
      },
    },
  },
  render: () => (
    <DashboardShell title="Role-aware dashboard">
      <PageHeader
        eyebrow="Role toolbar demo"
        title="Dashboard navigation"
        description="Overview remains visible; Users, Orders, Catalog, and Settings appear when the selected role grants the required permissions."
      />
    </DashboardShell>
  ),
};
