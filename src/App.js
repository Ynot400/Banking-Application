import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './navigationbar/NavBar';
import SignIn from './authenticationPages/SignIn';
import SignUp from './authenticationPages/SignUp';
import EmailVerification from './authenticationPages/Verify';
import Transactions from './navigationbar/NavigationBarRoutingComponents/Transactions';
import CreditCardHub from './navigationbar/NavigationBarRoutingComponents/CreditCardHub';
import AccountForm from './navigationbar/NavigationBarRoutingComponents/AccountSetup';
import BankingDashboard from './navigationbar/NavigationBarRoutingComponents/StatisticalData';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/verify" element={<EmailVerification />} />
          
          <Route path="/dashboard/*" element={<Nav />}>
            <Route path="transactions" element={<Transactions />} />
            <Route path="creditcards" element={<CreditCardHub />} />
            <Route path="accountSetup" element={<AccountForm />} />
            <Route path="" element={<BankingDashboard />} /> {/* Default route for /dashboard */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
