import React, { useEffect, useState } from 'react';
import Box from '@mui/joy/Box';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import Done from '@mui/icons-material/Done';
import {  CardActions, Stack } from '@mui/material';
import { useColor } from './ColorProvider ';
import CustomButton from './CustomButton';
const Colors = () => {
    const colorAssociations = {
        violet: ['#4A148C', '#9C27B0'],
        rebeccapurple: ['#311B92', '#673AB7'],
        indigo: ['#1A237E', '#3F51B5'],
        blue: ['#0D47A1', '#2196F3'],
        cyan: ['#00838F', '#00BCD4'],
        teal: ['#004D40', '#009688'],
        yellow: ['#FBC02D', '#FFEB3B'],
        orange: ['#E65100', '#FF9800'],
        pink: ['#880E4F', '#E91E63'],
    };
    
    
    const [selectedColor, setSelectedColor] = useState('');
    const [tempColor1, setTempColor1] = useState(''); 
    const [tempColor2, setTempColor2] = useState(''); 
    const { uiColor1, uiColor2, darkmode,changeColors } = useColor(); 
    
   
    useEffect(() => {
        const findColorName = () => {
            for (const [colorName, [color1, color2]] of Object.entries(colorAssociations)) {
                if (uiColor1 === color1 && uiColor2 === color2) {
                    setSelectedColor(colorName);
                    setTempColor1(color1);
                    setTempColor2(color2);
                    break;
                }
            }
        };
    
        findColorName(); 
    }, [uiColor1, uiColor2]);
    
    const handleColorChange = (colorName) => {
        setSelectedColor(colorName);
        const [color1, color2] = colorAssociations[colorName];
        setTempColor1(color1); 
        setTempColor2(color2); 
    };
    
    const handleSave = () => {
        changeColors(tempColor1, tempColor2);
    };

    return (
        <Stack
            spacing={4}
            sx={{
                display: 'flex',
                maxWidth: '800px',
                mx: 'auto',
                px: { xs: 2, md: 6 },
                py: { xs: 2, md: 3 },
                borderRadius: '8px',
                transition: 'background 0.5s ease-in-out',
            }}
        >
            <Box sx={{ overflow: 'auto', px: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>

                <h2 style={{ color: darkmode?  'white': 'black' }}>Pick your Color</h2>
                <RadioGroup
                    aria-labelledby="product-color-attribute"
                    value={selectedColor}
                    sx={{ gap: 2, flexWrap: 'wrap', flexDirection: 'row' }}
                >
                    {Object.entries(colorAssociations).map(([colorName, [color1, color2]]) => (
                        <Sheet
                            key={colorName}
                            onClick={() => handleColorChange(colorName)}
                            sx={{
                                position: 'relative',
                                width: 40,
                                height: 40,
                                flexShrink: 0,
                                background: `repeating-linear-gradient(45deg, ${color1}, ${color1} 10px, ${color2} 10px, ${color2} 20px)`,
                                borderRadius: '50%',
                                display: 'flex',
                                pointerEvents: 'auto',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    opacity: 0.5,
                                },
                            }}
                        >
                            {selectedColor === colorName && (
                                <Done sx={{ color: 'white', position: 'absolute', fontSize: '24px' }} />
                            )}
                        </Sheet>
                    ))}
                </RadioGroup>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid', borderColor: 'divider' ,marginTop:'1rem'}}>
                <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                   
                    <CustomButton onClick={handleSave} color='white' text='Change'></CustomButton>
                    </CardActions>

                </Box>
            </Box>
        </Stack>
    );
};

export { Colors };
