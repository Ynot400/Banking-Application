import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
  palette: {
    black: {
      main: '#0F1108',
    },
    darkBrown: {
      main: '#241909',
    },
    lightBlue: {
      main: '#00F6ED',
    },
    grey: {
      main: '#CAD8DE',
    },
    lightBrown: {
      main: '#645853',
    },
    white: {
      main: '#ffffff',
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

