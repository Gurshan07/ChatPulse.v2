import AppLayout from '../components/layout/AppLayout'
import { Box, Typography } from '@mui/material'
import { useEffect } from 'react';
import { useColor } from '../components/shared/ColorProvider ';
const Home=()=> {
    useEffect(() => {
        const hasVisited = sessionStorage.getItem('hasVisitedHomePage');

        if (!hasVisited) {
            // Set the item in sessionStorage
            sessionStorage.setItem('hasVisitedHomePage', 'true');
            // Hard reload the page
            window.location.reload(true);
        }
    }, []);
    const { uiColor1, uiColor2, darkmode } = useColor();

    return (
        
        <Box 
        style={{
            
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '85vh',
            marginTop: '4vh',
        }}
        sx={{bgcolor:darkmode?'black':'white'}} >
            <Typography className='unselectable'  variant='h4' textAlign={'center'} sx={{bgcolor: darkmode ? "black" : 'white',color:darkmode? 'white' : 'black'}}>
                Select a Friend to Chat
            </Typography>
        </Box>
        
    )
}

export default AppLayout()(Home)
