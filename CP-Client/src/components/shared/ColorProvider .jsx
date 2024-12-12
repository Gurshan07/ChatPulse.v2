import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePutColorMutation, useGetColorQuery } from '../../redux/api/api'; 

const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
    const [putColorMutation, { isLoading: isUpdating }] = usePutColorMutation();
    const { data: userColors, isLoading } = useGetColorQuery(); 
    
    // Initialize colors state with uiColor1 and uiColor2
    const [colors, setColors] = useState({ 
        uiColor1: userColors?.colors?.uiColor1,
        uiColor2: userColors?.colors?.uiColor2 
    });

    useEffect(() => {
        if (!isLoading && userColors && userColors.colors) {
            const { uiColor1, uiColor2, darkmode } = userColors.colors;
            if (uiColor1 && uiColor2  || darkmode) {
                setColors({ uiColor1, uiColor2,darkmode });
            }
        }
    }, [userColors, isLoading]);
    
    const changeColors = async (color1, color2, darkmode) => {
        setColors({ uiColor1: color1, uiColor2: color2 ,darkmode:darkmode});

        const updatedColors = { uiColor1: color1, uiColor2: color2, darkmode: darkmode };

        await putColorMutation(updatedColors);
    };
    return (
        <ColorContext.Provider value={{ ...colors, changeColors }}>
            {children}
        </ColorContext.Provider>
    );
};

export const useColor = () => {
    return useContext(ColorContext);
};
