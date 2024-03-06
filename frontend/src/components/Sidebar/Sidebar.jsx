import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import des Logout-Icons

export const mainListItems = ({ onItemClick }) => (
  <React.Fragment>
    {/* <ListItemButton onClick={() => onItemClick('Dashboard')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton> */}
    <ListItemButton onClick={() => onItemClick('Passwords')}>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Passwords" />
    </ListItemButton>
    <ListItemButton onClick={() => onItemClick('Secret Notes')}>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Secret Notes" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = ({ onItemClick }) => (
  <React.Fragment>
    <ListItemButton onClick={() => onItemClick('Settings')}>
      <ListItemIcon>
        <SettingsApplicationsIcon />
      </ListItemIcon>
      <ListItemText primary="Settings" />
    </ListItemButton>
  </React.Fragment>
);

export const footerListItem = ({ onItemClick }) => (
  <ListItemButton onClick={() => onItemClick('Logout')} style={{ bottom: 0 }}>
    <ListItemIcon>
      <ExitToAppIcon />
    </ListItemIcon>
    <ListItemText primary="Logout" />
  </ListItemButton>
);

