"use client";
import Link from 'next/link';
import { Box, Container, Paper, Typography, Button, Stack } from '@mui/material';

export default function Home() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5'
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center' 
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center" mb={2}>
            Budget Tracker
          </Typography>
          
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
            Track your expenses and manage your budget efficiently
          </Typography>
          
          <Stack spacing={2} width="100%">
            <Link href="/auth/login" style={{ width: '100%', textDecoration: 'none' }}>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                size="large"
              >
                Login
              </Button>
            </Link>
            
            <Link href="/auth/register" style={{ width: '100%', textDecoration: 'none' }}>
              <Button 
                variant="outlined" 
                color="primary"
                fullWidth
                size="large"
              >
                Register
              </Button>
            </Link>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}