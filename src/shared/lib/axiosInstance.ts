import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { getCookie, setCookie, deleteCookie } from './cookieUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
    let token = getCookie('access_token');
    const refreshToken = getCookie('refresh_token');

    if (!token && refreshToken) {
        token = await refreshAccessToken();
    }

    if (token) {
        config.headers = (config.headers ?? {}) as AxiosRequestHeaders;
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const refreshClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

let isRefreshing = false;
let pendingQueue: ((token: string) => void)[] = [];
let pendingRejects: ((err: any) => void)[] = [];

const processQueue = (token: string | null, error: any) => {
    if (token) pendingQueue.forEach((res) => res(token));
    else pendingRejects.forEach((rej) => rej(error));
    pendingQueue = [];
    pendingRejects = [];
};

const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = getCookie('refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');

    const { data } = await refreshClient.post('/api/ara/auth/refresh', 
        { refreshToken },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`,
            },
        }
    );

    const token: string = data.access_token || data.accessToken;
    if (!token) throw new Error('No access_token in refresh response');

    setCookie('access_token', token);
    if (data.refresh_token || data.refreshToken) {
        setCookie('refresh_token', data.refresh_token || data.refreshToken);
    }
    return token;
};

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const original = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (original.url?.includes('/user/me')) {
            deleteCookie('access_token');
            deleteCookie('refresh_token');
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingQueue.push((token: string) => {
                        original.headers = original.headers ?? {};
                        (original.headers as any).Authorization = `Bearer ${token}`;
                        resolve(axiosInstance(original));
                    });
                    pendingRejects.push(reject);
                });
            }

            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();
                processQueue(newToken, null);
                isRefreshing = false;

                original.headers = original.headers ?? {};
                (original.headers as any).Authorization = `Bearer ${newToken}`;
                return axiosInstance(original);
            } catch (e) {
                processQueue(null, e);
                isRefreshing = false;
                deleteCookie('access_token');
                deleteCookie('refresh_token');
                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;