import axios from 'axios';

// Base URL của backend từ environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || (process.env.PUBLIC_API_URL ? `${process.env.PUBLIC_API_URL}api` : 'http://localhost:8888/api');

// Tạo axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Quan trọng cho CORS
    headers: {
        'Content-Type': 'application/json',
    },
});

// Biến để theo dõi trạng thái kết nối
let isConnected = false;

// Interceptor để thêm token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý response và kiểm tra kết nối
api.interceptors.response.use(
    (response) => {
        // Nếu chưa hiển thị thông báo kết nối thành công
        if (!isConnected) {
            isConnected = true;
            console.log('🟢 Đã kết nối thành công với Backend!', {
                baseURL: API_BASE_URL,
                status: response.status,
                timestamp: new Date().toLocaleString()
            });
        }
        return response;
    },
    (error) => {
        // Reset trạng thái kết nối nếu có lỗi
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
            isConnected = false;
            console.error('❌ Mất kết nối với Backend:', error.message);
        }
        return Promise.reject(error);
    }
);

// Hàm để kiểm tra kết nối thủ công
export const checkConnection = async () => {
    try {
        const response = await api.get('/health'); // Health check endpoint
        console.log('🎉 Kết nối Backend thành công!', response.data);
        return {
            connected: true,
            status: response.status,
            data: response.data,
            message: 'Kết nối thành công'
        };
    } catch (error) {
        console.error('❌ Lỗi kết nối Backend:', error);
        return {
            connected: false,
            error: error,
            message: 'Không thể kết nối với backend'
        };
    }
};

export default api;
