import axios from "axios";
import keycloak from '../auth/keycloak';

export const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const privateClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

privateClient.interceptors.request.use((config) => {
  if (keycloak?.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});
