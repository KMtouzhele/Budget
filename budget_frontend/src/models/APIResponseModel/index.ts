export type APIResponseModel<T> = {
    status: number;
    title: string;
    message: T;
    error?: T;
};