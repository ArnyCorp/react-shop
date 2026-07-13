import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Card, CardContent, Stack, Typography, type ButtonProps } from "@mui/material";
import type { ReactNode } from "react";

export type StatCardProps = {
  value: ReactNode;
  label: string;
  helperText?: string;
  href?: string;
  onClick?: ButtonProps["onClick"];
  detailLabel?: string;
};

export function StatCard({
  value,
  label,
  helperText,
  href,
  onClick,
  detailLabel = "View details",
}: StatCardProps) {
  const hasDetailAction = Boolean(href || onClick);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 4,
        bgcolor: "background.paper",
      }}
    >
      <CardContent>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Typography variant="h3" component="p">
              {value}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {label}
            </Typography>
          </Stack>

          {helperText ? (
            <Typography variant="body2" color="text.secondary">
              {helperText}
            </Typography>
          ) : (
            <Box minHeight={20} />
          )}

          {hasDetailAction ? (
            <Button
              href={href}
              onClick={onClick}
              variant="text"
              color="primary"
              endIcon={<ArrowForwardIcon fontSize="small" />}
              sx={{ alignSelf: "flex-start", px: 0 }}
            >
              {detailLabel}
            </Button>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
