import React from "react";
import { Error as ErrorIcon } from "@mui/icons-material";
import { Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <Container maxWidth="lg" sx={{ height: "100vh" }}>
      <Stack
        alignItems={"center"}
        spacing={"2rem"}
        justifyContent={"center"}
        height="100%"
      >
        <ErrorIcon sx={{ fontSize: "10rem",color:'white' }} />
        <Typography variant="h1" color={'white'}>404</Typography>
        <Typography variant="h3" color={'white'} >Not Found</Typography>
        <Link  to="/">Go back to home</Link>
      </Stack>
    </Container>
  );
};

export default NotFound;