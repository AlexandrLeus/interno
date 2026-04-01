import { type ReactNode, useEffect } from "react";
import { useAuth } from "../../auth/useAuth";
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { initialized, authenticated, login, hasRole } = useAuth();

  useEffect(() => {
    if (initialized && !authenticated) {
      login();
    }
  }, [initialized, authenticated, login]);

  if (!initialized) return <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 1000
      }}
    >
      <CircularProgress size={60} />
    </Box>;

  if (!authenticated) return null;

  if (requiredRole && !hasRole(requiredRole)) return <div>Access denied</div>;

  return <>{children}</>;
};