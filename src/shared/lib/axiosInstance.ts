import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { getCookie, setCookie, deleteCookie } from './cookieUtils';
import { getApiBaseUrl } from './envCheck';

const API_BASE_URL = getApiBaseUrl();

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    timeout: 30000, // 30초 타임아웃
});

axiosInstance.interceptors.request.use(async (config) => {
    // 공개 API 목록 (인증 토큰 없이 요청 가능)
    const publicAraApis = [
        '/ara/auth',
        '/ara/teamspace',
        '/ara/notice'
    ];
    
    const isPublicAraApi = publicAraApis.some(api => config.url?.startsWith(api));
    
    if (isPublicAraApi) {
        return config;
    }

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
    (res) => {
        // HTML 응답 감지
        if (typeof res.data === 'string' && res.data.trim().startsWith('<')) {
            console.error('서버가 HTML을 반환했습니다:', res.config.url);
            const error = new Error('서버가 HTML을 반환했습니다. API 엔드포인트를 확인하세요.');
            (error as any).isHTMLResponse = true;
            throw error;
        }
        return res;
    },
    async (error: AxiosError) => {
        const original = error.config as AxiosRequestConfig & { _retry?: boolean };

        // 네트워크 에러 처리
        if (!error.response) {
            console.error('네트워크 에러:', error.message);
            if (typeof window !== 'undefined') {
                // 사용자에게 알림 (선택적)
                console.warn('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
            }
            return Promise.reject(error);
        }

        // 공개 API는 401 에러 처리 스킵
        const publicAraApis = [
            '/ara/auth',
            '/ara/teamspace',
            '/ara/notice'
        ];
        const isPublicAraApi = publicAraApis.some(api => original?.url?.startsWith(api));
        if (isPublicAraApi && error.response?.status === 401) {
            return Promise.reject(error);
        }

        // /user/me는 401, 403 에러 시 쿠키 삭제하지 않고 그냥 에러 반환
        if (original?.url?.includes('/user/me')) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                return Promise.reject(error);
            }
        }

        if (error.response?.status === 401 && original && !original._retry) {
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
                
                // 로그인 페이지로 리다이렉트 (선택적)
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    console.warn('인증이 만료되었습니다.');
                }
                
                return Promise.reject(e);
            }
        }

        // 500번대 서버 에러 로깅
        if (error.response?.status >= 500) {
            console.error('서버 에러:', {
                status: error.response.status,
                url: original?.url,
                data: error.response.data
            });
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;