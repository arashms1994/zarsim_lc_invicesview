import { createTheme, type ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  direction: 'rtl',
  typography: {
    fontFamily: '"Vazir", "sans-serif"',
  },
};

const theme = createTheme(themeOptions);

export default theme;
