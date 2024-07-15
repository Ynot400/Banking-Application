import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@emotion/react';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend
);

const BankingDashboard = () => {
  const initialChartData = {
    datasets: [],
  };

  const [accountData, setAccountData] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState(initialChartData);
  const theme = useTheme();

  const userJson = localStorage.getItem('user'); // Retrieve the JSON string
  const userObj = JSON.parse(userJson); // Parse the JSON string to an object
  const username = userObj.username; // Extract the 'username' property 

  useEffect(() => {
    fetchAccountData();
    fetchCreditCardData();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount);
    }
  }, [selectedAccount]);

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
      setCreditCards(response.data);
    } catch (error) {
      console.error('Error fetching credit card data:', error);
    }
  };

  const fetchTransactions = async (accountNumber) => {
    try {
      console.log('Fetching transactions for account:', accountNumber);
      const response = await axios.get(`http://localhost:8080/api/transaction/${accountNumber}?username=${username}`);
      setTransactions(response.data);
      updateChartData(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  

  const handleAccountChange = (event) => {
    const accountNumber = event.target.value;
    setSelectedAccount(accountNumber);
    const account = accountData.find(acc => acc.accountNumber === accountNumber);
    setBalance(account.balance);
  };

  const updateChartData = (transactions) => {
    const data = transactions.map(transaction => {
      return {
        x: new Date(transaction.date),
        y: transaction.type === 'Deposit' || transaction.type === 'Payment'
          ? -transaction.amount
          : transaction.amount
      };
    });

    setChartData({
      datasets: [
        {
          label: 'Transaction History',
          data: data,
          borderColor: theme.palette.primary.main,
          fill: false
        }
      ]
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Banking Dashboard
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Account</InputLabel>
        <Select
          value={selectedAccount}
          onChange={handleAccountChange}
          fullWidth
        >
          {accountData.map(account => (
            <MenuItem key={account.accountNumber} value={account.accountNumber}>
              {account.accountType} - {account.accountHolderName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedAccount && (
        <Typography variant="h6" gutterBottom>
          Balance: ${balance.toFixed(2)}
        </Typography>
      )}
      <Box sx={{ mt: 4 }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'month'
                }
              }
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default BankingDashboard;
