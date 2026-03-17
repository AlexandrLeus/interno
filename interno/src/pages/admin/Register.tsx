import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../public/Auth.module.scss'
import Button from '../../components/ui/Button';

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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    return (<div className={styles.authContainer}>
        <form onSubmit={handleSubmit}>
            <h2>Admin Registration</h2>
            {error && <div className="error-message">{error}</div>}
            <input
                type="username"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                disabled={isLoading}
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={isLoading}
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={isLoading}
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
            />
            {form.role  !== undefined && (
                
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                    >
                        <option value={0}>Role: User</option>
                        <option value={1}>Role: Admin</option>
                    </select>
               
            )}
            <div>
                <Button disabled={isLoading} text={isLoading ? 'Creating account...' : 'Registration'} BackgroundColor="#292F36" arrowColor="#CDA274" />
            </div>
            <div className={styles.authLink}>Already have an account? <Link to="/login">Login here</Link></div>
        </form>
    </div>);
};
export default Register;