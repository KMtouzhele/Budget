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