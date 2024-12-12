/* eslint-disable react/prop-types */
import { Avatar, AvatarGroup, Box, Stack } from '@mui/material';
import React from 'react';
import { transformImage } from '../../lib/features';

const AvatarCard = ({
  avatar = [],
  max = 3,
  isOnline = false, 
}) => {
  return (
    <Stack direction={'row'} spacing={0.5} alignItems={'center'} >
      <AvatarGroup max={max} sx={{ position: 'elative' }} >
        <Box width={'5rem'} height={'3rem'} >
          {avatar.map((i, index) => (
            <Avatar
              key={Math.random() * 100}
              src={transformImage(i)}
              alt={`Avatar ${index}`}
              sx={{
                '&': {
                  width: '3rem',
                  height: '3rem',
                  position: 'absolute',
                  left: avatar.length === 1? '50%' : { xs: `${0.5 + index}rem`, sm: `${index}rem` },
                  transform: avatar.length === 1? 'translateX(-50%)' : 'none',
                  border: isOnline? '2px solid lime!important': '2px solid grey!important',
                },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;