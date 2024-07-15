import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import './CreditCard.css';

const CreditCard = ({ number, cvv, expirationDate, name }) => {
    const theme = useTheme(); // Use the useTheme hook to access the theme

    return (
        <Card className="credit-card">
            <CardContent>
                <Typography variant="h5" component="div" style={{ color: theme.palette.white.main }}>
                    {number}
                </Typography>
                <Typography color="textSecondary" style={{ color: theme.palette.white.main }}>
                    CVV: {cvv}
                </Typography>
                <Typography color="textSecondary" style={{ color: theme.palette.white.main }}>
                    Expires: {expirationDate}
                </Typography>
                <Typography variant="h6" component="div" style={{ color: theme.palette.white.main }}>
                    {name}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CreditCard;