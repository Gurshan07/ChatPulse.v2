import { Close as CloseIcon, Menu as MenuIcon ,Dashboard as DashboardIcon, ManageAccounts as ManageAccountsIcon, Groups as GroupsIcon, Forum as ForumIcon ,ExitToApp as ExitToAppIcon} from '@mui/icons-material'
import { Box, Drawer, Grid, IconButton, Stack, Typography, styled } from '@mui/material'
import { useState } from 'react'
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";

const Link = styled(LinkComponent)`
    text-decoration:none;
    border-radius:2rem;
    padding:1rem 0.5rem;
    color:grey;
    
    &:hover{
        color:white;
    }
    `
const adminTabs = [
    {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: <DashboardIcon />
    }, {
        name: 'Users',
        path: '/admin/users',
        icon: <ManageAccountsIcon />
    }, {
        name: 'Chats',
        path: '/admin/chats',
        icon: <GroupsIcon />
    }, {
        name: 'Message',
        path: '/admin/messages',
        icon: <ForumIcon />
    },
]

const Sidebar = ({ w = '100%' }) => {

    const location = useLocation();
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(adminLogout());
      };

    return (
        <Stack width={w} direction={'column'} p={'3rem'} spacing={'3rem'} >
            <Typography variant='h5' color={'white'} fontWeight={'bold'}  textTransform={'uppercase'}>Admin</Typography>
            <Stack spacing={'1rem'} >
                {adminTabs.map((tab) => (
                    <Link  key={tab.path} to={tab.path} sx={location.pathname === tab.path && { color: 'white', }} >

                        <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} >
                            {tab.icon}
                            <Typography>{tab.name}</Typography>
                        </Stack>

                    </Link>
                ))}
                <Link onClick={logoutHandler} >

                    <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} >
                        <ExitToAppIcon/>
                        <Typography>Logout</Typography>
                    </Stack>

                </Link>
            </Stack>
        </Stack>
    )
}
// const isAdmin = true
const AdminLayout = ({ children }) => {

    const { isAdmin } = useSelector((state) => state.auth);

  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);

  const handleClose = () => setIsMobile(false);
  
if(!isAdmin) return <Navigate to='/admin' />

    return (
        <Grid  className='unselectable' container minHeight={'100vh'}>

            <Box sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', right: '1rem', top: '1rem', }}>
                <IconButton onClick={handleMobile}>
                    {isMobile ? <CloseIcon  sx={{color:'white'}} /> : <MenuIcon  sx={{color:'white'}}/>}

                </IconButton>
            </Box>

            <Grid item md={4} lg={3} sx={{ display: { xs: 'none', md: 'block' } }} >
                <Sidebar />

            </Grid>

            <Grid item xs={12} md={8} lg={9} sx={{ bgcolor: '#0f121a' }}>
                {children}
            </Grid>

            <Drawer  open={isMobile} onClose={handleClose}>
                <Box sx={{bgcolor:'#0f121a',height:'100%'}}>
                <Sidebar w='60vw' />
                </Box>
            </Drawer>
        </Grid>
    )
}

export default AdminLayout
