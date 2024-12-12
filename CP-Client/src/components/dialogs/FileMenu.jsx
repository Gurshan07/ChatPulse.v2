import { Box, ListItemText, Menu, MenuItem, MenuList, SpeedDial, SpeedDialAction, SpeedDialIcon, Tooltip } from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";

const FileMenu = ({ anchorE1, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);

  
  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  // const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  // const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) return;

    if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();

      myForm.append("chatId", chatId);
      
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);

      if (res.data) toast.success(`${key} sent successfully`, { id: toastId });
      else toast.error(`Failed to send ${key}`, { id: toastId });

      // Fetching Here
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  const actions = [
    { icon: <><VideoFileIcon onClick={selectVideo}/> 
     <input type="file" multiple accept="video/mp4, video/webm, video/ogg"
    style={{ display: "none" }} onChange={(e) => fileChangeHandler(e, "Videos")} ref={videoRef} /></>, name: 'Video' },

    { icon: <><AudioFileIcon onClick={selectAudio}/> 
     <input type="file" multiple accept="audio/mpeg, audio/wav" style={{ display: "none" }} 
    onChange={(e) => fileChangeHandler(e, "Audios")} ref={audioRef} /></>, name: 'Audio' },

    { icon: <>
    <ImageIcon onClick={selectImage}/>
    <input type="file" multiple accept="image/png, image/jpeg, image/gif" 
      style={{ display: "none" }} onChange={(e) => fileChangeHandler(e, "Images")} ref={imageRef}/> 
      </>, name: 'Image' },
    
  ];

  return (

    <Box sx={{ height: 90, transform: 'translateZ(0px)' ,marginLeft:'3rem'}}>
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: 'absolute', bottom: 16, right: 16,
        '& .MuiFab-primary': {
          backgroundColor: 'rebeccapurple', 
          color: 'white', 
          '&:hover': {
            backgroundColor: 'purple', 
          },
        },
       }}
      icon={<SpeedDialIcon  />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
        />
      ))}
    </SpeedDial>
  </Box>

  );
};

export default FileMenu;