import React, { useCallback, useState } from 'react';
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Link,
  Toolbar,
  Tooltip,
  Typography,
  Menu, MenuItem, Divider,
  ListItemIcon,
} from "@mui/material";
import { Suspense, lazy } from "react";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  PersonAdd as PersonAddIcon,
  Settings as SettingsIcon
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import {
  setIsMobile,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";
import { transformImage } from "../../lib/features";
import Avatar from '@mui/material/Avatar';
import { useColor } from '../shared/ColorProvider ';


const SearchDialog = lazy(() => import('../specific/Search'))
const NotificationDialog = lazy(() => import('../specific/Notifications'))

const Header = ({ user }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);
  const { uiColor1, uiColor2, darkmode } = useColor();

  const handleMobile = () => dispatch(setIsMobile(true));

  const openSearch = () => dispatch(setIsSearch(true));

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const navigateToGroup = () => navigate("/groups");
  
  const logoutHandler = async () => {

    sessionStorage.removeItem('hasVisitedHomePage');

    
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/profile');
  };
  const handleSettingClick = () => {
    handleClose();
    navigate('/settings');
  };

  return <>

    <Box sx={{ flexGrow: 1, bgcolor: darkmode ? "black" : "white", }} height={'4rem'}>

      <AppBar position='static' sx={{
        bgcolor: darkmode ? "black" : "white", borderBottom: '1px solid rgba(255, 255, 255, 0.08) ',
      }}>
        <Toolbar>
          <Link href="/" underline="none" color={'gray'} >
            <Typography className='unselectable' variant='h5' sx={{ display: { xs: 'none', sm: 'block', }, color: darkmode ? 'white' : 'black' }}>
              Chat<span style={{ color: uiColor1 }}>Pulse</span>
            </Typography>
          </Link>

          <Box sx={{ display: { xs: 'block', sm: 'none' }, }}>
            <IconButton color={darkmode ? 'white' : 'black'} onClick={handleMobile}>
              <MenuIcon sx={{ color: darkmode ? 'white' : 'black' }} />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>

              <IconBtn title={'Search users'} icon={<SearchIcon />} onClick={openSearch} />
              <IconBtn title={'Manage Groups'} icon={<GroupIcon />} onClick={navigateToGroup} />
              <IconBtn title={"Notifications"} icon={<NotificationsIcon />} onClick={openNotification} value={notificationCount} />

              <Typography marginLeft={'0.5rem'} marginRight={'0.2rem'} className='unselectable' sx={{ color: darkmode ? "white" : 'black' }}>|</Typography>
              <Tooltip title="More Options">

                <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }} aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}>

                  <Avatar src={transformImage(user?.avatar?.url)} sx={{ width: 45, height: 45, objectFit: 'contain', border: `2.5px solid ${uiColor1} `, }} />

                </IconButton>

              </Tooltip>

            </Box>

            <Menu anchorEl={anchorEl} id="account-menu" open={open} onClose={handleClose} onClick={handleClose}
              slotProps={{
                paper: {
                  elevation: 0, sx: {
                    overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))', mt: 1.5,
                    '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1, },
                    '&::before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'uiColor2', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0, },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} >

              <MenuItem onClick={handleProfileClick}>
                Profile
              </MenuItem>

              <MenuItem onClick={handleSettingClick}>
                Settings
              </MenuItem>

              <Divider />

              <MenuItem onClick={logoutHandler}>

                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>

                Logout
              </MenuItem>

            </Menu>
          </>

        </Toolbar>

      </AppBar>

    </Box>

    {isSearch && <Suspense fallback={<Backdrop open />}><SearchDialog /></Suspense>}

    {isNotification && <Suspense fallback={<Backdrop open />}><NotificationDialog /></Suspense>}


  </>
}

const IconBtn = ({ title, icon, onClick, value }) => {

  return (
    <Tooltip title={title}>

      <IconButton color='default' size='large' onClick={(event) => onClick(event)} sx={{
        color: 'grey', '&:hover': { backgroundColor: '#2e2e2e', '& svg': { color: 'white', filter: 'brightness(100%)', }, },
      }}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}

      </IconButton>

    </Tooltip>
  )
}

export default Header
