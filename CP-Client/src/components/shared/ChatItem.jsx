/* eslint-disable react/prop-types */
import React, { memo } from "react";
import { Link } from '../styles/StyledComponents'
import { Stack, Typography } from '@mui/material'
import AvatarCard from './AvatarCard'
import { motion } from "framer-motion";
import { useColor } from "./ColorProvider ";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const { uiColor1, uiColor2, darkmode } = useColor();


  return <Link
    sx={{ color: darkmode ? 'white' : 'black', padding: '0', marginTop: '1rem', marginRight: '1rem', marginLeft: '0.5rem', borderRadius: '15px', '&:hover': { bgcolor: 'rgb(138, 145, 165,0.25)' } }}
    to={`/chat/${_id}`} onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}>

    <motion.div
      initial={{ opacity: 0, y: "-100%" }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      style={{
        backgroundColor: sameSender ? 'rgb(108, 105, 105,0.55)' : 'unset',

        borderRadius: '15px',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem',
        paddingLeft: '2rem',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', right: '1rem' }}>
        <AvatarCard avatar={avatar} isOnline={groupChat ? false : isOnline} />

      </div>
      <Stack>
        <Typography sx={{ position: 'relative' }}>{name}</Typography>
        {newMessageAlert && (
          <Typography style={{ color: sameSender ? 'grey' : '#04fb19', fontSize: '0.7rem' }} >{newMessageAlert.count} New Mesage</Typography>)}

      </Stack>

    </motion.div>

  </Link>
}

export default memo(ChatItem);