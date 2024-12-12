import { Box, ModalClose } from '@mui/joy';
import emailjs from '@emailjs/browser';
import Button from '@mui/joy/Button';
import DialogTitle from '@mui/joy/DialogTitle';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { Avatar, CircularProgress, DialogActions, DialogContent, Divider, Typography } from '@mui/material';
import * as React from 'react';
import { server } from '../../constants/config';
import { useColor } from '../shared/ColorProvider ';
import { Transition } from 'react-transition-group';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useGetMyAvatarQuery, useLazyGetMyOtpQuery, useValidateOtpMutation } from '../../redux/api/api';
import { useSelector } from 'react-redux';
import OTPInput from './OtpInput';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userNotExists } from '../../redux/reducers/auth';
import toast from 'react-hot-toast';

const DeleteAccountModal = ({ OpenModal, CloseModal, open, }) => {

    const [triggerGetMyOtp, { data, error, }] = useLazyGetMyOtpQuery();
    const [validateOtp] = useValidateOtpMutation();
    const navigate = useNavigate();

    const [otp, setOtp] = React.useState('');

    const handleOtpChange = (otpValue) => {
        setOtp(otpValue)
    };

    const { data: userAvatar, isLoading } = useGetMyAvatarQuery();
    const [avatarUrl, setAvatarUrl] = React.useState('');
    const { user } = useSelector((state) => state.auth);
    const [timer, setTimer] = React.useState(10);
    const [countdown, setCountdown] = React.useState(600);
    const [isDisabled, setIsDisabled] = React.useState(false);
    const [isOtpValidated, setIsOtpValidated] = React.useState(false);


    React.useEffect(() => {
        if (!isLoading && userAvatar?.avatar) {
            setAvatarUrl(userAvatar.avatar.url);
        }
    }, [isLoading, userAvatar]);


    const { uiColor1, uiColor2, darkmode } = useColor();
    const [isModalOpen, setModalOpen] = React.useState(false);

    const openModal = () => {
        setCloseButton(() => null);
        setModalOpen(true);
    };

    const handleClose = () => {
        if (CloseModal) {
            CloseModal();
        }
    };

    const [closeButton, setCloseButton] = React.useState(() => handleClose);
    const [isFirstOtp, setIsFirstOtp] = React.useState(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_ACCDEL_TEMPLATE_ID;
    const userId = import.meta.env.VITE_EMAILJS_USER_ID;
    
    const validateOTPhandler = async () => {
        const response = await validateOtp({ userId: user._id, otp: otp }).unwrap();

        console.log("OTP validation response:", response.success);

        if (response.success) {
            setIsOtpValidated(true);
            setCountdown(6)
        }
        else {

        }

    };


    const sendOtpEmailData = (otp) => {
        const templateParams = {
            userEmail: user.email,
            username: user.username,
            otp: otp,
        };
        emailjs.send(serviceId, templateId, templateParams, userId)
            .then((response) => {
                console.log('OTP sent successfully!', response.status, response.text);
            })
            .catch((error) => {
                console.error('Failed to send OTP', error);
            }).finally(() => {
            });
    }

    const sendOtpEmail = () => {

        setIsFirstOtp(false);
        setTimer(5);
        setIsDisabled(true);

        triggerGetMyOtp().then((response) => {
            const otp = response.data.otp
            // if (response.data) {
            //     console.log("Fetched OTP:", otp);
            // }
            sendOtpEmailData(otp);

        }).catch((err) => {
            console.error("Error fetching OTP:", err);
        });
    };

    React.useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
        else if (timer === 0) {
            setIsDisabled(false);
        }
    }, [timer]);
    React.useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
    };
    const logoutHandler = async () => {

        sessionStorage.removeItem('hasVisitedHomePage');

        const { data } = await axios.get(`${server}/api/v1/user/logout`, {
            withCredentials: true,
        });
    };
    if (countdown == 0) {
        logoutHandler()
        navigate('/login')
    }
    return (
        <>

            <Transition in={open} timeout={400}>
                {(state) => (
                    <Modal className='unselectable' keepMounted open={!['exited', 'exiting'].includes(state)} onClose={closeButton}
                        slotProps={{
                            backdrop: {
                                sx: {
                                    opacity: 0, backdropFilter: 'none',
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

                        {isModalOpen ?

                            isOtpValidated ?
                                (
                                    (<ModalDialog variant="outlined" role="alertdialog"
                                        sx={{
                                            opacity: 0, bgcolor: darkmode ? "black" : "white",
                                            transition: `opacity 300ms`,
                                            ...{
                                                entering: { opacity: 1 },
                                                entered: { opacity: 1 },
                                            }[state],
                                        }}>
                                        <Box sx={{ marginTop: '2rem' }}></Box>

                                        <Divider sx={{ bgcolor: 'transparent' }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                                            <Avatar src={avatarUrl} sx={{ display: 'none', width: 70, height: 70, objectFit: 'contain', }} />
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography variant='h6' sx={{ fontWeight: 'bold' }} color={darkmode ? 'white' : 'black'}>Account has been Deleted</Typography>
                                        </Box>
                                        <DialogContent sx={{ display: 'flex', justifyContent: 'center' }} >Redirecting in..{countdown}</DialogContent>

                                        <Divider sx={{ bgcolor: 'transparent' }} />

                                    </ModalDialog>)
                                )
                                :
                                (<ModalDialog variant="outlined" role="alertdialog"
                                    sx={{
                                        opacity: 0, bgcolor: darkmode ? "black" : "white",
                                        transition: `opacity 300ms`,
                                        ...{
                                            entering: { opacity: 1 },
                                            entered: { opacity: 1 },
                                        }[state],
                                    }}>
                                    <DialogTitle sx={{ color: darkmode ? 'white' : 'black' }}>
                                        <WarningRoundedIcon sx={{ color: 'red' }} />
                                        Confirm OTP
                                    </DialogTitle>
                                    <ModalClose
                                        onClick={handleClose}
                                        variant="plain"
                                        sx={{ m: 1 }}
                                    />

                                    <DialogContent sx={{ color: 'gray', padding: 0, paddingBottom: '0.5rem' }} >
                                        OTP will be sent to <b style={{ color: darkmode ? 'white' : 'black' }} >{user.email}</b>
                                    </DialogContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <OTPInput onOtpSubmit={handleOtpChange} />
                                    </Box>
                                    {isDisabled ? (
                                        <span>Resend OTP in {formatTime(timer)}</span>
                                    ) : (
                                        <Box sx={{ display: 'flex', }}>

                                            <span onClick={sendOtpEmail} style={{ textDecoration: 'underline', cursor: 'pointer', color: darkmode ? 'white' : 'black', }}
                                            >
                                                {isFirstOtp ? 'Send OTP' : 'Resend OTP'}
                                            </span>
                                        </Box>
                                    )}

                                    <Divider sx={{ bgcolor: 'gray' }} />

                                    <Button variant="solid" color="danger" onClick={validateOTPhandler} sx={{color:darkmode? 'black' :'white'}} >
                                        Confirm Deletion
                                    </Button>

                                </ModalDialog>)
                            :

                            (<ModalDialog variant="outlined" role="alertdialog"
                                sx={{
                                    opacity: 0, bgcolor: darkmode ? "black" : 'white',
                                    transition: `opacity 300ms`,
                                    ...{
                                        entering: { opacity: 1 },
                                        entered: { opacity: 1 },
                                    }[state],
                                }}>
                                <DialogTitle sx={{ color: darkmode ? 'white' : 'black' }}>
                                    <WarningRoundedIcon sx={{ color: 'red' }} />
                                    Confirmation
                                </DialogTitle>

                                <Divider sx={{ bgcolor: 'gray' }} />
                                <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                                    <Avatar src={avatarUrl} sx={{ width: 70, height: 70, objectFit: 'contain', border: `1px solid ${uiColor1}`, }} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: 'bold' }} color={darkmode ? 'white' : 'black'}>{user.username}</Typography>
                                </Box>
                                <DialogContent  >
                                    Are you sure you want to delete this account?
                                </DialogContent>

                                <Divider sx={{ bgcolor: 'gray' }} />

                                <Button variant="solid" color="danger" onClick={openModal}  >
                                    I want to Delete this account
                                </Button>


                            </ModalDialog>)

                        }
                    </Modal>

                )}

            </Transition>
        </>
    );
};

export default DeleteAccountModal;

