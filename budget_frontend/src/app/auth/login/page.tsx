"use client";
import { LoginForm } from "@/components/auth/LoginForm";
import { Box } from '@mui/material';

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5'
      }}
    >
      <LoginForm />
    </Box>
  );
}