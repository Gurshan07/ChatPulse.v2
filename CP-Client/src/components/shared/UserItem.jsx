import {Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material'
import { Add as AddIcon,Remove as RemoveIcon} from '@mui/icons-material'
import {memo} from 'react'
import { transformImage } from "../../lib/features";
const UserItem = ({ user, handler, handlerIsLoading ,isAdded=false}) => {

    const { name, _id, avatar } = user

    return (
        <ListItem> 
            
            <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'} >
                <Avatar  src={transformImage(avatar)}  />
                <Typography varient='body1' sx={{flexGrow:1,display:'-webkit-box',WebkitLineClamp:1,WebkitBoxOrient:'vertical',overflow:'hidden',textOverflow:"ellipsis", width:'100%'}}>{name}</Typography>

                <IconButton color='default' size='small'  sx={{bgcolor:'',color:'grey',"&:hover":{bgcolor:'rgb(138, 145, 165,0.25)','& svg':{color: isAdded ? 'red':'green'}},}} onClick={()=>handler(_id)} disabled={handlerIsLoading} >
                   
                   {isAdded ? <RemoveIcon  />:<AddIcon />}
                   
                    
                </IconButton>
            </Stack>

     
        </ListItem>
    )
}

export default memo(UserItem)
