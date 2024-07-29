import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
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
import CurrencyConversion from '../../api/currencyConversionApi/currencyConversion';

// The BankingDashboard component displays the user's account balance and transaction history through a line chart
// It also allows the user to view their transactions and convert their balance to different currencies

// ChartJS is a library that allows us to create charts
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


  // initalChartData is set to an empty object for the chart data
  const initialChartData = {
    datasets: [],
  };

  // useState hooks are used to create state variables in functional components
  const [accountData, setAccountData] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [chartData, setChartData] = useState(initialChartData);
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [conversionRates, setConversionRates] = useState({});
  const [userBalanceConversion, setUserBalanceConversion] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [timeFrame, setTimeFrame] = useState('day'); // New state for time frame
  const [creditCardBalance, setCreditCardBalance] = useState(0.00); // used to store the current credit card balance mapped to the account data object


  const theme = useTheme();
  const navigate = useNavigate();

  const userJson = localStorage.getItem('user'); // Retrieve the JSON string
  const userObj = JSON.parse(userJson); // Parse the JSON string to an object
  const username = userObj.username; // Extract the 'username' property
  
  // currencySymbolHash is an object that maps currency codes to currency symbols
  const currencySymbolHash = {
    USD: '$',
    EUR: '€',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    GBP: '£'
  };

  // useEffect hooks are used to run the fetchAccountData and fetchCreditCardData functions when the component mounts
  useEffect(() => {
    fetchAccountData();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount);
      fetchCreditCardBalance(selectedAccount);

    }
  }, [selectedAccount]);

  // fetchBalanceConversion function fetches the conversion rates for the selected currency
  const fetchBalanceConversion = async (currency) => {
    try {
      const response = await axios.get(`https://open.er-api.com/v6/latest/${currency}`);
      const rates = {
        EUR: response.data.rates.EUR,
        JPY: response.data.rates.JPY,
        AUD: response.data.rates.AUD,
        USD: response.data.rates.USD,
        GBP: response.data.rates.GBP,
        CAD: response.data.rates.CAD
      };
      setConversionRates(rates);
      return rates;
    } catch (error) {
      console.error('Error fetching conversion rates:', error);
      return null;
    }
  };

  // Function to fetch credit card balance
  const fetchCreditCardBalance = async (accountNumber) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/creditcard/creditCardBalance/${accountNumber}`);
      setCreditCardBalance(response.data);
      console.log('Credit Card Balance:', response.data);
    } catch (error) {
      console.error('Error fetching credit card balance:', error);
    }
  };

  // fetchAccountData function fetches the user's account data
  const fetchAccountData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/account/${username}`);
      setAccountData(response.data);
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  // fetchTransactions function fetches the user's transactions for the selected account
  // Faced an extremely weird issue with response.data cutting off one of the transactions, have to extract the transactions individually and push them to an array
  const fetchTransactions = async (accountNumber) => {
    try {
        console.log('fetching transactions for account:', accountNumber);
        const response = await axios.get(`http://localhost:8080/api/transaction/${accountNumber}?username=${username}`);
        
        updateChartData(response.data);
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};


 // handleAccountChange function updates the selected account and fetches the account balance and conversion rates
  const handleAccountChange = (event) => {
    const accountNumber = event.target.value;
    setSelectedAccount(accountNumber);
    // Find the account with the selected account number
    const account = accountData.find(acc => acc.accountNumber === accountNumber);
    setBalance(account.balance);
    setUserBalanceConversion(account.balance);
    setAccountCurrency(account.currency);
    setSelectedCurrency(account.currency);
    fetchBalanceConversion(account.currency);
  };

  // handleCurrencyChange function will convert the balance that is shown on the account
  const handleCurrencyChange = async (event) => {
    const newCurrency = event.target.value;
    setSelectedCurrency(newCurrency);

    if (conversionRates[newCurrency]) {
      const rate = conversionRates[newCurrency];
      setUserBalanceConversion(balance * rate);
    } else {
      const rates = await fetchBalanceConversion(accountCurrency);
      if (rates) {
        const rate = rates[newCurrency];
        setUserBalanceConversion(balance * rate);
      }
    }
    setShowCurrencyDropdown(false);
  };
  /**
   * Updates the chart data to reflect the user's transaction history and current balance.
   *
   * This function performs the following steps:
   * 1. **Sort Transactions:** Copies and sorts the transactions by date in descending order to ensure they are plotted in the correct order.
   * 
   * 2. **Initialize Balance:** Calculates the current balance by subtracting the credit card balance from the total account balance.
   * 
   * 3. **Initial and End Points:** Retrieves the earliest transaction and sets up two key points for the chart:
   *    - The initial balance at the earliest transaction date.
   *    - The current balance at the end of the period.
   * 
   * 4. **Generate Data Points:** Maps each transaction to a point on the chart, updating the current balance accordingly.
   * 
   * 5. **Create Colored Segments:** Determines the color of each segment of the line chart based on whether the transaction is an account transaction or a credit card transaction. Card transactions are shown in grey, and account transactions are shown in black.
   * 
   * 6. **Set Chart Data:** Updates the chart with the new data, including both account and card transactions. The chart's line segments are colored based on transaction types.
   * 
   * The final data structure includes:
   * - a dataset for card and account transactions that are plotted later on the chart.
   */
  const updateChartData = (transactions) => {
    console.log('transactions:', transactions);
    // Create a new instance of the transactions array to avoid mutating the original array
    const sortedTransactions = [...transactions];
    // Sort the transactions by most recent transactions to oldest transactions
    sortedTransactions.sort(function(a,b)
    {
      var c = new Date(a.date);
      var d = new Date(b.date);
      return d-c;
      });
    // How the graphing works:


    // Start with the current balance
    let currentBalance = balance - creditCardBalance;
    let endPointBalance = balance - creditCardBalance;


    // Create an array to store all the transaction types
    const transactionTypes = sortedTransactions.map(transaction => transaction.transactionType);
    
    // retrieve the very last transaction information, which based on the current sorting transactions, will be the oldest/first transaction made on the account
    console.log('sortedTransactions:', sortedTransactions);
    const initalDate = new Date(sortedTransactions[sortedTransactions.length - 1]?.date);
    const initialTransaction = sortedTransactions[sortedTransactions.length - 1]?.transactionType;
    const initialAmount = initialTransaction === 'Deposit' || initialTransaction === 'Payment'
      ? -sortedTransactions[sortedTransactions.length - 1]?.amount
      : sortedTransactions[sortedTransactions.length - 1]?.amount;
      console.log('initial transaction information:', initialTransaction, initialAmount);
    sortedTransactions.pop();

    // n will be used to grab the appropriate transaction type to display on the graph
    // n will be incremented after each transaction, as the correct transaction type to map on the points is [current index + 1]
    let n = 0;

    // create the points for the graph besides the initial and end points
    const data = sortedTransactions.map(transaction => {
      const amount = transaction.transactionType === 'Deposit' || transaction.transactionType === 'Payment'
        ? -transaction.amount
        : transaction.amount;
      //console.log('before balance', currentBalance);
      //console.log('amount', amount);
      currentBalance += amount;
      //console.log('after balance', currentBalance);
      const point = {
        x: new Date(transaction.date),
        y: currentBalance,
        transactionType: transactionTypes[n + 1]
      };
      n++;
      return point;
    });

    // Creates the initial point for the graph, which is the original balance the user had when they first created the account
    // the inital balance was found by starting at the current balance and retracing the steps of the transactions until the the earliest transaction
    currentBalance += initialAmount;
    const initialPoint = {
      x: initalDate,
      y: currentBalance,
      transactionType: "Initial Balance",
    };

    // Create the end point for the graph, which will be the current balance on the account
    const endPoint = {
      x: new Date(),
      y: endPointBalance,
      transactionType: transactionTypes[0] + '/Current Balance',
    };

    // push the initial point to the end, the data will be reversed to show the graph in the correct order
    data.push(initialPoint);
    data.reverse();

    // push the end point to the end of the data array, this will be the last point on the graph
    data.push(endPoint);
    
    // create the colored segments for the graph
    const coloredSegments = data.map((point, index) => {
      if (index < data.length - 1) {
        const nextPoint = data[index + 1];
        return {
          start: index,
          end: index + 1,
          // create the border color based on if it was a card transaction or account transaction
          borderColor: nextPoint.transactionType === 'Deposit' || nextPoint.transactionType === 'Withdraw' ? theme.palette.black.main : theme.palette.grey.main,
        };
      }
      return null;
    }).filter(segment => segment !== null);

    setChartData({
      // Note: There is only one dataset, but two labels for the legend
      datasets: [
        {
          label: 'Card Transaction', // technically the label should be all transactions
          data: data,
          backgroundColor: theme.palette.grey.main,
          fill: false,
          segment: {
            borderColor: ctx => coloredSegments.find(segment => segment.start === ctx.p0DataIndex)?.borderColor || theme.palette.lightBlue.main,
          }
        },
     
        {
          label: 'Account Transaction',
          data: [],
          backgroundColor: theme.palette.black.main,
          borderWidth: 1,
          fill: false,
          pointRadius: 0,
        }
      ]
    });
  };
  
  // handleTimeFrameChange function updates the time frame and sets the min and max dates for the chart
  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '20px', 
          width: 1100, 
          height: 70, 
          backgroundColor: theme.palette.black.main, 
          color: theme.palette.white.main,
        }}>
         <Typography variant="h4" gutterBottom>
          Banking Dashboard - Balance: {currencySymbolHash[accountCurrency]}{balance.toFixed(2)}
          <span style={{ color: theme.palette.red.main }}> (-${creditCardBalance.toFixed(2)} credit)</span>
        </Typography>
        </Box>
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
        <FormControl fullWidth margin="normal">
          <InputLabel>Time Frame</InputLabel>
          <Select
            value={timeFrame}
            onChange={handleTimeFrameChange}
            fullWidth
          >
            <MenuItem value="day">Last Day</MenuItem>
            <MenuItem value="all">All Transactions</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', mt: 4 }}>
          <Box sx={{ flex: 5, mr: 6 }}>
            <Typography variant="h5" gutterBottom>
              Transactions
            </Typography>
            <Line
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: timeFrame === 'day' ? 'hour' : 'day',
                      tooltipFormat: 'PPpp',
                    },
                    ticks: {
                      source: 'auto',
                      autoSkip: true,
                      maxTicksLimit: timeFrame === 'day' ? 20 : 10,
                    },
                    min: timeFrame === 'day'
                      ? new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
                      : undefined,
                    max: new Date().toISOString(),
                    title: {
                      display: true,
                      text: 'Time',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Balance'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const transactionType = context.raw.transactionType;
                        const balance = context.raw.y;
                        return `${transactionType}: ${currencySymbolHash[accountCurrency]}${balance.toFixed(2)}`;
                      }
                    }
                  }
                }
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Currency Conversion
                </Typography>
                <Typography variant="h3" color="textPrimary">
                  <span onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)} style={{ cursor: 'pointer' }}>
                    {currencySymbolHash[selectedCurrency]}{userBalanceConversion.toFixed(2)}
                  </span>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  as of {new Date().toLocaleDateString()}
                </Typography>
                {showCurrencyDropdown && (
                  <FormControl fullWidth>
                    <Select
                      value={selectedCurrency}
                      onChange={handleCurrencyChange}
                      fullWidth
                    >
                      {Object.entries(currencySymbolHash).map(([currency, symbol]) => (
                        <MenuItem key={currency} value={currency}>
                          {symbol} - {currency}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <Button variant="text" sx={{ fontSize: '1rem', color: theme.palette.blue.main }} onClick={() => navigate('/dashboard/transactions')}>
                  View Transactions
                </Button>
                <CurrencyConversion currency={accountCurrency} />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BankingDashboard;
