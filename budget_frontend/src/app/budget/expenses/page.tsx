"use client";
import { ExpenseTable } from '@/components/budget/ExpenseTable';
import {
    Box,
} from '@mui/material';

export default function ExpensesPage() {
    return (
        <Box>
            <ExpenseTable />
        </Box>
    );
}