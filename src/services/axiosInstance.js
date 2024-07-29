import axios from "axios";
import config from "./config";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
    baseURL: config.baseURL,

});
axiosInstance.interceptors.request.use(
    async (config) => {
        console.log('config', config);
        if (!config.url.includes(['/auth/login', '/products', 'categories', '/auth/register', '/auth/refresh-token'])) {
            const token = JSON.parse(localStorage.getItem('accessToken'));
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status === 401) {
            const token = JSON.parse(localStorage.getItem('refreshToken'));
            if (!token) {
                localStorage.clear();
                toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
                window.location.href = '/';
            } else {
                const respone = await axios.post(`${config.baseURL}/auth/refresh-token`, {
                    token,
                    isRefresh: true
                });
                console.log('respone refresh token', respone);
                if (respone.status === 200) {
                    const data = respone.data.data;
                    localStorage.setItem('accessToken', JSON.stringify(data.accessToken));
                    localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
                    error.config.headers.Authorization = `Bearer ${data.accessToken}`;
                    return axiosInstance(error.config);
                } else {
                    localStorage.clear();
                    toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
                    window.location.href = '/';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;