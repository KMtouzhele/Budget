"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';

export function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Register");
    };

    const handleLogin = () => {
        router.push('/auth/login');
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                maxWidth: 400,
                width: '100%'
            }}
        >
            <Typography variant="h5" component="h1" fontWeight="bold" mb={3}>
                Welcome to Budget Tracker
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Comfirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                />

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 1 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>
                <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Already have an account? Login"}
                </Button>
            </Box>
        </Paper>
    );
}