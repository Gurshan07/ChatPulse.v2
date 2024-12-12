import emailjs from '@emailjs/browser';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import FormHelperText from '@mui/joy/FormHelperText';
import Link from '@mui/joy/Link';
import Stack from '@mui/joy/Stack';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import TabPanel from '@mui/joy/TabPanel';
import Tabs from '@mui/joy/Tabs';
import Typography from '@mui/joy/Typography';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useColor } from './ColorProvider ';
import { Colors } from './Colors';
import CustomTextField from './CustomTextField';
import DeleteAccountModal from '../specific/DeleteAccountModal';
import { CircularProgress, Paper } from '@mui/material';
import AlertMessage from '../shared/AlertMessage';
import UseSwitchesCustom from '../specific/darkmodeButton';
import { dark } from '@mui/material/styles/createPalette';

const SettingPage = () => {


    const [isVisible, setIsVisible] = React.useState(true);
    const [feedback, setFeedback] = React.useState('');
    const [isLoading, setisLoading] = React.useState(false);
    const maxCharacters = 275;
    const [alertMessage, setAlertMessage] = React.useState('');
    const [isError, setIsError] = React.useState(false);

    const [alertOpen, setAlertOpen] = React.useState(false);

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const { user } = useSelector((state) => state.auth);

    const { uiColor1, uiColor2, darkmode } = useColor();

    const [isModalOpen, setModalOpen] = React.useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxCharacters) {
            setFeedback(value);
        }
    };


    const handleFeedbackUpload = () => {
        const username = user?.username
        const name = user?.name
        const avatar = user?.avatar?.url

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_FEEDBACK_TEMPLATE_ID;
        const userId = import.meta.env.VITE_EMAILJS_USER_ID;

        if (feedback.length > 0) {
            const templateParams = {
                name: name,
                username: username,
                avatar: avatar,
                feedback: feedback,
            };

            setisLoading(true);

            emailjs.send(serviceId, templateId, templateParams, userId)
                .then((response) => {
                    setIsVisible(false);
                    setIsError(false);
                    setAlertMessage('Feedback sent Successfully')
                }, (err) => {
                    setIsError(true);
                    console.log(err)
                    setAlertMessage('An Error occoured, Please try later')
                }).finally(() => {
                    setisLoading(false);
                    setAlertOpen(true)
                });
        }

    };

    return (
        <Paper sx={{ bgcolor: darkmode ? "black" : 'white', height: '100vh' }}>
            {isModalOpen && (
                <DeleteAccountModal OpenModal={openModal} CloseModal={closeModal} open={isModalOpen} />
            )}
            <Paper sx={{ bgcolor: darkmode ? "black" : 'white', }}>
                <Box className='unselectable' sx={{ flex: 1, width: '100%', }}>
                    <Box
                        sx={{

                            position: 'sticky',
                            top: { sm: -100, md: -110 },
                            bgcolor: 'transparent',

                        }}
                    >
                        <Box sx={{ px: { xs: 2, md: 6 } }}>
                            <Breadcrumbs size="sm" aria-label="breadcrumbs" separator={<ChevronRightRoundedIcon fontSize="sm" />}
                                sx={{ pl: 0 }}
                            >
                                <Link underline="none" href="/" >
                                    <HomeRoundedIcon sx={{ color: darkmode? 'white':'black' }} />
                                </Link>

                                <Typography color='secondary' sx={{ fontWeight: 500, fontSize: 12 }}>
                                    settings
                                </Typography>
                            </Breadcrumbs>
                            <Typography level="h3" component="h1" sx={{ color: darkmode ? "white" : 'black ', mt: 1, mb: 2 }}>
                                Change Settings
                            </Typography>
                        </Box>

                        <Tabs defaultValue={0} sx={{ bgcolor: 'transparent' }}>
                            <TabList
                                tabFlex={1}
                                size="sm"
                                sx={{
                                    pl: { xs: 0, md: 4 },
                                    justifyContent: 'left',
                                    [`&& .${tabClasses.root}`]: {
                                        fontWeight: '600',
                                        flex: 'initial',
                                        color: 'text.tertiary',
                                        [`&.${tabClasses.selected}`]: {
                                            bgcolor: 'transparent',
                                            color: darkmode? 'white' :'black',
                                            '&::after': {
                                                height: '2px',
                                                bgcolor: uiColor1,
                                            },
                                        },
                                        '&:hover': {
                                            bgcolor: 'gray',
                                        },
                                    },
                                }}
                            >
                                <Tab sx={{ borderRadius: '6px 6px 0 0', }} indicatorInset value={0}>
                                    Account
                                </Tab>

                                <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={1}>
                                    Data
                                </Tab>

                                <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={2}>
                                    Colors
                                </Tab>

                                <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={3}>
                                    Accessibility
                                </Tab>
                            </TabList>

                            <TabPanel value={0}>
                                <Card sx={{ bgcolor: darkmode ? "black" : 'white', border: 1 }}>
                                    <Typography sx={{ color: "red" }} level="title-lg">Delete Account</Typography>

                                    <Typography level="body-sm">
                                        This will permanently remove your data
                                    </Typography>
                                    <Button color='danger' onClick={openModal} sx={{ marginLeft: 'auto' }}>Delete Account</Button>
                                </Card>

                            </TabPanel>

                            <TabPanel value={1}>
                                <b>Second</b> tab panel
                            </TabPanel>

                            <TabPanel value={2}>
                                <Colors />
                                <UseSwitchesCustom/>
                            </TabPanel>

                            <TabPanel value={3}>
                                <Stack
                                    spacing={4} sx={{
                                        display: 'flex', maxWidth: '800px', mx: 'auto',
                                        px: { xs: 2, md: 6 }, py: { xs: 2, md: 3 },
                                    }}
                                >

                                    {isVisible ? (
                                        <Card sx={{ bgcolor: 'transparent', border: 0 }}>
                                            <Box sx={{ mb: 1, color: 'white' }}>
                                                <Typography level="title-md" sx={{ color: darkmode? 'white': 'black' }}>Feedback</Typography>
                                                <Typography level="body-sm">
                                                    Please provide your valuable feedback!
                                                </Typography>
                                            </Box>
                                            <Divider />
                                            <Stack spacing={2} sx={{ my: 1 }}>

                                                <CustomTextField value={feedback} onChange={handleChange} placeholder={'feedback..'}
                                                />

                                                <FormHelperText sx={{ mt: 0.75, fontSize: 'xs' }}>
                                                    {maxCharacters - feedback.length} characters left
                                                </FormHelperText>
                                            </Stack>
                                            <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                                                <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>

                                                    <Button
                                                        disabled={isLoading}
                                                        onClick={handleFeedbackUpload}
                                                        size="sm"
                                                        variant="solid"
                                                        sx={{
                                                            bgcolor: uiColor1,
                                                            '&:hover': { bgcolor: uiColor2 },
                                                            opacity: isLoading ? 0.5 : 1,
                                                            minWidth: 120,
                                                            minHeight: 36,
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            position: 'relative',
                                                        }}
                                                    >
                                                        {isLoading ? (
                                                            <CircularProgress
                                                                sx={{
                                                                    position: 'absolute',
                                                                    color: darkmode ? 'white' : 'black',
                                                                    scale: 0.5,
                                                                    transition: 'opacity 0.3s ease-in-out',
                                                                    opacity: 1,
                                                                }}
                                                            />
                                                        ) : (
                                                            "Send Feedback"
                                                        )}
                                                    </Button>

                                                </CardActions>
                                            </CardOverflow>
                                        </Card>
                                    ) : (
                                        <Card sx={{ bgcolor: 'transparent', border: 0 }}>
                                            <Box sx={{ mb: 1, color: 'white', textAlign: 'center' }}>
                                                <Typography
                                                    level="h4"
                                                    sx={{ color: 'white', fontWeight: 'bold' }}
                                                >
                                                    Thank you for your <span style={{ color: uiColor1 }}>feedback! ❤️</span>
                                                </Typography>
                                            </Box>
                                        </Card>
                                    )}

                                </Stack>
                            </TabPanel>

                        </Tabs>
                    </Box>

                </Box>
            </Paper >
            <AlertMessage
                value={alertMessage}
                open={alertOpen}
                onClose={handleCloseAlert}
                isError={isError}
            />
        </Paper>
    );
}

export default SettingPage;