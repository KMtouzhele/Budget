"use client";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Box } from '@mui/material';
export default function RegisterPage() {
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
            <RegisterForm />
        </Box>
    );
}