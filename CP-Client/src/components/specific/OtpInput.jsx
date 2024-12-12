import * as React from 'react';
import PropTypes from 'prop-types';
import { Input as BaseInput } from '@mui/base/Input';
import { Box, styled } from '@mui/system';
import { useColor } from '../shared/ColorProvider ';

function OTP({ separator, length, value, onChange, onSubmit }) {
    const inputRefs = React.useRef(new Array(length).fill(null));
    const { uiColor1, uiColor2, darkmode } = useColor();

    const focusInput = (targetIndex) => {
        const targetInput = inputRefs.current[targetIndex];
        targetInput.focus();
    };

    const selectInput = (targetIndex) => {
        const targetInput = inputRefs.current[targetIndex];
        targetInput.select();
    };

    const handleKeyDown = (event, currentIndex) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case ' ':
                event.preventDefault();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (currentIndex < length - 1) {
                    focusInput(currentIndex + 1);
                    selectInput(currentIndex + 1);
                }
                break;
            case 'Delete':
                event.preventDefault();
                onChange((prevOtp) => {
                    const otp = prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
                    return otp;
                });
                break;
            case 'Backspace':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }
                onChange((prevOtp) => {
                    const otp = prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
                    return otp;
                });
                break;
            default:
                break;
        }
    };

    const handleChange = (event, currentIndex) => {
        let currentValue = event.target.value.toUpperCase();
        const isValid = /^[A-Z0-9]$/i.test(currentValue);
    
        if (!isValid) return; 
    
        let indexToEnter = 0;
    
        while (indexToEnter <= currentIndex) {
            if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
                indexToEnter += 1;
            } else {
                break;
            }
        }
    
        onChange((prev) => {
            const otpArray = prev.split('');
            const lastValue = currentValue[currentValue.length - 1];
            otpArray[indexToEnter] = lastValue; 
            return otpArray.join('');
        });
    
        if (currentValue !== '') {
            if (currentIndex < length - 1) {
                focusInput(currentIndex + 1); 
            } else {
                setTimeout(() => {
                    const finalOtp = inputRefs.current.map((input) => input.value).join('');
                    onSubmit(finalOtp); 
                }, 0); 
            }
        }
    };
    
        const handleClick = (event, currentIndex) => {
        selectInput(currentIndex);
    };

    const handlePaste = (event, currentIndex) => {
        event.preventDefault();
        const clipboardData = event.clipboardData;
    
        if (clipboardData.types.includes('text/plain')) {
            let pastedText = clipboardData.getData('text/plain').toUpperCase();
            pastedText = pastedText.replace(/[^A-Z0-9]/g, '');
            pastedText = pastedText.substring(0, length).trim();
            
            let indexToEnter = currentIndex;
            const otpArray = value.split('');
    
            for (let i = 0; i < pastedText.length && indexToEnter < length; i++, indexToEnter++) {
                otpArray[indexToEnter] = pastedText[i];
            }
    
            onChange(otpArray.join(''));
    
            // Automatically focus the next input after paste
            if (indexToEnter < length) {
                focusInput(indexToEnter); 
            } else {
                setTimeout(() => {
                    const finalOtp = inputRefs.current.map((input) => input.value).join('');
                    onSubmit(finalOtp);
                }, 0);
            }
        }
    };
    

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {new Array(length).fill(null).map((_, index) => (
                <React.Fragment key={index}>
                    <BaseInput
                        slots={{ input: InputElement }}
                        aria-label={`Digit ${index + 1} of OTP`}
                        slotProps={{
                            input: {
                                darkmode: darkmode,
                                uiColor1: uiColor1,
                                uiColor2: uiColor2,
                                ref: (ele) => {
                                    inputRefs.current[index] = ele;
                                },
                                onKeyDown: (event) => handleKeyDown(event, index),
                                onChange: (event) => handleChange(event, index),
                                onClick: (event) => handleClick(event, index),
                                onPaste: (event) => handlePaste(event, index),
                                value: value[index] ?? '',
                            },
                        }}
                    />
                    {index === length - 1 ? null : separator}
                </React.Fragment>
            ))}
        </Box>
    );
}

OTP.propTypes = {
    length: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired, // Ensure onSubmit is included in prop types
    separator: PropTypes.node,
    value: PropTypes.string.isRequired,
};

export default function OTPInput({ onOtpSubmit }) {
    const { uiColor1, uiColor2, darkmode } = useColor();

    const [otp, setOtp] = React.useState('');

    const handleSubmit = (updatedOtp) => {
        onOtpSubmit(updatedOtp); 
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <OTP separator={<span>-</span>} value={otp} onChange={setOtp} length={5} onSubmit={handleSubmit} />
        </Box>
    );
}

const InputElement = styled('input')(
    ({ darkmode, uiColor1, uiColor2 }) => `
    width: 40px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 0px;
    border-radius: 8px;
    text-align: center;
    color: ${darkmode ? 'white' : 'blaxk'};
    background: ${darkmode ? 'black' : 'white'};
    border: 1px solid ${darkmode ? 'black' : 'gray'};

    &:hover {
      border-color: ${uiColor2};
    }

    &:focus {
      border-color: 'black'
    }

    &:focus-visible {
      outline: 0;
    }
  `,
);
