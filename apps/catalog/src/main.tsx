import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppThemeProvider } from "@react-shop/ui";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </StrictMode>,
);
