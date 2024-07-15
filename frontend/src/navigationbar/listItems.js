import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import ErrorIcon from '@mui/icons-material/Error';
import PaymentsIcon from '@mui/icons-material/Payments';
import DescriptionIcon from '@mui/icons-material/Description';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/dashboard/transactions">
      <ListItemIcon>
        <DashboardIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Transactions" style={{ color: "white" }} />
    </ListItemButton>
    <ListItemButton component={Link} to ="/dashboard/accountSetup">
      <ListItemIcon>
        <AccountBalanceIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="New Account Form" style={{ color: "white" }} />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PaymentsIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Payments" style={{ color: "white" }} />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Budgeting" style={{ color: "white" }} />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <DescriptionIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Reports" style={{ color: "white" }} />
    </ListItemButton>
    <ListItemButton component={Link} to="/dashboard/creditcards">
      <ListItemIcon>
        <CreditCardIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Credit Card" style={{ color: "white" }} />
    </ListItemButton>
  </React.Fragment>
);

// export const secondaryListItems = (
//   <React.Fragment>
//     <ListSubheader component="div" inset>
//       Saved reports
//     </ListSubheader>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Current month" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Last quarter" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Year-end sale" />
//     </ListItemButton>
//   </React.Fragment>
// );
