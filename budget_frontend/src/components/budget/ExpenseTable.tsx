"use client";
import { useState, useEffect } from 'react';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { SelectChangeEvent } from '@mui/material/Select';
import { ExpenseModel } from '@/models/ExpenseModel';
import { getExpenses, deleteExpense, updateExpense, createExpense } from '@/api/expense';
import { Delete, Edit } from '@mui/icons-material';


export function ExpenseTable() {
    const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [newExpense, setNewExpense] = useState<ExpenseModel>({} as ExpenseModel);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(-1);

    const defaultExpense: ExpenseModel = {
        id: -1,
        name: '',
        category: 'Transport',
        amount: 0,
        currency: 'AUD',
        description: '',
        createTime: '',
        date: dayjs(),
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
        setEditMode(false);
        setNewExpense(defaultExpense);
        setOpenDialog(true);
    };

    const handleEditOnClick = (expenseModel: ExpenseModel) => {
        setEditMode(true);
        setSelectedId(expenseModel.id);
        setOpenDialog(true);
        setNewExpense({
            ...expenseModel,
            date: dayjs(expenseModel.date)
        });
    };

    const handleDeleteOnClick = (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedId(id);
        setOpenConfirm(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const deleted = await deleteExpense(id);
            if (deleted) {
                showSnackbar('Expense deleted successfully', 'success');
                fetchExpenses();
                setOpenConfirm(false);
                setSelectedId(-1);
            } else {
                setOpenConfirm(false);
                showSnackbar('Error deleting expense', 'error');
                setSelectedId(-1);
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            showSnackbar('Error deleting expense', 'error');
            setOpenConfirm(false);
            setSelectedId(-1);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditMode(false);
        setNewExpense(defaultExpense);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target as { name: string; value: string | number };
        setNewExpense(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formValid = () => {
        return newExpense.name.length > 0
            && newExpense.amount > 0;
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { target: { name, value } } = e;
        setNewExpense(prev => ({ ...prev, [name as string]: value }));
    };

    const handleSubmitExpense = async () => {
        if (!formValid()) {
            showSnackbar('Please fill all required fields', 'error');
            return;
        }
        try {
            if (editMode && selectedId !== -1) {
                const updated = await updateExpense(selectedId, newExpense);
                console.log('Updated:', updated.id);
                if (updated.id === -1) {
                    showSnackbar('Error updating expense', 'error');
                    setOpenDialog(false);
                    setEditMode(false);
                }
                showSnackbar('Expense updated successfully', 'success');
                fetchExpenses();
                setOpenDialog(false);
                setEditMode(false);
                setNewExpense(defaultExpense);

            } else {
                const created = await createExpense(newExpense);
                console.log('Created:', created);
                if (created.id === -1) {
                    showSnackbar('Error creating expense', 'error');
                }
                showSnackbar('Expense created successfully', 'success');
                fetchExpenses();
                setOpenDialog(false);
                setNewExpense(defaultExpense);
            }
        } catch (error) {
            console.error('Error creating expense:', error);
            showSnackbar('Error creating expense', 'error');
        }
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                <TableCell>Date</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Currency</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow
                                    key={expense.id}
                                    onClick={() => handleEditOnClick(expense)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                >
                                    <TableCell>
                                        {dayjs(expense.date).format('MMM D, YYYY')}
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={expense.category} />
                                    </TableCell>
                                    <TableCell>{expense.name}</TableCell>
                                    <TableCell>{expense.amount}</TableCell>
                                    <TableCell>
                                        <Chip label={expense.currency} />
                                    </TableCell>
                                    <TableCell>{expense.description}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEditOnClick(expense)}>
                                            <Edit color='primary' />
                                        </IconButton>
                                        <IconButton onClick={(event) => handleDeleteOnClick(expense.id, event)}>
                                            <Delete color='error' />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Dialog for adding/editing new expense */}
                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
                    <DialogTitle>
                        {editMode ? 'Edit Expense' : 'Add New Expense'}
                    </DialogTitle>
                    <DialogContent>
                        <DatePicker
                            label="Date"
                            value={newExpense.date}
                            onChange={(date) => setNewExpense(prev => ({ ...prev, date: date || dayjs() }))}
                            slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
                        />

                        <TextField
                            margin="dense"
                            name="name"
                            label="Name"
                            fullWidth
                            value={newExpense.name}
                            onChange={handleInputChange}
                            required
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
                                value={newExpense.category}
                                onChange={handleSelectChange}
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
                                onChange={handleSelectChange}
                            >
                                <MenuItem value="AUD">AUD</MenuItem>
                                <MenuItem value="USD">USD</MenuItem>
                                <MenuItem value="CNY">CNY</MenuItem>
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
                            required
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
                        <Button onClick={handleSubmitExpense} variant="contained" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog for confirming delete */}
                <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this expense?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
                        <Button onClick={() => handleDelete(selectedId)} variant="contained" color="error">
                            Delete
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
        </LocalizationProvider>
    );
}