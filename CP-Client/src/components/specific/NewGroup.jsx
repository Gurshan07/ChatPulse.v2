import React, { useState } from 'react'
import { Avatar, Button, Dialog, Skeleton, DialogTitle, ListItem, Stack, TextField, Typography, Box } from '@mui/material';

import UserItem from '../shared/UserItem';
import { useInputValidation } from '6pp';
import { useDispatch, useSelector } from "react-redux";
import {
    useAvailableFriendsQuery,
    useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const NewGroup = () => {

    const { isNewGroup } = useSelector((state) => state.misc);
    const dispatch = useDispatch();

    const { isError, isLoading, error, data } = useAvailableFriendsQuery();
    const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

    const groupName = useInputValidation("");

    const [selectedMembers, setSelectedMembers] = useState([]);

    const errors = [
        {
            isError,
            error,
        },
    ];

    useErrors(errors);

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id)
                ? prev.filter((currElement) => currElement !== id)
                : [...prev, id]
        );
    };

    const submitHandler = () => {
        if (!groupName.value) return toast.error("Group name is required");

        if (selectedMembers.length < 2)
            return toast.error("Please Select Atleast 3 Members");

        newGroup("Creating New Group...", {
            name: groupName.value,
            members: selectedMembers,
        });

        closeHandler();
    };

    const closeHandler = () => {
        dispatch(setIsNewGroup(false));
    };

    return (
        <Dialog  PaperProps={{ sx: { bgcolor: '#0f121a', border :'solid 0.5px rgb(138, 145, 165,0.25)', borderRadius:'15px' } }}  sx={{opacity:'inherit',bgcolor: 'rgb(138, 145, 165,0.01)',}} onClose={closeHandler} open={isNewGroup} >

            
            <Stack p={{ xs: '1rem', sm: '3rem' }} maxWidth={'25rem'} spacing={'1.5rem'}  className='unselectable' color={'white'}  >
                <DialogTitle sx={{ textAlign: 'center' }} fontWeight={'bold'}>
                    New Group
                </DialogTitle>

                <TextField className='customTextField' id='customTextFieldText' label='Group Name' autoComplete='off' value={groupName.value} onChange={groupName.changeHandler} />

                <Typography variant='body1' >Members</Typography>

                <Stack>{isLoading ? (<Skeleton />
                ) : (data?.friends?.map((i) => (
                    <UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />))
                )}
                </Stack>

                <Stack direction={'row'} justifyContent={'space-evenly'}>
                    <Button size='small' variant='text' color='error' onClick={closeHandler} >Cancel</Button>
                    <Button size='medium' variant='outlined' sx={{ fontWeight: 'bold' }} onClick={submitHandler} disabled={isLoadingNewGroup} >Create</Button>
                </Stack>

            </Stack>
        </Dialog>
    )


}

export default NewGroup
