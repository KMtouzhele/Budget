import axios from "axios";

const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;

const APIClient = axios.create({
    baseURL: apiBaseURL,
    timeout: 10000,
    withCredentials: true,
});

APIClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

APIClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            switch (status) {
                case 401:
                    localStorage.removeItem("token");
                    window.location.href = "/auth/login";
                    break;
                case 403:
                    console.error("Access forbidden");
                    break;
                case 404:
                    console.error("Resource not found");
                    break;
                case 500:
                    console.error("Server error");
                    break;
            }

            if (typeof error.response.data === 'string') {
                error.response.data = { message: error.response.data };
            }
        } else {
            console.error("Network error");
        }
        return Promise.reject(error);
    }
);

export default APIClient;