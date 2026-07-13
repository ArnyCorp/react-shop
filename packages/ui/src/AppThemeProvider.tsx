import { CssBaseline, ThemeProvider } from "@mui/material";
import type { ReactNode } from "react";
import { shopTheme } from "./theme";

export type AppThemeProviderProps = {
  children: ReactNode;
};

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <ThemeProvider theme={shopTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
