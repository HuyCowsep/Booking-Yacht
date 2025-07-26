import { createTheme } from "@mui/material/styles";
import { purple } from "@mui/material/colors"; // Import màu tím từ Material-UI

const lightPalette = {
  mode: "light",
  primary: {
    main: "#68bfb5",
    contrastText: "#fff",
    dark: "#4f908a",
  },
  background: {
    default: "#f8f9fa",
    paper: "#fff",
  },
  text: {
    primary: "#243139",
    secondary: "#66bdb3",
  },
  purple: {
    main: purple[400], // Tím nhạt cho light mode
    dark: purple[600], // Tím đậm hơn khi hover
    contrastText: "#fff",
  },
};

const darkPalette = {
  mode: "dark",
  primary: {
    main: "#68bfb5",
    contrastText: "#fff",
    dark: "#4f908a",
  },
  background: {
    default: "#243139",
    paper: "#1b242a",
  },
  text: {
    primary: "#f8f9fa",
    secondary: "#97c0ad",
  },
  divider: "#37474f",
  purple: {
    main: purple[300], // Tím sáng hơn cho dark mode
    dark: purple[500], // Tím đậm hơn khi hover
    contrastText: "#fff",
  },
};

export const getTheme = (mode = "light") =>
  createTheme({
    palette: mode === "dark" ? darkPalette : lightPalette,
    typography: {
      fontFamily: "Archivo, sans-serif",
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      "none",
      "0px 2px 4px rgba(0, 0, 0, 0.1)",
      "0px 4px 8px rgba(0, 0, 0, 0.15)",
      ...Array(22).fill("none"),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: (theme) => theme.palette.primary.dark,
              transform: "translateY(-1px)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: "box-shadow 0.3s",
            "&:hover": {
              boxShadow: (theme) => theme.shadows[2],
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: (theme) => theme.shape.borderRadius,
            },
          },
        },
      },
    },
  });
