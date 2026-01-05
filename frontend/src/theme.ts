import { createTheme } from '@mui/material/styles';

// Custom theme matching the purple/fuchsia gradient design
const theme = createTheme({
  palette: {
    primary: {
      main: '#7c3aed', // violet-600
      light: '#a78bfa', // violet-400
      dark: '#6d28d9', // violet-700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d946ef', // fuchsia-500
      light: '#e879f9', // fuchsia-400
      dark: '#c026d3', // fuchsia-600
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9fafb', // gray-50
      paper: '#ffffff',
    },
    text: {
      primary: '#111827', // gray-900
      secondary: '#6b7280', // gray-500
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
