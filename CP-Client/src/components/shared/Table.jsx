import { Container, Typography,Paper } from '@mui/material'
import React from 'react'
import {DataGrid}from '@mui/x-data-grid'

const Table = ({rows,columns,heading,rowHeight=50}) => {
  return (
    <Container sx={{height:'100vh',bgcolor:'#0f121a'}} >
        
        <Paper elevation={3} sx={{padding:'1rem 0rem',borderRadius:'1rem',margin:'auto',width:'100%',overflow:'hidden',height:'100%',bgcolor:'#0f121a',boxShadow:'none',color:'white',fontWeight:'bold'}} >
            <Typography textAlign={'center'} variant='h4' sx={{margin:'2rem',textTransform:'uppercase'}} >{heading}</Typography>
            <DataGrid sx={{color:'white',border:'none','.table-header':{bgcolor:'#0f121a',color:'white'},
          '& .MuiDataGrid-scrollbar': {
            '&::-webkit-scrollbar': {
              width: '5px',
              height: '8px',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'white',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: 'white',
              },
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#0f121a',
              borderRadius: '10px',
            },
                        
          },
          }} rows={rows} columns={columns} rowHeight={rowHeight} style={{height:'80%'}} />
        </Paper>

    </Container>
  )
}

export default Table
