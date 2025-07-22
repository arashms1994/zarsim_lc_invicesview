import { createTheme, type ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  direction: 'rtl',
  typography: {
    fontFamily: '"Vazir", "sans-serif"',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#0d8957',
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
