import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    ink: Palette["primary"];
    mist: Palette["primary"];
  }
  interface PaletteOptions {
    ink?: PaletteOptions["primary"];
    mist?: PaletteOptions["primary"];
  }
}

export const shopTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f6b4c",
      dark: "#0a4a35",
      light: "#3d9574",
      contrastText: "#f4faf7",
    },
    secondary: {
      main: "#1f7a8c",
      dark: "#155968",
      light: "#4d9aaa",
      contrastText: "#f2fbfd",
    },
    background: {
      default: "#eef3f0",
      paper: "#f7faf8",
    },
    text: {
      primary: "#14221b",
      secondary: "#4a5c52",
    },
    divider: "rgba(20, 34, 27, 0.12)",
    ink: {
      main: "#14221b",
      contrastText: "#f4faf7",
    },
    mist: {
      main: "#d7e4dc",
      contrastText: "#14221b",
    },
  },
  typography: {
    fontFamily: '"Karla", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontFamily: '"Syne", "Karla", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontFamily: '"Syne", "Karla", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: '"Syne", "Karla", sans-serif',
      fontWeight: 650,
    },
    h4: {
      fontFamily: '"Syne", "Karla", sans-serif',
      fontWeight: 650,
    },
    h5: {
      fontFamily: '"Syne", "Karla", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Syne", "Karla", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontFamily: '"Syne", "Karla", sans-serif',
      fontWeight: 650,
      textTransform: "none" as const,
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(circle at top left, rgba(15, 107, 76, 0.08), transparent 40%), radial-gradient(circle at 80% 20%, rgba(31, 122, 140, 0.1), transparent 35%)",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
        "@keyframes rise-in": {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes soft-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          paddingBlock: 10,
        },
        containedPrimary: {
          boxShadow: "0 10px 24px rgba(15, 107, 76, 0.22)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
