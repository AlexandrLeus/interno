import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

let refreshTokenPromise: Promise<string> | null = null;

apiClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const isLoginRequest = originalRequest.url?.includes('/api/auth/login');
    const isRefreshRequest = originalRequest.url?.includes('/api/auth/refresh');

    if (isRefreshRequest && status === 401) {
      localStorage.removeItem('access_token');
      window.dispatchEvent(new CustomEvent('unauthorized'));
      return Promise.reject(error);
    }

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (isLoginRequest) {
      return Promise.reject(error);
    }

    try {
      if (!refreshTokenPromise) {
        refreshTokenPromise = apiClient
          .post('/api/auth/refresh')
          .then((res) => {
            const newToken = res.data.accessToken;
            localStorage.setItem('access_token', newToken);
            return newToken;
          })
          .catch((err) => {
            localStorage.removeItem('access_token');
            window.dispatchEvent(new CustomEvent('unauthorized'));
            throw err;
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }
      const newToken = await refreshTokenPromise;
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);

    } catch (err) {
      return Promise.reject(err);
    }
  }
);
export default apiClient;