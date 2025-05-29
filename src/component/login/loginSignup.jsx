import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate untuk navigasi
import './loginSignup.css';
import user_ic from '../assets/person_ic.png';
import email_ic from '../assets/email_ic.png';
import password_ic from '../assets/password_ic.png';
import tree_illustration from '../assets/planting_Ilus.jpg';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/auth';

const LoginSignup = () => {
  const [action, setAction] = useState('Login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();  // Initialize navigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (action === 'Sign Up') {
      if (!formData.username) newErrors.username = 'Username is required';
      if (!formData.password_confirmation) {
        newErrors.password_confirmation = 'Please confirm your password';
      } else if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthRequest = async (endpoint, data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.message || (responseData.errors ? Object.values(responseData.errors).flat().join(', ') : 'Authentication failed');
        throw new Error(errorMessage);
      }

      return responseData;
    } catch (error) {
      console.error('Auth Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const endpoint = action === 'Login' ? 'login' : 'register';
      const payload = {
        email: formData.email,
        password: formData.password,
        ...(action === 'Sign Up' && {
          username: formData.username,
          password_confirmation: formData.password_confirmation,
        }),
      };

      const data = await handleAuthRequest(endpoint, payload);

      if ((action === 'Login' && data.status === 'success') || (action === 'Sign Up' && data.status === 'success')) {
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // After successful registration, switch to Login
        if (action === 'Sign Up') {
          // Automatically switch to login section after successful signup
          setAction('Login');
          setFormData({
            username: '',
            email: '',
            password: '',
            password_confirmation: '',
          });

          // Navigate to the login section
          navigate('/login');  // Redirect to login page
        } else {
          // After successful login, navigate to the dashboard
          navigate('/home');  // Redirect to /home (dashboard) page
        }
      }
    } catch (error) {
      setErrors({ ...errors, apiError: error.message });
    }
  };

  const toggleAction = () => {
    setAction(action === 'Login' ? 'Sign Up' : 'Login');
    setErrors({});
    setFormData({
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
  };

  return (
    <div className="login-page">
      <div className="form-side">
        <form onSubmit={handleSubmit}>
          <div className="logo">🌱 Reforest</div>
          <div className="welcome-text">
            <h1>Holla, Welcome Back</h1>
            <p>Hey, welcome back to your special place</p>
          </div>

          {errors.apiError && (
            <div className="alert alert-danger">
              {errors.apiError}
            </div>
          )}

          <div className="inputs">
            {action === 'Sign Up' && (
              <div className="input-wrapper">
                <label htmlFor="username">Username</label>
                <div className="input">
                  <img src={user_ic} alt="user icon" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                {errors.username && <span className="error">{errors.username}</span>}
              </div>
            )}

            <div className="input-wrapper">
              <label htmlFor="email">Email</label>
              <div className="input">
                <img src={email_ic} alt="email icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <div className="input">
                <img src={password_ic} alt="password icon" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            {action === 'Sign Up' && (
              <div className="input-wrapper">
                <label htmlFor="password_confirmation">Password Confirmation</label>
                <div className="input">
                  <img src={password_ic} alt="password icon" />
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
                {errors.password_confirmation && (
                  <span className="error">{errors.password_confirmation}</span>
                )}
              </div>
            )}
          </div>

          <div className="submit-container">
            <button type="submit" className="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : action}
            </button>
          </div>
        </form>

        <div className="bottom-text">
          {action === 'Login' ? (
            <>
              Don't have an account?{' '}
              <span onClick={toggleAction}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span onClick={toggleAction}>Login</span>
            </>
          )}
        </div>
      </div>

      <div className="image-side">
        <img src={tree_illustration} alt="Tree Illustration" />
      </div>
    </div>
  );
};

export default LoginSignup;
