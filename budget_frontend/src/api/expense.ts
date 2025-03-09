import APIClient from "./APIClient";
import { ExpenseModel } from "../models/ExpenseModel"; // Assuming you have an Expense model

export const getExpenses = async ()
    : Promise<ExpenseModel[]> => {
    try {
        const response = await APIClient.get("/api/expense");
        if (response.data && response.data.message && response.data.message.expenses) {
            const expenses = response.data.message.expenses as ExpenseModel[];
            console.log("Expenses array:", expenses);
            return expenses;
        }
        console.error("Unexpected API response format:", response.data);
        return [];
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return [];
    }
};

export const deleteExpense = async (id: number) => {
    try {
        const response = await APIClient.delete(`/api/expense/${id}`);
        if (response.data && response.data.message) {
            console.log("Expense deleted:", response.data.message);
            return true;
        }
        console.error("Unexpected API response format:", response.data);
        return false;
    } catch (error) {
        console.error("Error deleting expense:", error);
        return false;
    }
};

export const updateExpense = async (id: number, expense: ExpenseModel)
    : Promise<ExpenseModel> => {
    try {
        const response = await APIClient.put(`/api/expense/${id}`, expense);
        if (response.data && response.data.message) {
            expense.id = response.data.message.id;
            expense.name = response.data.message.name;
            expense.amount = response.data.message.amount;
            expense.category = response.data.message.category;
            expense.currency = response.data.message.currency;
            expense.description = response.data.message.description;
            return expense;
        }
        console.error("Unexpected API response format:", response.data);
        expense.id = -1;
        return expense;
    } catch (error) {
        console.error("Error updating expense:", error);
        expense.id = -1;
        return expense;
    }
};

export const createExpense = async (expense: ExpenseModel)
    : Promise<ExpenseModel> => {
    try {
        const response = await APIClient.post("/api/expense", expense);
        if (response.data && response.data.message) {
            expense.id = response.data.message.id;
            expense.name = response.data.message.name;
            expense.amount = response.data.message.amount;
            expense.category = response.data.message.category;
            expense.currency = response.data.message.currency;
            expense.description = response.data.message.description;
            return expense;
        }
        expense.id = -1;
        return expense;
    } catch (error) {
        console.error("Error creating expense:", error);
        expense.id = -1;
        return expense;
    }
};