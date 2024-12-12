/* eslint-disable react/display-name */
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { useState, memo, useEffect, lazy, Suspense } from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Edit as EditIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Link } from '../components/styles/StyledComponents';
import AvatarCard from '../components/shared/AvatarCard';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UserItem from '../components/shared/UserItem';
import { LayoutLoader } from "../components/layout/Loaders";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";

import { setIsAddMember } from "../redux/reducers/misc";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment'
import { setIsNewGroup } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);
const NewGroupDialog = lazy(() => import('../components/specific/NewGroup'))

// const isAddMember = false;
const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const [members, setMembers] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  // useEffect(() => {
  //   if (chatId) {
  //     setGroupName(`Group Name ${chatId}`);
  //     setGroupNameUpdatedValue(`Group Name is ${chatId}`);
  //   }

  //   return () => {
  //     setGroupName("");
  //     setGroupNameUpdatedValue("");
  //     setIsEdit(false);
  //   };
  // }, [chatId]);

  const IconBtns =
    (
      <>
        <Box sx={{ display: { xs: 'block', sm: 'none', position: 'fixed', top: '2rem', right: '1rem', } }}>

          <IconButton size='large' varient="contained" onClick={handleMobile} sx={{ color: 'grey', '&:hover': { backgroundColor: '#2e2e2e', '& svg': { color: 'white', filter: 'brightness(100%)', }, }, }}>
            <MenuIcon />
          </IconButton>

        </Box>


        <Tooltip  >
          <IconButton onClick={navigateBack} sx={{ position: 'absolute', top: '2rem', left: '2rem', color: 'grey', '&:hover': { backgroundColor: '#2e2e2e', '& svg': { color: 'white', filter: 'brightness(100%)', }, }, }} >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Tooltip>
      </>
    )

  const GroupName = (
    <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={'1rem'} padding={'3rem'} >
      {isEdit ?
        (
          <>
            <TextField className='customTextField' id='customTextFieldText' value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)} />
            <IconButton sx={{ color: 'grey', '&:hover': { backgroundColor: '#2e2e2e', '& svg': { color: 'white', filter: 'brightness(100%)', }, }, }} onClick={updateGroupName} disabled={isLoadingGroupName}><CheckIcon /></IconButton>
          </>
        ) : (
          <>
            <Typography className='unselectable' color={'white'} fontWeight={'bold'} variant='h4'>{groupName}</Typography>
            <IconButton sx={{ color: 'grey', '&:hover': { backgroundColor: '#2e2e2e', '& svg': { color: 'white', filter: 'brightness(100%)', }, }, }} onClick={() => setIsEdit(true)} disabled={isLoadingGroupName} ><EditIcon /></IconButton>

          </>
        )}
    </Stack>

  )

  const ButtonGroup = (
    <Stack direction={{ sm: 'row', xs: 'column-reverse' }}
      spacing={'1rem'} p={{ xs: '0', sm: '1rem', md: '1rem 4rem' }}
    >
      <Button size='large' color='warning' sx={{ fontWeight: 'bold', }} startIcon={<DeleteOutlineIcon />} onClick={openConfirmDeleteHandler} >Delete Group</Button>
      <Button size='large' color='success' variant="outlined" startIcon={<PersonAddIcon />} onClick={openAddMemberHandler}>Add Member</Button>
    </Stack>
  )

  const AllMembers = (
    members.map((i) => (

      <UserItem user={i} key={i._id} isAdded styling={{ boxShadow: "0 0 0.5rem  rgba(0,0,0,0.2)", padding: "1rem 2rem", borderRadius: "1rem", }} handler={removeMemberHandler} />
    ))
  )

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid container height={'100vh'} >

      <Grid item sx={{ display: { xs: 'none', sm: 'block' }, border: 'solid 0.5px rgb(138, 145, 165,0.25)' }} sm={4} >

        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />

      </Grid>

      <Grid item xs={12} sm={8} sx={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding: '1rem 3rem' }} >
        {IconBtns}
        {groupName ? (
          <>
            {GroupName}
            <Stack sx={{ bgcolor: 'rgb(138, 145, 165,0.05)', border: 'solid 0.5px rgb(138, 145, 165,0.25)', borderRadius: '15px' }} maxWidth={'45rem'} width={'100%'} className='unselectable' color={'grey'} boxSizing={'border-box'} padding={{ sm: '1rem', xs: '0', md: '1rem 2rem' }} borderRadius={'10px'} border={'0.1px solid grey'} height={'50vh'} overflow={'auto'}>

              {isLoadingRemoveMember ? (
                <CircularProgress />
              ) : (
                <>
                  <Typography sx={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} className='unselectable' fontWeight={'bold'} color={'white'} margin={'2rem'} alignSelf={'center'} variant='h5' >Members</Typography>

                  {AllMembers}
                </>


              )}

            </Stack>
            {ButtonGroup}
          </>
        ) : (
          <Typography variant="h4" color="white" textAlign="center" margin="2rem"> No group selected</Typography>
        )}
      </Grid>

      {isAddMember && <Suspense fallback={<Backdrop open />}><AddMemberDialog chatId={chatId} /></Suspense>}

      {confirmDeleteDialog && <Suspense fallback={<Backdrop open />}><ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler} /></Suspense>}

      <Drawer PaperProps={{ sx: { bgcolor: '#0f121a' } }} open={isMobileMenuOpen} onClose={handleMobileClose} sx={{ display: { xs: 'inline', sm: 'none' }, }}>

        <GroupsList w={'50vw'} myGroups={myGroups?.data?.groups} chatId={chatId} />

      </Drawer>

    </Grid>
  )
}
const GroupsList = ({ w = '100%', myGroups = [], chatId }) => {
  const [filteredGroups, setFilteredGroups] = useState(myGroups);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredGroups(myGroups);
  }, [myGroups]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter groups based on the search term
    const filtered = myGroups.filter(group =>
      group.name.toLowerCase().includes(term)
    );

    setFilteredGroups(filtered);
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(true);
  };
  const dispatch = useDispatch();
  const {  isNewGroup } = useSelector(
    (state) => state.misc
  );
  const openNewGroup = () => {
    console.log('btn clicked')
    dispatch(setIsNewGroup(true));
  };
  return (
    <Stack width={w} height={'95vh'} sx={{
      overflow: 'auto', paddingRight: { xs: '0.5rem', sm: '0.5rem' }, bgcolor: 'black',
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
        backgroundColor: 'rgb(138, 145, 165,0.05)',
        borderRadius: '10px',
      },
    }}>



      <div style={{ display: 'flex', alignItems: 'center', width: '98%', marginTop: '1.5rem', marginLeft: '0.5rem', height: "10%" }}>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: isExpanded ? '250px' : '50px', transition: 'width 0.3s ease-out',
          overflow: 'hidden', borderRadius: '50px'
        }}>

          {!isExpanded ? (
            <IconButton sx={{ border: '2px solid grey', borderInlineColor: 'purple', borderBlockColor: 'rebeccapurple' }} onClick={handleExpandClick}>
              <SearchIcon sx={{ color: 'white', scale: 1.4, }} />
            </IconButton>
          )
            :
            (
              <TextField variant="outlined" placeholder="Search groups..." value={searchTerm} onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white', scale: 1.3 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  alignItems: 'center',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderRadius: '220px',
                      borderColor: 'white', // Change border color
                    },
                    '&:hover fieldset': {
                      borderColor: 'purple ', // Change border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rebeccapurple ', // Change border color when focused
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white', // Change text color
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'white', // Change placeholder text color
                  },
                }} />
            )}

        </div>

        <div style={{ display: 'flex', justifyContent: 'end', flexGrow: 1, marginRight: '1rem',marginLeft:'0.75rem' }}>
          <Button variant="outlined" color="secondary" onClick={openNewGroup}>
            New group
          </Button>
        </div>
      </div>

      {filteredGroups.length > 0 ? (
        filteredGroups.map((group) => (
          <GroupsListItem group={group} chatId={chatId} key={group._id} />
        ))
      ) : (
        <Typography textAlign={'center'} padding="1rem" color={'white'} fontWeight={'bold'}>
          No Groups to edit
        </Typography>
      )}
    {isNewGroup && <Suspense fallback={<Backdrop open />}><NewGroupDialog /></Suspense>}

    </Stack>
    
  );
  
};

const GroupsListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id, } = group;
  return (
    <Box  >
      <Link sx={{ borderRadius: '15px', display: 'block', justifyContent: 'end', marginTop: '1rem', marginLeft: '0.5rem', '&:hover': { bgcolor: 'rgb(138, 145, 165,0.05)', border: 'solid 0.5px rgb(138, 145, 165,0.25)', '& svg': { bgcolor: 'blue', color: 'red', }, }, }} to={`?group=${_id}`} onClick={e => { if (chatId === _id) e.preventDefault() }}>

        <Stack direction={'row'} spacing={'1.5rem'} alignItems={'center'} position={'relative'}   >
          <AvatarCard avatar={avatar} />
          <Typography color={'white'} >{name}</Typography>

        </Stack>



      </Link>
    </Box>
  )
})

export default Groups
