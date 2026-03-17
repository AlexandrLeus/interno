import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.scss'
import Button from '../../components/ui/Button';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(form);
    navigate(from, { replace: true });
  };

  return (<div className={styles.authContainer}>
    <form onSubmit={handleSubmit}>
      <h2>Sign in</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <label>
        <input
          type="checkbox"
          name="rememberMe"
          checked={form.rememberMe}
          onChange={handleChange}
        />
        Remember me
      </label>
      <div>
        <Button text="Sign in" BackgroundColor="#292F36" arrowColor="#CDA274" />
      </div>
    </form>
  </div>);
};
export default Login;