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
    Chip,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    DialogContent,
    DialogActions,
    Dialog,
    DialogTitle
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
    const [openDialog, setOpenDialog] = useState(false);
    const [newExpense, setNewExpense] = useState({
        name: '',
        category: 'Food', // 默认类别
        amount: 0,
        currency: 'AUD',
        description: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/expense/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('API response:', response.data);
                if (response.status === 401) {
                    console.error(`${response.data.title}, ${response.data.message}`);
                    router.push('/auth/login');
                    return;
                }
                if (response.data && response.data.message && response.data.message.expenses) {
                    setExpenses(response.data.message.expenses);
                } else {
                    console.error('Unexpected response structure:', response.data);
                    setExpenses([]);
                }
            } catch (error) {
                console.error('Error fetching expenses', error);
            }
        };

        fetchExpenses();
    }, []);

    const handleNewExpense = () => {
        console.log('New Expense');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewExpense({
            name: '',
            category: 'Food',
            amount: 0,
            currency: 'AUD',
            description: ''
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target as { name: string; value: string | number };
        setNewExpense(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitNewExpense = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/expense`,
                newExpense,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data && response.data.message && response.data.message.expense) {
                setExpenses([response.data.message.expense, ...expenses]);
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error creating expense:', error);
        }
    };


    return (
        <Box>
            <Typography variant="h4" component="h1" mb={3}>
                Expenses
            </Typography>
            <Button variant='contained' onClick={handleNewExpense}>
                New Expense
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Currency</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Created</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell>
                                    <Chip label={expense.category} />
                                </TableCell>
                                <TableCell>{expense.name}</TableCell>
                                <TableCell>{expense.amount}</TableCell>
                                <TableCell>
                                    <Chip label={expense.currency} />
                                </TableCell>
                                <TableCell>{expense.description}</TableCell>
                                <TableCell>{expense.createTime}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        fullWidth
                        value={newExpense.name}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={newExpense.category}
                        >
                            <MenuItem value="Food">Food</MenuItem>
                            <MenuItem value="Transport">Transport</MenuItem>
                            <MenuItem value="Bills">Bills</MenuItem>
                            <MenuItem value="Entertainment">Entertainment</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        name="amount"
                        label="Amount"
                        type="number"
                        fullWidth
                        value={newExpense.amount}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={newExpense.description}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmitNewExpense} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}