import { Dayjs } from "dayjs";
export type ExpenseModel = {
    id: number;
    name: string;
    category: string;
    amount: number;
    currency: string;
    description: string | null;
    createTime: string;
    date: Dayjs;
};