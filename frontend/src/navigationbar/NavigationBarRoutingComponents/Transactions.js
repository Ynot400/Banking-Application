import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { useTheme } from '@emotion/react';

const Transactions = () => {
  const userJson = localStorage.getItem('user');
  const userObj = JSON.parse(userJson);
  const username = userObj.username;

  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ type: '', amount: '', creditCard: '', account: '', transactionFilter: '' });
  const [creditCards, setCreditCards] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchCreditCardData();
    fetchAccountData();
  }, []);

  const depositTransaction = async (username, transactionNonCreditRequest) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/transaction/deposit/${username}`, transactionNonCreditRequest);
      console.log(response.data);
    } catch (error) {
      console.error('Error making deposit:', error);
    }
  };

  const withdrawTransaction = async (username, transactionNonCreditRequest) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/transaction/withdraw/${username}`, transactionNonCreditRequest);
      console.log(response.data);
    } catch (error) {
      console.error('Error making withdrawal:', error);
    }
  };

  const cardPaymentTransaction = async (username, transactionCreditRequest) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/transaction/cardPayment/${username}`, transactionCreditRequest);
      console.log(response.data);
    } catch (error) {
      console.error('Error making card payment:', error);
    }
  };

  const cardPurchaseTransaction = async (username, transactionCreditRequest) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/transaction/cardPurchase/${username}`, transactionCreditRequest);
      console.log(response.data);
    } catch (error) {
      console.error('Error making card purchase:', error);
    }
  };

  const fetchTransactions = async (filter) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/transaction/transactions/${username}`, {
        params: { type: filter }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]); // Set to empty array on error
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setFormData({
      ...formData,
      transactionFilter: filter
    });
    fetchTransactions(filter);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage('');
    const amount = parseFloat(formData.amount);

    if (formData.type === 'Purchase') {
      const selectedCard = creditCards.find(card => card.creditCardNumber === formData.creditCard);
      if (selectedCard && amount > (selectedCard.creditLimit - selectedCard.creditBalance)) {
        setAlertMessage('The amount surpasses the credit limit.');
        return;
      }
    }

    if (formData.type === 'Payment') {
      const selectedCard = creditCards.find(card => card.creditCardNumber === formData.creditCard);
      if (selectedCard && amount > selectedCard.creditBalance) {
        setAlertMessage('The amount surpasses the owed balance.');
        return;
      }
    }

    if (formData.type === 'Withdrawal') {
      const selectedAccount = accountData.find(account => account.accountNumber === formData.account);
      if (selectedAccount && amount > selectedAccount.balance) {
        setAlertMessage('The amount surpasses the available account balance.');
        return;
      }
    }

    const transactionNonCreditRequest = { amount: formData.amount, accountNumber: formData.account };
    const transactionCreditRequest = { amount: formData.amount, creditCardNumber: formData.creditCard };

    switch (formData.type) {
      case 'Deposit':
        await depositTransaction(username, transactionNonCreditRequest);
        break;
      case 'Withdrawal':
        await withdrawTransaction(username, transactionNonCreditRequest);
        break;
      case 'Payment':
        await cardPaymentTransaction(username, transactionCreditRequest);
        break;
      case 'Purchase':
        await cardPurchaseTransaction(username, transactionCreditRequest);
        break;
      default:
        console.error('Unknown transaction type:', formData.type);
    }

    setFormData({ type: '', amount: '', creditCard: '', account: '', transactionFilter: formData.transactionFilter });
    fetchTransactions(formData.transactionFilter);
    fetchCreditCardData();
    fetchAccountData();
  };

  const fetchCreditCardData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/creditcard/${username}`);
      setCreditCards(response.data);
    } catch (error) {
      console.error('Error fetching credit card data:', error);
    }
  };

  const fetchAccountData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/account/${username}`);
      setAccountData(response.data);
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', p: 3 }}>
      <Box sx={{ flex: 1, pr: 2 }}>
        <Typography variant="h4" gutterBottom>
          Submit a Transaction
        </Typography>
        {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Purchase">Credit Card Purchase</MenuItem>
              <MenuItem value="Payment">Credit Card Payment</MenuItem>
              <MenuItem value="Withdrawal">Withdrawal</MenuItem>
              <MenuItem value="Deposit">Deposit</MenuItem>
            </Select>
          </FormControl>
          {(formData.type === 'Purchase' || formData.type === 'Payment') && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Credit Card</InputLabel>
              <Select
                label="Credit Card"
                name="creditCard"
                value={formData.creditCard}
                onChange={handleChange}
                fullWidth
              >
                {creditCards.map((card) => (
                  <MenuItem key={card.id} value={card.creditCardNumber}>
                    {card.cardName} - ${card.creditLimit - card.creditBalance} credit remaining
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {(formData.type === 'Deposit' || formData.type === 'Withdrawal') && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Account</InputLabel>
              <Select
                label="Account"
                name="account"
                value={formData.account}
                onChange={handleChange}
                fullWidth
              >
                {accountData.map((account) => (
                  <MenuItem key={account.id} value={account.accountNumber}>
                    {account.accountType} - ${account.balance} available
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            type='number'
            inputProps={{ step: '0.01' }}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" sx={{ backgroundColor: theme.palette.black.main }}>
            Submit
          </Button>
        </form>
      </Box>
      <Box sx={{ flex: 2, pl: 3 }}>
        <Typography variant="h4" gutterBottom>
          Transaction History
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Transaction Filter</InputLabel>
          <Select
            label="Transaction Filter"
            name="transactionFilter"
            value={formData.transactionFilter}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="all">All Transactions</MenuItem>
            <MenuItem value="creditCard">Credit Card Transactions</MenuItem>
            <MenuItem value="account">Account Transactions</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="h6" gutterBottom>
          Transaction List
        </Typography>
        <ul>
          {Array.isArray(transactions) && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <li key={transaction.id}>
                {transaction.transactionType}: {transaction.description}
              </li>
            ))
          ) : (
            <li>No transactions available</li>
          )}
        </ul>
      </Box>
    </Box>
  );
};

export default Transactions;
