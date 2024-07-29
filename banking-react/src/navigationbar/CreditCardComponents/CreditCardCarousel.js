import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-material-ui-carousel';
import CreditCard from './CreditCard';
import { Typography, Box, Button, TextField, Snackbar, Alert, IconButton, Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';

// This component is the carsousel that displays the credit cards for the user
// It also contains the form for creating a new credit card

const CreditCardCarousel = ({ username, name }) => {
  const [creditCards, setCreditCards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [accountData, setAccountData] = useState([]);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState('');
  const theme = useTheme();

  const fetchAccountData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/account/${username}`);
      setAccountData(response.data);
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  const fetchCreditCardData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/creditcard/${username}`);
      if (response.status === 200) {
        setCreditCards(response.data);
      } else if (response.status === 204) {
        setCreditCards([]);
      }
    } catch (error) {
      console.error('Error during credit card fetch:', error);
    }
  };

  const handleCreateCardClick = () => {
    fetchAccountData();
    setShowForm(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('Selected Account Number:', selectedAccountNumber);
      const response = await axios.post(`http://localhost:8080/api/creditcard/${username}`, {
        fullName,
        billingAddress,
        selectedAccountNumber,
      });
      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setShowForm(false);
        fetchCreditCardData();
      } else {
        setErrorMessage('Failed to create credit card.');
      }
    } catch (error) {
      setErrorMessage('Error creating credit card.');
      console.error('Error creating new credit card:', error);
    }
  };

  useEffect(() => {
    fetchCreditCardData();
  }, [username]);

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleAccountChange = (event) => {
    setSelectedAccountNumber(event.target.value);
  };

  return (
    <Box display="flex" mt={10}>
      <Box flex={1}>
        <Carousel autoPlay={false}>
          {creditCards.map((card, index) => (
            <Box key={index} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <CreditCard
                number={card.creditCardNumber}
                cvv={card.cvv}
                expirationDate={card.expirationDate}
                name={card.cardName}
                address={card.address}
              />
              <Typography variant="h5" style={{ color: theme.palette.darkBrown.main }}>
                ${(card.creditLimit - card.creditBalance)} credit remaining on this card
              </Typography>
              <Typography variant="h6" style={{ color: theme.palette.darkBrown.main }}>
                <HomeIcon style={{ color: theme.palette.darkBrown.main }} /> {card.billingAddress}
              </Typography>
            </Box>
          ))}
        </Carousel>
        <Box display="flex" justifyContent="center" marginTop={2}>
          <Button
            variant="contained"
            style={{ backgroundColor: theme.palette.grey.main }}
            onClick={handleCreateCardClick}
          >
            Create new card
          </Button>
        </Box>
      </Box>
      {showForm && (
        <Box flex={1} marginLeft={10} marginRight={10}  style={{ maxWidth: '500px' }} position="relative">
          <IconButton
            onClick={() => setShowForm(false)}
            style={{ position: 'absolute', right: 0, top: -30, backgroundColor: theme.palette.grey.main}}
          >
            <CloseIcon />
          </IconButton>
          <form onSubmit={handleFormSubmit}>
            <Typography variant="h4" style={{ color: theme.palette.darkBrown.main }}>
              New Card Information
            </Typography>
            <TextField
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Billing Address"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Account</InputLabel>
              <Select
                label="Account"
                name="account"
                value={selectedAccountNumber}
                onChange={handleAccountChange} 
                fullWidth
              >
                {accountData.map((account) => (
                  <MenuItem key={account.id} value={account.accountNumber}>
                  {account.accountType} - ${account.balance} available
                  </MenuItem>
                ))}
              </Select>
              <Typography>Please select the Account to map the Credit Card to!</Typography>
            </FormControl>
            <Button type="submit" variant="contained" style={{backgroundColor: theme.palette.grey.main}} fullWidth>
              Submit
            </Button>
          </form>
        </Box>
      )}
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreditCardCarousel;
