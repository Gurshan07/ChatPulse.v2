import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import { Box, Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";
import { useColor } from '../shared/ColorProvider ';

const Search = () => {

  const { isSearch } = useSelector((state) => state.misc);
  const { uiColor1, uiColor2, darkmode } = useColor();

  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();

  const search = useInputValidation("");

  const [users, setUsers] = useState([]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 700);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  return (
    <Dialog PaperProps={{ sx: { bgcolor: darkmode ? 'black' : 'white', borderRadius: '15px' ,border: '1px solid rgba(255, 255, 255, 0.3)'} }} open={isSearch} onClose={searchCloseHandler}
      sx={{
        '& .MuiDialog-paperScrollPaper': {
          scrollbarGutter: 'stable',
          '&::-webkit-scrollbar': {
            width: '0px',
            height: '0px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',

          },
        }
      }}>

      <Box  >

        <Stack className='unselectable' p={'2rem'} direction={'column'} maxWidth={'25rem'} maxHeight={'25rem'} bgcolor={darkmode ? 'black' : 'white'} color={darkmode ? 'white' : 'black'}   >

          <DialogTitle textAlign={'center'}>Find People</DialogTitle>

          <TextField value={search.value} onChange={search.changeHandler} variant='outlined' size='small' autoComplete='off' 
          sx={{
            
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: darkmode? 'white':'black',
            }, '& .MuiOutlinedInput-root:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
              borderColor: '#282828',
            },

          }}
          InputProps={{
            startAdornment: (<InputAdornment position='start' > <SearchIcon sx={{ color: darkmode ? 'white' : 'black' }} /> </InputAdornment>), style: {
              color: darkmode ? 'white' : 'black',
            }
          }} />

          <List >
            {users.map((i) => (
              <UserItem user={i} key={i._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest} />
            ))}
          </List>

        </Stack>
      </Box>

    </Dialog>
  )
}

export default Search
