import { Avatar,  Box,  Stack, Typography } from '@mui/material'
import { Face as FaceIcon,AlternateEmail as UsernameIcon,CalendarMonth as CalendarIcon } from '@mui/icons-material'
import moment from 'moment'
import { transformImage } from "../../lib/features";

const Profile =({ user })=> {
  return (
    <Stack className='unselectable' spacing={'2rem'} direction={'column'} alignItems={'center'} sx={{marginTop:'1rem', bgcolor: 'rgb(138, 145, 165,0.05)',border :'solid 0.5px rgb(138, 145, 165,0.25)', borderRadius:'15px'}}>
 <Box></Box>
  <Typography variant='h5'>
    Profile
  </Typography>
      <Avatar  src={transformImage(user?.avatar?.url)}  sx={{width:90,height:90,objectFit:'contain',marginBottom:'1rem',border:'1px solid white'}} />
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard heading={"Username"} text={user?.username} Icon={<UsernameIcon />} />
      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon />} />
      <ProfileCard heading={"Joined"} text={moment(user?.createdAt).fromNow()} Icon={<CalendarIcon />}/>
<Box></Box>


    </Stack>
  )
}

const ProfileCard =({text,Icon,heading})=> (

<Stack direction={'row'} alignItems={'center'} spacing={'1rem'} color={'white'} textAlign={'center'}  >
{Icon && Icon}


<Stack>
<Typography color={'grey'} variant='caption'>{heading}</Typography>
<Typography variant='body1'>{text}</Typography>

</Stack>

</Stack>
);

export default Profile 
