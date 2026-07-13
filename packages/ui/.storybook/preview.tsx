import type { Preview } from "@storybook/react";
import { AppThemeProvider } from "../src/AppThemeProvider";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
    backgrounds: {
      default: "shop mist",
      values: [
        { name: "shop mist", value: "#eef3f0" },
        { name: "paper", value: "#f7faf8" },
      ],
    },
  },
  decorators: [
    (Story) => (
      <AppThemeProvider>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Karla:wght@400;500;600;700&family=Syne:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <div style={{ padding: 24, minHeight: "100vh" }}>
          <Story />
        </div>
      </AppThemeProvider>
    ),
  ],
};

export default preview;
