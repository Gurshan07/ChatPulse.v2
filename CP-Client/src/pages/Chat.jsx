/* eslint-disable react/prop-types */
import { Fragment, useCallback, useEffect, useRef, useState, } from "react";
import AppLayout from '../components/layout/AppLayout'
import { Button, IconButton, InputAdornment, Skeleton, Stack, TextField } from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material'
import { InputBox } from '../components/styles/StyledComponents'
import FileMenu from '../components/dialogs/FileMenu'
import MessageComponent from '../components/shared/MessageComponent'
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId, user }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  // const handleFileOpen = (e) => {
  //   dispatch(setIsFileMenu(true));
  //   setFileMenuAnchor(e.currentTarget);
  // };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment  >

      <Stack ref={containerRef} boxSizing={'border-box'} padding={'1rem'} spacing={'1rem'} height={'88%'} sx={{
        overflowX: 'hidden', overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '5px',
          height: '8px',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'grey',
          borderRadius: '10px',
          '&:hover': {
            backgroundColor: 'white',
          },
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#1d1d1d',
          borderRadius: '10px',
        }
      }} >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />

      </Stack>

      <form style={{ height: '10%' }} onSubmit={submitHandler}>

        <Stack direction={'row'} height={'100%'} padding={'1rem'} alignItems={'center'} justifyContent={'center'} position={'relative'}>


          <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />

          <TextField variant="outlined" color="secondary" placeholder='Type your message here' value={message} onChange={messageOnChange}

            sx={{
              width: '300px', // Adjust width as needed
              flexGrow: 0.75,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rebeccapurple',
                  borderRadius: '25px',
                },
                '&:hover fieldset': {
                  borderColor: 'purple',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'purple',
                  borderRadius: '25px',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'white', // Placeholder text color
              },
            }}
          />

          <Button variant="contained" endIcon={<SendIcon />} type="submit" sx={{
            marginLeft: '1rem',bgcolor: 'rebeccapurple',fontWeight: 'normal',
            transition: 'background-color 0.3s ease-in-out',
            '&:hover': {
              bgcolor: 'purple', 
            },
          }}>
            Send
          </Button>

        </Stack>

      </form>



    </Fragment>


  )
}

export default AppLayout()(Chat)

