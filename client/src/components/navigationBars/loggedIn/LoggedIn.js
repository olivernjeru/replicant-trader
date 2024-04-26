import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
import ProfileIcon from '@mui/icons-material/Person';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link, Typography } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import './LoggedIn.css';

export default function LoggedIn() {
  const navigate = useNavigate();

  const signOut = () => {
    auth.signOut();
    navigate('/');
  };
  const [user] = useAuthState(auth);

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup function to prevent memory leaks
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEmailClick = (event) => {
    event.stopPropagation(); // Prevent the event from propagating to the parent menu
  };
  return (
    <AppBar>
      <Toolbar>
        <div className="left">
          <Link href="/">Trade</Link>
          {currentTime}
        </div>
        <div className="right">
          <Tooltip title="Account menu" sx={{ color: 'white' }}>
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Tooltip>
        </div>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose} // Close the menu when clicking outside
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Typography
            onClick={handleEmailClick} // Prevent the menu from closing when clicking the email
            sx={{ pl: 2, pr: 2, pt: 0, pb: 1, cursor: 'default' }} // Set cursor to default
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '22px' }}>
              John Doe
            </Typography>
            {user?.email}
          </Typography>
          <Divider sx={{ backgroundColor: 'white' }} />
          <MenuItem onClick={handleClose} sx={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <SettingsIcon sx={{ marginRight: '17px', marginLeft: '-5px' }} /> Settings
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <ProfileIcon sx={{ marginRight: '17px', marginLeft: '-5px' }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => signOut()}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar >
  );
}
