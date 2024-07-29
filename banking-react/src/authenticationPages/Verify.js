import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { Link } from 'react-router-dom';

// This component will be seen when a user clicks on their email verification link generated after a sign up
// The component will extract the token from the link and send a POST request to the backend to verify the token
// It will display a message based on the status of the verification

export default function EmailVerification() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      setLoading(true);
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (token) {
        try {
          const response = await axios.post(`http://localhost:8080/api/emailcheck/verify?token=${token}`);
          if (response.status === 200) {
            setStatus({ message: response.data, type: 'success' });
          } else {
            setStatus({ message: 'Token confirmation failed.', type: 'error' });
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setStatus({ message: error.response.data, type: 'error' });
          } else {
            setStatus({ message: 'An error occurred during verification.', type: 'error' });
          }
        }
      } else {
        setStatus({ message: 'Invalid verification link.', type: 'error' });
      }
      setLoading(false);
    };



    verifyEmail();
  }, [location.search]);

  return (
    <Container maxWidth="sm" style={{ marginTop: '20px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Banking Inventory System Email Verification</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Alert severity={status.type} style={{ marginTop: '20px' }}>
          {status.message}
        </Alert>
      )}
      <div style={{ marginTop: '20px' }}>
        <Button variant="contained" color="primary" component={Link} to="/signup" style={{ marginRight: '10px' }}>
          Sign Up
        </Button>
        <Button variant="outlined" color="primary" component={Link} to="/login">
          Log In
        </Button>
      </div>
    </Container>
  );
};