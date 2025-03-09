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
    DialogTitle,
    Snackbar,
    Alert,
    IconButton,
} from '@mui/material';
import { ExpenseModel } from '@/models/ExpenseModel';
import { getExpenses } from '@/api/expense';
import { Delete, Edit } from '@mui/icons-material';


export function ExpenseTable() {
    const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [newExpense, setNewExpense] = useState<ExpenseModel>({} as ExpenseModel);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const defaultExpense: ExpenseModel = {
        id: 0,
        name: '',
        category: 'Transport',
        amount: 0,
        currency: 'AUD',
        description: '',
        createTime: ''
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const expenses = await getExpenses();
            setExpenses(expenses);
        } catch (error) {
            console.error('Error fetching expenses', error);
        } finally {
            setLoading(false);
            console.log('======= Expenses:', expenses);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleNewOnClick = () => {
        console.log('New Expense');
        setNewExpense(defaultExpense);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewExpense({} as ExpenseModel);
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
                fetchExpenses();
                showSnackbar('Expense created successfully', 'success');
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error creating expense:', error);
            showSnackbar('Error creating expense', 'error');
        }
    };


    return (
        <Box>
            <Typography variant="h4" component="h1" mb={3}>
                Expenses
            </Typography>
            <Button variant='contained' onClick={handleNewOnClick}>
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
                            <TableCell>Actions</TableCell>
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
                                <TableCell>
                                    <IconButton>
                                        <Edit color='primary' />
                                    </IconButton>
                                    <IconButton>
                                        <Delete color='error' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for adding new expense */}
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
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Currency</InputLabel>
                        <Select
                            name="currency"
                            value={newExpense.currency}
                        >
                            <MenuItem value="AUD">AUD</MenuItem>
                            <MenuItem value="USD">USD</MenuItem>
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

            {/* Snackbar for prompting err and result */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Loading */}
            {<Snackbar
                open={loading}
            >
                <Alert>
                    Loading...
                </Alert>
            </Snackbar>}

        </Box>
    );
}