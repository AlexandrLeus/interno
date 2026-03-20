import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  Alert
} from "@mui/material";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      setSubmitting(true);
      await login(form);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrors({ submit: "Incorrect login or password" });
    } finally {
      setSubmitting(false);
    }
  };

  return (<Box sx={{
    maxWidth: 400,
    mx: 'auto',
    mt: 5,
    p: 3,
    borderRadius: 2,
    boxShadow: 3,
    backgroundColor: '#f5f5f5',
  }}
  >
    <Typography variant="h4" mb={3} align="center">
      Sign in
    </Typography>

    {errors.submit && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {errors.submit}
      </Alert>
    )}

    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
          disabled={submitting}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          required
          disabled={submitting}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.rememberMe}
              onChange={handleChange}
              name="rememberMe"
              disabled={submitting}
            />
          }
          label="Remember me"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#292F36",
            color: "#CDA274",
            "&:hover": {
              backgroundColor: "#1f242a",
            },
            py: 1.5,
          }}
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </Stack>
    </Box>
  </Box>);
};
export default Login;