import { useFetchData } from "6pp";
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Container, Paper, Stack, Typography,Skeleton } from '@mui/material'
import {  Person as PersonIcon, Group as GroupIcon, Message as MessageIcon } from '@mui/icons-material';
import moment from 'moment';
import { DoughnutChart, LineChart } from '../../components/specific/Charts';
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import MoecounterComponentShow from './moeCountershow';
const Dashboard = () => {
        
    const { loading, data, error } = useFetchData(
        `${server}/api/v1/admin/stats`,
        "dashboard-stats"
      );
    
      const { stats } = data || {};
    
      useErrors([
        {
          isError: error,
          error: error,
        },
      ]);

    const Appbar =
     <Paper  elevation={3} sx={{ padding: '2rem', margin: '2rem 0', borderRadius: '1rem',bgcolor:'#0f121a',boxShadow: '0px 0px 3px rgba(255, 255, 255, 0.3)','&:hover': {boxShadow: '0px 0px 6px rgba(255, 255, 255, 0.6)'},  }} >
        <Stack direction={'row'} alignItems={'center'} spacing={'10rem'} color={'white'} justifyContent={'center'}  >
            <MoecounterComponentShow/>
            
            
            <Typography display={{ xs: 'none', lg: 'block' }} color={'white'} textAlign={'center'} >{moment().format('dddd, D MMMM YYYY ')}</Typography>
        </Stack>
    </Paper>

    const Widgets =
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={'2rem'} justifyContent={'space-between'} alignItems={'center'} margin={'2rem 0'} >
            <Widget title={'Users'} value={stats?.usersCount} Icon={<PersonIcon />} />
            <Widget title={'Chats'} value={stats?.totalChatsCount} Icon={<GroupIcon />} />
            <Widget title={'Messages'} value={stats?.messagesCount} Icon={<MessageIcon />} />

        </Stack>

    return (
        <AdminLayout  >
             {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
            <Container  sx={{bgcolor:'#0f121a'}} component={'main'}  >

                {Appbar}

                <Stack direction={{xs:'column',lg:'row'}} sx={{gap:'2rem'}} flexWrap={'wrbap'} justifyContent={'center'} alignItems={{xs:'center',lg:'stretch'}}>

                    <Paper elevation={3} sx={{padding: '0rem 3.5rem', maxWidth: '45rem',maxHeight:'20rem',  bgcolor:'#0f121a',borderRadius: '1rem', width: '100%',boxShadow: '0px 0px 3px rgba(255, 255, 255, 0.3)','&:hover': {boxShadow: '0px 0px 6px rgba(255, 255, 255, 0.6)'} }} >
                        <Typography margin={'1rem 0'} variant='h6'color={'white'} >Last Messages</Typography>
                        <LineChart value={stats?.messagesChart || []} />
                    </Paper>

                    <Paper  elevation={3} sx={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', borderRadius: '1rem', width: { xs: '100%', sm: '50%' },maxHeight:'20rem', maxWidth: '25rem',bgcolor:'#0f121a',color:'white' ,boxShadow: '0px 0px 3px rgba(255, 255, 255, 0.3)','&:hover': {boxShadow: '0px 0px 6px rgba(255, 255, 255, 0.6)'} }} >
                       
                        <DoughnutChart  labels={['Single Chats','Group Chats']} value={[stats?.totalChatsCount - stats?.groupsCount || 0,stats?.groupsCount || 0,]} />

                        <Stack position={"absolute"} direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={"0.5rem"} width={'100%'} height={'100%'} >
                            <GroupIcon sx={{color:'#005717'}} /><Typography>vs</Typography>
                            <PersonIcon sx={{color:'#570041'}} />
                        </Stack>

                    </Paper>

                </Stack>
                {Widgets}

            </Container>
      )}
        </AdminLayout>
    )
}
const Widget = ({ title, value, Icon }) =>

    <Paper elevation={10} sx={{ padding: '2rem', margin: '2rem 0', borderRadius: '1rem', width: '20rem',bgcolor:'#0f121a',boxShadow: '0px 0px 3px rgba(255, 255, 255, 0.3)','&:hover': {boxShadow: '0px 0px 6px rgba(255, 255, 255, 0.6)'}  }} >
        <Stack alignItems={'center'} spacing={'1rem'}>
            <Typography sx={{ color: 'white', borderRadius: '50%', border: '2px solid white', width: '5rem', height: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', }}  >{value}</Typography>
          
            <Stack direction={'row'} spacing={'1rem'} alignItems={'center'} color={'white'}>
                {Icon}
                <Typography>{title}</Typography>
            </Stack>

        </Stack>
    </Paper>


export default Dashboard
