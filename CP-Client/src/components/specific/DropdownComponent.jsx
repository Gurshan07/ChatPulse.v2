import * as React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Face6Icon from '@mui/icons-material/Face6';
import { Box,  Typography } from '@mui/joy';
import { CircularProgress } from '@mui/material';
import { color, styled } from '@mui/system';
import { useColor } from '../shared/ColorProvider ';
import CheckIcon from '@mui/icons-material/Check';
import { useGetMyGenderQuery,useChangeGenderMutation } from '../../redux/api/api';

const DropdownComponent = () => {
  const { data: userGender, isLoading } = useGetMyGenderQuery();
  const [changeGender, { isLoading: isChanging, isSuccess }] = useChangeGenderMutation();
  const [gender, setGender] = React.useState('');
  React.useEffect(() => {
    if (!isLoading && userGender?.gender) { 
      setGender(userGender.gender); 
    }
  }, [isLoading, userGender]);

  const { uiColor1, uiColor2, darkmode } = useColor();

const StyledOption = styled(Option)(() => ({
 
  '&.MuiOption-root': {
    backgroundColor:darkmode?  "black" : 'white' 
  },
  '&.Mui-selected': {
    backgroundColor: 'gray',
  },
  
}));

const handleGenderChange = async (event, newValue) => {
  if(newValue != '0'){
    setGender(newValue); 
      await changeGender({ gender: newValue }); 
  }
 };

 return (
    <Select
        value={gender}
        onChange={handleGenderChange}  
        size="lg"
        startDecorator={
            <Face6Icon sx={{ marginLeft: '1.5rem', color: !darkmode ? "black" : 'white',marginRight: '0.3rem'}}/>
        }
            endDecorator={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
            {isChanging && <CircularProgress    sx={{color:uiColor1,scale:0.5}} />}
            {isSuccess && <CheckIcon sx={{ color: 'lime', marginLeft: '0.5rem' }} />}
          </Box>
        }
        slots={{
          indicator: 'span',   
        }}
        sx={{
          padding: 0,
          bgcolor: darkmode ? "black" : 'white',
          color:darkmode? 'white':'black',
          '&:hover': {
            backgroundColor: darkmode ? "black" : 'white',
            border: `1px solid ${uiColor1}`,
          },
        }}
      >
      <StyledOption  value="0" > 
        <Typography >Select Gender</Typography> 
      </StyledOption>
      <StyledOption value="1" >
        <Typography>Male</Typography>
      </StyledOption>
      <StyledOption value="2" >
        <Typography>Female</Typography>
      </StyledOption>
    </Select>
  );
};

export default DropdownComponent;