// @ts-ignore
import axios from "lecture-service/src/lib/axios";

const instance = axios.create({
    baseURL: '/', // gateway가 같은 origin일 경우
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // (JWT 쿠키 사용할 경우 필요)
});

// ✅ 요청 인터셉터: JWT 토큰 자동 포함
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // @ts-ignore
        return Promise.reject(error);
    }
);


export default instance;
