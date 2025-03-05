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

export function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/account/login`, {
                username,
                password,
            });
            if (response.status === 200) {
                console.log("Login successful", response.data);
                localStorage.setItem('token', response.data.message.token);
                router.push('/budget/overview');
            } else {
                setError("Login failed");
            }
        } catch (error) {
            setError("Login failed. Please check your credentials.");
            console.error("Login error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        router.push('/auth/register');
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
                Login
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
                    {loading ? <CircularProgress size={24} /> : "Login"}
                </Button>
                <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Register"}
                </Button>
            </Box>
        </Paper>
    );
}