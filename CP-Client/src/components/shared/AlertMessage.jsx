import * as React from 'react';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const AlertMessage=({ open, onClose, value ,isError})=> {
  return (
    <React.Fragment>
      <Snackbar
        variant="soft"
        color= {isError? "danger" :"success"}
        open={open}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        startDecorator={isError? <CancelIcon/> : <CheckCircleIcon />}
        endDecorator={
          <Button
            onClick={onClose}
            size="sm"
            variant="soft"
            color= {isError? "danger" :"success"}
          >
            Dismiss
          </Button>
        }
      >
        <b>{value}</b>
      </Snackbar>
    </React.Fragment>
  );
}

export default AlertMessage;
