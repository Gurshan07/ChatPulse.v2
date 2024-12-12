import CheckIcon from '@mui/icons-material/Check';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SyncIcon from '@mui/icons-material/Sync';
import { Box } from '@mui/joy';
import Button from '@mui/joy/Button';
import DialogTitle from '@mui/joy/DialogTitle';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { Avatar, CircularProgress } from '@mui/material';
import Chip from '@mui/material/Chip';
import hgen from 'hexadecimal-gen';
import * as React from 'react';
import { useChangeCustomedAvatarMutation, useChangeGeneratedAvatarMutation, useGetMyAvatarQuery } from '../../redux/api/api';
import { useColor } from '../shared/ColorProvider ';
import CustomButton from '../shared/CustomButton';
import { Transition } from 'react-transition-group';


const AvatarFadeModalDialog = ({ OpenModal, CloseModal, open, }) => {

  const { data: userAvatar, isLoading } = useGetMyAvatarQuery();
  const [changeCustomedAvatar] = useChangeCustomedAvatarMutation();
  const [changeGeneratedAvatar] = useChangeGeneratedAvatarMutation();

  const { uiColor1, uiColor2, darkmode } = useColor();

  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [uploadedImage, setUploadedImage] = React.useState(null);
  const [chipVisible, setChipVisible] = React.useState(false);
  const [isChanging, setIsChanging] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isGenerated, setIsGenerated] = React.useState(false);


  const generatedAvatar = async () => {
    setIsChanging(true);
    setIsSuccess(false);

    setChipVisible(true);

    const newUrl = `https://api.multiavatar.com/${hgen(128)}.svg?apikey=oWw1E9p8e3f5FV`;

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsGenerated(true)
    setAvatarUrl(newUrl);

    setTimeout(function () {
      setIsChanging(false);
      setChipVisible(true);
    }, 750);
  };

  const imageRef = React.useRef(null);
  const selectImage = () => (imageRef.current?.click())

  const handleUploadAvatar = async () => {


    const public_id = userAvatar.avatar.public_id;

    const avatarData = {
      url: avatarUrl,
      public_id: public_id
    };
    setIsChanging(true);
    setIsSuccess(false);
    try {
      if (isGenerated) {
        const response = await changeGeneratedAvatar({ avatar: avatarData });
        console.log(" Generated Avatar updated successfully:", response);
      }
      else {
        const response = await changeCustomedAvatar({ avatar: avatarData, file: uploadedFile });
        console.log(" Custom Avatar updated successfully:", response);
      }

      setIsSuccess(true);

    } catch (error) {
      console.error("Error updating avatar:", error);
      handleClose();
      setIsSuccess(false);
    } finally {
      setIsChanging(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsSuccess(false);

      setUploadedFile(file);
      setUploadedImage(file);
      setChipVisible(true);
      const imageURL = URL.createObjectURL(file);
      setAvatarUrl(imageURL);
    }

  };


  React.useEffect(() => {
    if (!isLoading && userAvatar?.avatar) {
      setAvatarUrl(userAvatar.avatar.url);
    }
  }, [isLoading, userAvatar]);

  const handleClose = () => {
    if (CloseModal) {
      CloseModal();
    }
  };

  return (
    <>
      <Transition in={open} timeout={400}>
        {(state) => (
          <Modal
            keepMounted
            open={!['exited', 'exiting'].includes(state)}
            onClose={handleClose}
            slotProps={{
              backdrop: {
                sx: {
                  opacity: 0,
                  backdropFilter: 'none',
                  transition: `opacity 400ms, backdrop-filter 400ms`,
                  ...{
                    entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                    entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                  }[state],
                },
              },
            }}
            sx={[
              state === 'exited'
                ? { visibility: 'hidden' }
                : { visibility: 'visible' },
            ]}
          >
            <ModalDialog
              sx={{
                opacity: 0, bgcolor: darkmode ? "black" : 'white',
                transition: `opacity 300ms`,
                ...{
                  entering: { opacity: 1 },
                  entered: { opacity: 1 },
                }[state],
              }}
            >
              <DialogTitle sx={{ color: darkmode ? "white" : "black" }}>Update your Avatar</DialogTitle>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem', marginBottom: '1rem', position: 'relative', height: '120px', }}>

                <Avatar src={avatarUrl} sx={{ width: 120, height: 120, objectFit: 'contain', border: `3px solid ${uiColor1}`, }} />

                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '60px', height: '40px' }}>

                  {isChanging || isSuccess ? (
                    <>
                      {isChanging && (<CircularProgress sx={{ position: 'absolute', color: uiColor1, scale: 0.5, transition: 'opacity 0.3s ease-in-out', opacity: isChanging ? 1 : 0, }} />)}

                      {isSuccess && (<CheckIcon sx={{ position: 'absolute', color: 'lime', transition: 'opacity 0.3s ease-in-out', opacity: isSuccess ? 1 : 0, }} />)}

                    </>
                  ) : (
                    !isSuccess && chipVisible && (
                      <Chip size="md" variant="outlined" label={<Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckIcon fontSize="small" style={{ marginLeft: 2 }} />

                      </Box>
                      }
                        onClick={handleUploadAvatar}
                        sx={{
                          position: 'absolute', top: 0, right: 0, bgcolor: darkmode ? "black" : 'white',
                          border: `1px solid ${uiColor1}`, color: darkmode ? 'white' : 'black',
                          transition: 'opacity 0.3s ease-in-out', opacity: chipVisible ? 1 : 0,
                        }} />
                    )
                  )}
                </Box>

              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={selectImage} sx={{
                  color: darkmode ? "white" : "black", bgcolor: 'gray',
                  '&:hover': { bgcolor: 'darkgray' },
                  '&:focus': { bgcolor: 'gray', outline: 'none' },
                  '&:active': { bgcolor: 'gray' }
                }} >
                  Upload <FileUploadIcon />
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    style={{ display: "none" }}
                    ref={imageRef}
                    onChange={handleImageUpload}
                  />
                </Button>
                <CustomButton Darkmode={darkmode} text={"Generate"} onClick={generatedAvatar} icon={<SyncIcon />} />
              </Box>

            </ModalDialog>
          </Modal>

        )}

      </Transition>
    </>
  );
};

export default AvatarFadeModalDialog;

