/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
import { Box, Drawer, Grid, Skeleton, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Header from "./Header";
import { useColor } from "../shared/ColorProvider ";


const AppLayout = () => (WrappedComponent) => {

  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();

    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
    const { uiColor1, uiColor2, darkmode } = useColor();

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };
    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header user={user} />

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose} PaperProps={{
            sx: {
              paddingTop: '1rem',
              overflow: 'hidden',
              bgcolor: darkmode ? "black" : "white",
            },


          }}>

            {data?.chats?.length === 0 ?
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                  <Typography className='unselectable' p={'2rem'} variant='h5' textAlign={'center'} color={darkmode? 'white': 'black'}>No Friends Added</Typography>
                </div>
              </>
              :
              <>
                <Typography className='unselectable' variant='h5' textAlign={'center'} sx={{color:darkmode? 'white': 'black',}} > Chats </Typography>

                <ChatList
                  w="65vw"
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                />
              </>

            }
          </Drawer>
        )}

        <Grid container style={{ height: `calc(100vh - 4rem)`, overflowY: 'hidden',backgroundColor:darkmode?'black':'white',color:darkmode?'white':'black' }} >

          <Grid item sm={4} md={3} sx={{ display: { xs: 'none', sm: 'block' }, }} height={'95%'}   >

            {isLoading ? (
              <Skeleton />
            ) : (
              <Box >
                {data?.chats?.length === 0 ?
                  <Typography className='unselectable' p={'2rem'} variant='h5' textAlign={'center'} color={darkmode? 'white' :'black'}>No Friends Added</Typography>
                  :
                  <ChatList

                    chats={data?.chats}
                    chatId={chatId}
                    handleDeleteChat={handleDeleteChat}
                    newMessagesAlert={newMessagesAlert}
                    onlineUsers={onlineUsers}
                  />
                }
              </Box>
            )}
          </Grid>


          <Grid item xs={12} sm={8} md={5} lg={9} height={'100%'} color={darkmode? 'white' :'black'} > <WrappedComponent {...props} chatId={chatId} user={user} /></Grid>


          {/* <Grid item md={4} lg={3} sx={{ display: { xs: 'none', md: 'block' }, padding: '2rem' }} color={'white'} height={'100%'}  >
            <Profile user={user} />

          </Grid> */}


        </Grid>


      </>
    )
  }
}
export default AppLayout
