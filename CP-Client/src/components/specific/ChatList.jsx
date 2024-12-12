/* eslint-disable react/prop-types */
import { Stack } from '@mui/material'
import React from 'react'
import ChatItem from '../shared/ChatItem'
import { useGetIsOnlineQuery } from '../../redux/api/api';

const ChatList=({w='100%',chats=[],chatId,onlineUsers=[],newMessagesAlert=[
{
    chatId:'',
    count:0,
},
],handleDeleteChat,
})=> {
const { data} = useGetIsOnlineQuery();
    
    return (
      <Stack width={w} direction={'column'}  sx={{overflow:'auto','&::-webkit-scrollbar': {display: 'none'},}} marginTop={'0.5rem'}  height={'90vh'}  >

                {
                    chats?.map((data,index)=>{

                    const {avatar,_id,name,groupChat,members}=data;

                    const newMessageAlert=newMessagesAlert.find(
                        ({chatId})=>chatId===_id
                    )
                    const isOnline = members?.some((member) =>{
                        if(data?.isOnline){

                        }
                      onlineUsers.includes(member)

                    });

                        return <ChatItem   index={index} newMessageAlert={newMessageAlert}  isOnline={isOnline}   avatar={avatar} name={name} _id={_id} key={_id} groupChat={groupChat} sameSender={chatId===_id} handleDeleteChat={handleDeleteChat} />
                    })
                }
        </Stack>
    )
}

export default ChatList