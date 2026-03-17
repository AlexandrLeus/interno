import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { authApi } from '../api/authApi';
import type { LoginCredentials, RegisterCredentials, User } from '../types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: LoginCredentials) => Promise<void>;
  register: (data: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
    setLoading(false);
    return;
  }
  authApi.getMe()
    .then(response => setUser(response))
    .catch(() => {
      localStorage.removeItem('access_token');
      setUser(null);
    })
    .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/login', { replace: true });
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [navigate]);


  const login = async (data: LoginCredentials) => {
    const response = await authApi.login(data);
    localStorage.setItem('access_token', response.token);
    setUser(response.user);
  };
  const register = async (data: RegisterCredentials) => {
    const response = await authApi.register(data);
    localStorage.setItem('access_token', response.token);
    setUser(response.user);
  };
  const logout = async () => {
  try {
    setLoading(true);
    await authApi.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('access_token');
    setUser(null);
    navigate('/');
    setLoading(false);
  }
};
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};