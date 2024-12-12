import { useInputValidation } from '6pp';
import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";
import KeyIcon from '@mui/icons-material/Key';
import Face3SharpIcon from '@mui/icons-material/Face3Sharp';
const AdminLogin = () => {

  const { isAdmin } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (isAdmin) return <Navigate to="/admin/dashboard" />;


  return (
    <Container  component={'main'} maxWidth='xs' sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>

        <Paper  elevation={1} sx={{ color: 'white', bgcolor: 'rgb(138, 145, 165,0.05)',border :'solid 0.5px rgb(138, 145, 165,0.25)', borderRadius:'15px', padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               
        <>
  <Typography variant='h4' className='unselectable' marginBottom={'1rem'} fontWeight={'bold'} textAlign={'center'} >Admin</Typography>
  <KeyIcon style={{ transform: 'rotate(30deg)',scale:'1.3' ,marginTop:'2rem'}} />

  
  <form style={{  width: '100%', marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={submitHandler}>
    <TextField style={{ margin: '1rem auto' }} className='customTextField' id='customTextFieldText' required  label="Secret Key" type='password' margin='normal' variant='outlined' value={secretKey.value} onChange={secretKey.changeHandler} />
    <Button sx={{ marginTop: '1rem' }} variant='outlined' color='secondary' type='submit' >Login</Button>
  </form>
</>
                
        </Paper>
        <a href="/">
        <Face3SharpIcon  style={{borderRadius:'50% ',height:'2rem',width:'2rem',position: 'fixed',bottom: '2rem',right: '2rem',color:'grey'}}/>
        </a>
    </Container>
  )
}

export default AdminLogin
