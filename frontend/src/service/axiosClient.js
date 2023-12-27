import { createAxiosClient } from "./createAxiosClient";

let BASE_URL = import.meta.env.VITE_BACKEND_URL;

function getToken() {
    const token = localStorage.getItem("token");
    return token;
}

async function logout(){
    localStorage.removeItem("token");
    window.location.reload();
}

export const client = createAxiosClient({
    options: {
        baseURL: BASE_URL,
        timeout: 300000,
        headers: {
            'Content-Type': 'application/json',
        }
    },
    getToken,
    logout
})