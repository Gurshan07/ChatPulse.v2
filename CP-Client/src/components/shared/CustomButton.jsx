import { Button,  } from '@mui/material';
import React from 'react';
import { useColor } from './ColorProvider ';
const CustomButton = ({
    onClick,
    Darkmode,
    text,
    icon,
    ...props
}) => {
    const { uiColor1,uiColor2 } = useColor();

    return (
        <Button
        onClick={onClick} 
        size="sm"
        variant="solid"
        sx={{
            bgcolor: uiColor1, 
            color: "white",
            '&:hover': { bgcolor: uiColor2 }, 
            transition: 'background 0.3s ease',
        }}
       
        
    >
        {text} {icon}
    </Button>
    );
};

export default CustomButton;
