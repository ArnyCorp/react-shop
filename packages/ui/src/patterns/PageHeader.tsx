import { Box, Breadcrumbs, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export type PageHeaderCrumb = {
  label: string;
  href?: string;
};

export type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: PageHeaderCrumb[];
  actions?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        p: { xs: 3, md: 4 },
      }}
    >
      <Stack spacing={2.5}>
        {breadcrumbs?.length ? (
          <Breadcrumbs aria-label="breadcrumb">
            {breadcrumbs.map((crumb) =>
              crumb.href ? (
                <Typography
                  key={crumb.label}
                  component="a"
                  href={crumb.href}
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
                >
                  {crumb.label}
                </Typography>
              ) : (
                <Typography key={crumb.label} variant="body2" color="text.primary">
                  {crumb.label}
                </Typography>
              ),
            )}
          </Breadcrumbs>
        ) : null}

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "flex-end" }}
        >
          <Stack spacing={1} maxWidth={720}>
            {eyebrow ? (
              <Typography
                variant="overline"
                color="secondary.main"
                sx={{ fontWeight: 700, letterSpacing: "0.08em" }}
              >
                {eyebrow}
              </Typography>
            ) : null}
            <Typography variant="h3" component="h1">
              {title}
            </Typography>
            {description ? (
              <Typography variant="body1" color="text.secondary">
                {description}
              </Typography>
            ) : null}
          </Stack>
          {actions ? (
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {actions}
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}
