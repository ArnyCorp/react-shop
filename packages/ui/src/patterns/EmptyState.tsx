import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        borderRadius: 4,
        border: "1px dashed",
        borderColor: "divider",
        bgcolor: "background.paper",
        px: { xs: 3, md: 6 },
        py: { xs: 5, md: 7 },
        textAlign: "center",
      }}
    >
      <Stack spacing={2} alignItems="center" maxWidth={520} mx="auto">
        {icon ? (
          <Box
            aria-hidden
            sx={{
              display: "grid",
              placeItems: "center",
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "mist.main",
              color: "primary.main",
            }}
          >
            {icon}
          </Box>
        ) : null}
        <Stack spacing={1}>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          {description ? (
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          ) : null}
        </Stack>
        {action ? <Box>{action}</Box> : null}
      </Stack>
    </Box>
  );
}
