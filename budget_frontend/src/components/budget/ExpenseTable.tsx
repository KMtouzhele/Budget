"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Alert,
    TablePagination,
    Chip
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface Expense {
    id: number;
    createTime: string;
    category: string;
    name: string;
    amount: number;
    currency: string;
    description: string;
    userId: string;
}

export function ExpenseTable() {
    const router = useRouter();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    useEffect(() => {
        const fetchExpenses = async () => {
            console.log('Fetching expenses...');
            setLoading(true);
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    console.error('No authentication token found');
                    setError('Authentication token not found');
                    setLoading(false);
                    router.push("/account/login");
                    return;
                }
                console.log('Token:', token);
                console.log('Request URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/expense`);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/expense`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                setExpenses(response.data);
                setError(null);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        console.log('Unauthorized access. Redirecting to login page.');
                        localStorage.removeItem('token');
                        router.push('/account/login');
                        return;
                    }
                    else if (err.response?.status === 404) {
                        setError('No expenses found for this user.');
                    }
                    else {
                        setError(`Failed to load expenses: ${err.response?.data?.message || err.message}`);
                    }
                } else {
                    setError('An unexpected error occurred. Please try again later.');
                }
                setExpenses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [router]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const calculateTotal = () => {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    if (expenses.length === 0) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="info">No expenses found. Start tracking your spending!</Alert>
            </Box>
        );
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                Your Expenses
                <Chip
                    label={`Total: ${formatCurrency(calculateTotal(), 'USD')}`}
                    color="primary"
                    sx={{ ml: 2 }}
                />
            </Typography>

            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="expenses table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expenses
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((expense) => (
                                <TableRow hover key={expense.id}>
                                    <TableCell>{formatDate(expense.createTime)}</TableCell>
                                    <TableCell>{expense.category}</TableCell>
                                    <TableCell>{expense.name}</TableCell>
                                    <TableCell>{expense.description}</TableCell>
                                    <TableCell align="right">
                                        {formatCurrency(expense.amount, expense.currency)}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={expenses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}