import { IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useColor } from './ColorProvider ';

const CustomTextField = ({
    value,
    onChange,
    rows = 4,
    placeholder,
    icon,
    
    ...props
}) => {
    let { uiColor1 ,darkmode} = useColor();
    
    return (
        <TextField
    value={value}
    onChange={onChange}
    multiline
    minRows={rows}
    variant="outlined"
    placeholder={placeholder}
    
    sx={{
        mt: 1.5,
        '& .MuiInputBase-input': { color: darkmode? "white" : "black"}, 
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'gray' },
            '&:hover fieldset': { borderColor: 'gray' },
            '&.Mui-focused fieldset': {
                borderColor: uiColor1, 
                borderWidth: '1px',
            },
        },
        '& .MuiInputBase-input::placeholder': {
            color: "gray" , 
            opacity: 1, 
        },
    }}
    InputProps={{
        startAdornment: (
            <InputAdornment position="start">
                <IconButton>
                    {icon}
                </IconButton>
            </InputAdornment>
        ),
    }}
    {...props}
/>

    );
};

export default CustomTextField;
