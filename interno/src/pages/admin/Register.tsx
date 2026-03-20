import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { SelectChangeEvent } from '@mui/material/Select';
import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel, Typography, Alert } from '@mui/material';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 0,
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('')
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('')
        setIsLoading(true);
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }
        try {
            const { confirmPassword, ...registerData } = form;
            await register(registerData);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (<Box
        sx={{
            maxWidth: 400,
            mx: 'auto',
            mt: 5,
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: '#f5f5f5',
        }}
    >
        <form onSubmit={handleSubmit}>
            <Typography variant="h5" component="h2" gutterBottom>
                Admin Registration
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                fullWidth
                margin="normal"
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                disabled={isLoading}
                required
            />

            <TextField
                fullWidth
                margin="normal"
                type="email"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={isLoading}
                required
            />

            <TextField
                fullWidth
                margin="normal"
                type="password"
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
                required
            />

            <TextField
                fullWidth
                margin="normal"
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                required
            />

            {form.role !== undefined && (
                <FormControl fullWidth margin="normal" disabled={isLoading} required>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        label="Role"
                    >
                        <MenuItem value={0}>User</MenuItem>
                        <MenuItem value={1}>Admin</MenuItem>
                    </Select>
                </FormControl>
            )}

            <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                    backgroundColor: "#292F36",
                    color: "#CDA274",
                    "&:hover": {
                        backgroundColor: "#1f242a",
                    },
                    py: 1.5,
                }}
                disabled={isLoading}
            >
                {isLoading ? 'Creating account...' : 'Registration'}
            </Button>

            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </Typography>
        </form>
    </Box>);
};
export default Register;