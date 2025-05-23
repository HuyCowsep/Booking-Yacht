import { createTheme } from '@mui/material/styles';

const lightPalette = {
  mode: 'light',
  primary: {
    main: '#68bfb5',
    contrastText: '#fff',
    dark: '#4f908a',
  },
  background: {
    default: '#f8f9fa',
    paper: '#fff',
  },
  text: {
    primary: '#243139',
    secondary: '#97c0ad',
  },
  
};

const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#68bfb5',
    contrastText: '#fff',
    dark: '#4f908a',
  },
  background: {
    default: '#243139',
    paper: '#1b242a',
  },
  text: {
    primary: '#f8f9fa',
    secondary: '#97c0ad',
  },
  divider: '#37474f',
};

export const getTheme = (mode = 'light') =>
  createTheme({
    palette: mode === 'dark' ? darkPalette : lightPalette,
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    shape: {
      borderRadius: 18,
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0, 0, 0, 0.1)', // shadow[1] for cards
      '0px 4px 8px rgba(0, 0, 0, 0.15)', // shadow[2] for hover
      ...Array(22).fill('none'), // Fill remaining shadows
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.primary.dark,
              transform: 'translateY(-1px)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: (theme) => theme.shadows[2],
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: (theme) => theme.shape.borderRadius,
            },
          },
        },
      },
    },
  });