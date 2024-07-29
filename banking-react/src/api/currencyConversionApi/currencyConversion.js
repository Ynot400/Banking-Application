import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Link } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Transition } from 'react-transition-group';
import './currencyConversion.css';


// This component is a dynamic box that displays the conversion rates of different currencies based on the user's account currency
// The component uses the Exchange Rate API to fetch the conversion rates
// The component uses the react-transition-group library to animate the text

const CurrencyConversion = (props) => {
  const [conversionRates, setConversionRates] = useState({});
  const [currentCurrency, setCurrentCurrency] = useState('EUR');
  const [show, setShow] = useState(true);
  const [text, setText] = useState('');
  const theme = useTheme();
  let userAccountCurrency = props.currency;

  const currencies = ['EUR', 'JPY', 'AUD'];

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        const response = await axios.get(`https://open.er-api.com/v6/latest/${userAccountCurrency}`);
        const rates = {
          EUR: response.data.rates.EUR,
          JPY: response.data.rates.JPY,
          AUD: response.data.rates.AUD,
          USD: response.data.rates.USD,
          GPB: response.data.rates.GPB,
          CAD: response.data.rates.CAD
        };
        setConversionRates(rates);
        setText(`1 ${userAccountCurrency} = ${rates['EUR']} EUR`); // Initial text
      } catch (error) {
        console.error('Error fetching conversion rates:', error);
      }
    };

    fetchConversionRates();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false); // Trigger fade out
    }, 6000); // Change currency every 6 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!show) {
      const timeout = setTimeout(() => {
        setCurrentCurrency(prevCurrency => {
          const currentIndex = currencies.indexOf(prevCurrency);
          const nextIndex = (currentIndex + 1) % currencies.length;
          if ( currencies[nextIndex] === userAccountCurrency ) {
            return currencies[(nextIndex + 1) % currencies.length];
          }
          else {
            return currencies[nextIndex];
          }
        });
        setShow(true); // Trigger fade in
      }, 500); // Wait for the fade-out animation to complete

      return () => clearTimeout(timeout);
    }
  }, [show]);

  useEffect(() => {
    if (conversionRates[currentCurrency]) {
      setText(`1 ${userAccountCurrency} = ${conversionRates[currentCurrency]} ${currentCurrency}`);
    }
  }, [currentCurrency, conversionRates]);

  const duration = 280; 

  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
  };

  const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 },
  };

  return (
    <Box sx={{ p: 2, backgroundColor: theme.palette.grey.light, textAlign: 'center', minHeight: '90px', minWidth: '200px' }}>
      <Typography variant="body2" component="span">
        <Link href="https://www.exchangerate-api.com" style={{ color: 'black', textDecoration: 'none' }}>
          Rates By Exchange Rate API
        </Link>
      </Typography>
      <Transition in={show} timeout={duration}>
        {state => (
          <Typography
            variant="h6"
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
          >
            {text}
          </Typography>
        )}
      </Transition>
    </Box>
  );
};

export default CurrencyConversion;
