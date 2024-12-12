import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";
import MoecounterComponent from "../components/moeCounter";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';


const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };


    return (
    <Container component={'main'} maxWidth='xs' sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center',}}>

        <Paper elevation={3} sx={{ color: 'white', bgcolor: 'black', padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', border :'solid 0px rgb(138, 145, 165,0.25)', borderRadius:'15px'}}>

            {
                isLogin ? (

                    <>
                        <Typography variant='h3' className='unselectable' marginBottom={'2rem'} fontWeight={'bold'} textAlign={'center'} >Login to ChatPulse</Typography>
                        <form style={{ width: '100%', marginTop: '1rem' }} onSubmit={handleLogin}>

                            <TextField className='customTextField' id='customTextFieldText' required fullWidth label="Username" margin='normal' varient='outlined' autoComplete='off' value={username.value} onChange={username.changeHandler} />
                            <TextField className='customTextField' id='customTextFieldText' required fullWidth label="Password" type='password' margin='normal' autoComplete='off' varient='outlined' value={password.value} onChange={password.changeHandler} />

                            <div className="button-container" style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <Button sx={{ marginTop: '1rem' }} variant='text' color='info' type='submit' disabled={isLoading} >Login</Button>
                                <Button sx={{ marginTop: '1rem', fontWeight: 'bold', }} variant='outlined' color='success' disabled={isLoading} onClick={toggleLogin}>Sign Up </Button>
                            </div>
                        </form>
                    <MoecounterComponent/>
                    </>
                )

                    :
                    (
                        <>
                            {/* <div className="scrollable-container"> */}

                            <div >
                                <Typography sx={{ textAlign: 'center' }} variant='h4' marginTop={'2vh'} fontWeight={'bold'} className='unselectable'>Create Your ChatPulse Account</Typography>
                                <form style={{ width: '100%', marginTop: '1vh' }} onSubmit={handleSignUp}  >



                                    <Stack position={'relative'} width={'10rem'} margin={'auto'}>
                                        <Avatar sx={{ marginLeft: '20%', width: '7rem', height: '7rem', objectFit: 'contain' }} src={avatar.preview} />

                                        <IconButton sx={{ position: 'absolute', bottom: '0', right: '0', color: 'black', bgcolor: 'gray', ':hover': { bgcolor: 'white' }, }} component='label'  >
                                            <>
                                                <CameraAltIcon />
                                                <VisuallyHiddenInput type='file' onChange={avatar.changeHandler} />
                                            </>
                                        </IconButton>
                                    </Stack>
                                    {avatar.error && (<Typography color='error' paddingLeft={'2vh'} variant='caption'>{avatar.error}</Typography>)}

                                    <TextField className='customTextField' id='customTextFieldText' required fullWidth label="Name" margin='normal' varient='outlined' autoComplete='off' value={name.value} onChange={name.changeHandler} />
                                    <TextField className='customTextField' id='customTextFieldText' required fullWidth label="Bio" margin='normal' varient='outlined' autoComplete='off' value={bio.value} onChange={bio.changeHandler} />
                                    <TextField className='customTextField' id='customTextFieldText' required fullWidth label="Username" margin='normal' varient='outlined' autoComplete='off' value={username.value} onChange={username.changeHandler} />
                                    {username.error && (<Typography color='error' variant='caption'>{username.error}</Typography>)}

                                    <TextField className='customTextField' id='customTextFieldText' required fullWidth label="Password" type='password' margin='normal' varient='outlined' autoComplete='off' value={password.value} onChange={password.changeHandler} />
                                    {password.error && (<Typography color='error' variant='caption'>{password.error}</Typography>)}

                                    <div className="button-container" style={{ display: 'flex', justifyContent: 'space-around' }} >
                                        <Button sx={{ marginTop: '1rem',fontWeight:'bold' }}variant='outlined' color='secondary'  disabled={isLoading} >Sign Up</Button>
                                        <Button sx={{ marginTop: '1rem', fontWeight: 'bold' }} variant='text'  color='info' disabled={isLoading} onClick={toggleLogin}>Login </Button>
                                    </div>

                                </form>
                            </div>

                        </>
                    )
            }

        </Paper>
        <a href="/admin">
        <AdminPanelSettingsIcon  style={{borderRadius:'50% ',height:'2rem',position: 'fixed',bottom: '2rem',right: '2rem',color:'grey'}}  />
        </a>
    </Container>
    )

}

export default Login
