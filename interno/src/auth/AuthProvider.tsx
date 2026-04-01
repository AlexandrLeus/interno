import React, { createContext, useEffect, useState, type ReactNode } from "react";
import keycloak from "./keycloak";
import type { User } from "../types";
import { authApi } from "../api/authApi";

interface AuthContextType {
  authenticated: boolean;
  token?: string;
  user?: User;
  login: () => void;
  logout: () => void;
  register: () => void;
  hasRole: (role: string) => boolean;
  initialized: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    keycloak
      .init({
        onLoad: "check-sso",
        checkLoginIframe: false,
        pkceMethod: "S256",
      })
      .then((auth) => {
        setAuthenticated(auth);
        setInitialized(true);
        if (auth) {
          fetchMe();
        }
      })
      .catch((err) => {
        console.error("Authentication Failed", err);
        setInitialized(true);
      });
  }, []);

  const fetchMe = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch /me", err);
      setUser(undefined);
    }
  };
  const login = () => keycloak.login();
  const logout = () => keycloak.logout();
  const register = () => keycloak.register()
  const hasRole = (role: string) =>
    !!keycloak.tokenParsed?.realm_access?.roles?.includes(role);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        token: keycloak.token,
        user,
        login,
        logout,
        register,
        hasRole,
        initialized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};