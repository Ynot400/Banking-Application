import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const root = ReactDOM.createRoot(document.getElementById('root'));

// The palette contains all of the colors used in the application
const theme = createTheme({
  palette: {
    black: {
      main: '#0F1108',
    },
    darkBrown: {
      main: '#432818',
    },
    lightBlue: {
      main: '#90C2E7',
    },
    blue: {
      main: '#2C85C9',
    },
    grey: {
      main: '#BDBDBD',
      light: '#CAD8DE'
    },
    lightBrown: {
      main: '#645853',
    },
    white: {
      main: '#ffffff',
    },
    red: {
      main: '#F24236',
    },


  },
});




root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
  </React.StrictMode>
);

