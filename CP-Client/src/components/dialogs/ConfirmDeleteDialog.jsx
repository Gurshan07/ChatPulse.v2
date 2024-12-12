import React from 'react'
import {Button,Box, Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle} from '@mui/material'

const ConfirmDeleteDialog = ({open,handleClose,deleteHandler}) => {
  return (
   <Dialog open={open} onClose={handleClose} sx={{opacity:'0.97'}}  >

    <Box className='unselectable' border={'0.1px solid grey'} borderRadius={'4px'}  bgcolor={'#0f121a'} color={'white'}>

    <DialogTitle >Confirm Delete</DialogTitle>
    <DialogContent>
        <DialogContentText color={'grey'} > Are you sure you want to delete this group ?</DialogContentText>
    </DialogContent>

    <DialogActions>
        <Button color='inherit' onClick={handleClose}>Cancel</Button>
        <Button color='error' variant='contained' onClick={deleteHandler} >Confirm</Button>

    </DialogActions>

    </Box>
    

   </Dialog>
  )
}

export default ConfirmDeleteDialog
 