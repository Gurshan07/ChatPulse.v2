import { Button } from '@mui/material';
import React from 'react';
import { useColor } from './ColorProvider ';
const CustomCancelButton = ({
    handleCancel,
    ...props
}) => {
    const { darkmode } = useColor();
// const handleCancel = () => {
//         setIsVisible(false);
//     };
    return (
        <Button
        onClick={handleCancel} 
        size="sm" 
        variant="solid" 
        color="neutral" 
        sx={{
            bgcolor: darkmode? "white"  :"black",
            border:'1px solid',
            borderColor: darkmode? "black" : "gray",

            '&:hover': { bgcolor: darkmode? "white"  :"gray",opacity:0.9
                         },
        }}
    >
        <p style={{ padding: 0, margin: 0, color: darkmode? "black" : "white"}}>Cancel</p>
    </Button>
    );
};

export default CustomCancelButton;
