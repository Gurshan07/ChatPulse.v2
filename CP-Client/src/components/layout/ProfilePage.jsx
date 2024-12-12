import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { Avatar, FormHelperText, Paper } from '@mui/material';
import * as React from 'react';
import { validate } from 'react-email-validator';
import { useSelector } from 'react-redux';
import { transformImage } from '../../lib/features';
import { useChangeBioMutation, useChangeEmailMutation, useChangeUsernameMutation, useGetMyAvatarQuery, useGetMyBioQuery } from '../../redux/api/api';
import AlertMessage from '../shared/AlertMessage';
import { useColor } from '../shared/ColorProvider ';
import CustomButton from '../shared/CustomButton';
import CustomTextField from '../shared/CustomTextField';
import AvatarFadeModalDialog from '../specific/AvatarFadeModalDialog';
import DropdownComponent from '../specific/DropdownComponent';



const ProfilePage = () => {
  const { data: userAvatar, isLoading } = useGetMyAvatarQuery();
  const { data: userBio } = useGetMyBioQuery();
  const [changeUsername] = useChangeUsernameMutation();
  const [changeEmail] = useChangeEmailMutation();


  const { uiColor1, uiColor2, darkmode } = useColor();
  const [changeBio] = useChangeBioMutation();
  const { user } = useSelector((state) => state.auth);


  const [bio, setBio] = React.useState('');

  const [avatarUrl, setAvatarUrl] = React.useState('');

  const [username, setUsername] = React.useState(user?.username || '');

  const [email, setEmail] = React.useState(user?.email || '');
  const [isValid, setIsValid] = React.useState(true);
  const [showValidation, setShowValidation] = React.useState(false);



  const handleUpdateUsernameAndEmail = async () => {
    const updatedUserParams = { username };
    const updatedEmailParams = { email };

    const isUsernameChanged = username !== user.username;
    const isEmailChanged = email !== user.email;

    if (!isUsernameChanged && !isEmailChanged) {
      setAlertMessage('No changes made ');
      setIsError(false);
      setAlertOpen(true);
      return;
    }

    if (showValidation && !isValid) {
      setAlertMessage('Enter a valid Email!');
      setIsError(true);
      setAlertOpen(true);

      return
    }
    try {

      const updatedUserResult = await changeUsername(updatedUserParams).unwrap();
      const updatedEmailResult = await changeEmail(updatedEmailParams).unwrap();

      if (updatedUserResult.success && updatedEmailResult.success) {
        setIsError(false);
        setAlertMessage('Data updated successfully!');
      } else {
        setIsError(true);
        setAlertMessage('Failed to update bio, Please try again later');
      }
    } catch (error) {
      setIsError(true);
      setAlertMessage('An error occurred, Please try again later');
    }
    setAlertOpen(true);
  };

  React.useEffect(() => {
    setUsername(user?.username || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleEmailChange = (event) => {
    const inputVal = event.target.value
    setEmail(inputVal);
    setIsValid(validate(inputVal));
    setShowValidation(true);

  };

  React.useEffect(() => {
    setUsername(user?.username || '');
  }, [user]);


  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };


  React.useEffect(() => {
    if (userBio) {
      setBio(userBio.bio);
    }
  }, [userBio]);


  const maxCharacters = 50;
  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setBio(value);
    }
  };

  const [alertMessage, setAlertMessage] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleUpdateBioChanges = async () => {
    const updatedBioParams = { bio }

    const isBioChanged = bio !== user.bio;

    if (!isBioChanged) {
      setAlertMessage('No changes made ');
      setIsError(false);
      setAlertOpen(true);
      return;
    }

    try {
      const result = await changeBio(updatedBioParams).unwrap();
      if (result.success) {
        setIsError(false);
        setAlertMessage('Bio updated successfully!');
      } else {
        setIsError(true);
        setAlertMessage('Failed to update bio, Please try again later');
      }
    } catch (error) {
      setIsError(true);
      console.log(error)
      setAlertMessage('An error occurred, Please try again later');
    }
    setAlertOpen(true);
  };

  const [isModalOpen, setModalOpen] = React.useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  React.useEffect(() => {
    if (!isLoading && userAvatar?.avatar) {
      setAvatarUrl(userAvatar.avatar.url);
    }
  }, [isLoading, userAvatar]);

  return (

    <>
   {isModalOpen && (
                    <AvatarFadeModalDialog OpenModal={openModal} CloseModal={closeModal} open={isModalOpen} />
                  )}
    <Paper sx={{ bgcolor: darkmode ? "black" : 'white', }}>

      <Box className="unselectable" sx={{ flex: 1, width: '100%' }}>
        <Box
          sx={{
            position: 'sticky',
            top: { xs: -80, sm: -90, md: -110 },
            bgcolor: darkmode ? "black" : 'white',
            zIndex: 9995,
          }}
        >
          <Box sx={{ px: { xs: 2, md: 6 } }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="sm" />}
              sx={{ pl: 0 }}
            >
              <Link underline="none" href="/">
                <HomeRoundedIcon sx={{ color: darkmode ? "white" : 'black' }} />
              </Link>

              <Typography color="secondary" sx={{ fontWeight: 500, fontSize: 12, color: darkmode ? "white" : 'black' }}>
                Profile
              </Typography>
            </Breadcrumbs>
            <Typography
              level="h3"
              component="h1"
              sx={{ color: darkmode ? "white" : 'black', mt: 1, mb: 2 }}
            >
              My profile
            </Typography>
          </Box>
        </Box>

        <Stack
          spacing={4}
          sx={{
            display: 'flex',
            maxWidth: '800px',
            mx: 'auto',
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          }}
        >
          <Card sx={{ bgcolor: darkmode ? "black" : 'white', border: 0 }}>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md" sx={{ color: darkmode ? "white" : 'black' }}>
                Personal Info
              </Typography>
              <Typography level="body-sm">
                Customize how your profile information will appear to the others.
              </Typography>
            </Box>
            <Divider />

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{ my: 1, alignItems: 'center', marginBottom: '2rem' }}
            >
              <Stack direction="column" spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                  <Avatar
                    src={transformImage(avatarUrl)}
                    sx={{
                      width: 88,
                      height: 88,
                      objectFit: 'contain',
                      border: `4px solid ${uiColor1}`,
                    }}
                  />
                  <IconButton
                    onClick={openModal}
                    aria-label="upload new picture"
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      position: 'absolute',
                      zIndex: 2,
                      borderRadius: '50%',
                      left: 65,
                      top: 65,
                      boxShadow: 'sm',
                      border: '2px solid',
                      borderColor: darkmode ? "white" : 'black',

                    }}
                  >
                    <EditRoundedIcon sx={{ color: darkmode ? "white" : "black", }} />
                  </IconButton>

                  
                </Box>
              </Stack>


              <Box
                sx={{
                  width: { xs: '80%', sm: '30%' },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography sx={{ color: darkmode ? "white" : "black" }} typography="h3">{user.name}</Typography>
              </Box>
            </Stack>


            <FormControl sx={{ mb: 2 }}>
              <FormLabel sx={{ color: darkmode ? "white" : "black" }} >Username</FormLabel>
              <CustomTextField rows={1} placeholder="username" value={username} onChange={handleUsernameChange} icon={<PersonIcon sx={{ color: darkmode ? "white" : "black" }} />} />
            </FormControl>

            <FormControl sx={{ flexGrow: 1, mb: 2, }}>

              <FormLabel sx={{ color: darkmode ? "white" : "black" }}>Email</FormLabel>

              <CustomTextField rows={1} placeholder="mail@email.com" value={email} onChange={handleEmailChange} icon={<EmailRoundedIcon sx={{ color: darkmode ? "white" : "black" }} />} />

              {showValidation && (
                <span style={{
                  transform: 'translateY(-50%)',
                  color: isValid ? 'lime' : 'red', fontStyle: 'italic', marginTop: '1rem', marginLeft: '1rem'
                }}>
                  {isValid ? 'Valid email !' : 'Invalid email !'}


                </span>
              )}
            </FormControl>

            <FormControl sx={{ flexGrow: 1, mb: 2, }}>

              <FormLabel sx={{ color: darkmode ? "white" : "black" }}>Gender</FormLabel>

              <DropdownComponent />

            </FormControl>

            <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 2 }}>
              <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                <CustomButton onClick={handleUpdateUsernameAndEmail} Darkmode={darkmode} text={'Save changes'} />

              </CardActions>
            </CardOverflow>
          </Card>



          <Card sx={{ bgcolor: darkmode ?"black" : 'white', border: 0 }}>
            
            <Box sx={{ mb: 1 }}>
              <Typography sx={{ color: darkmode ? "white" : "black" }} level="title-md">Bio</Typography>
              <Typography level="body-sm">
                Write a short introduction to be displayed on your profile
              </Typography>
            </Box>
            <Divider />
            <Stack spacing={2} sx={{ my: 1 }}>
              <CustomTextField value={bio} onChange={handleChange}
              />

              <FormHelperText sx={{ mt: 0.75, fontSize: 'xs', color: 'gray' }}>
                {maxCharacters - bio.length} characters left
              </FormHelperText>
            </Stack>
            <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
              <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>

                <CustomButton Darkmode={darkmode} text={'Save changes'} onClick={handleUpdateBioChanges} />
              </CardActions>
            </CardOverflow>
          </Card>
          
          <AlertMessage
            value={alertMessage}
            open={alertOpen}
            onClose={handleCloseAlert}
            isError={isError}
          />
        </Stack>
      </Box>


    </Paper>
 </>
  );
};

export default ProfilePage;
