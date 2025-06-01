import React, { useState, useEffect } from 'react';
import './loginSignup.css';
import user_ic from '../assets/person_ic.png';
import email_ic from '../assets/email_ic.png';
import password_ic from '../assets/password_ic.png';
import tree_illustration from '../assets/planting_Ilus.jpg';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const LoginSignup = () => {
  const { actionType } = useParams();
  const navigate = useNavigate();
  const defaultAction = actionType === 'signup' ? 'Sign Up' : 'Login';
  const [action, setAction] = useState(defaultAction);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data jika sudah login (optional)
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user ? user.id : null;

      if (!token || !userId) {
        console.error('No token or user ID found');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/home/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        console.log('Data:', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
      if (!formData.name) newErrors.name = 'Name is required';
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
      const response = await axios.post(`${API_URL}/${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        // withCredentials hanya perlu kalau pakai cookie auth, bisa dihapus kalau tidak
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Authentication failed');
      } else {
        throw new Error(error.message);
      }
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
          name: formData.name,
          password_confirmation: formData.password_confirmation,
        }),
      };

      const data = await handleAuthRequest(endpoint, payload);

      // Proses login sukses: simpan token & user ke localStorage
      if ((action === 'Login' && data.access_token) || (action === 'Sign Up' && data.status === 'success')) {
        // Simpan user dan token ke localStorage (harus disesuaikan dengan response API kamu)
        if (action === 'Login') {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else if (action === 'Sign Up') {
          // Kalau API signup juga mengembalikan token dan user, simpan juga
          if (data.access_token && data.user) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }

        alert(action === 'Sign Up' ? 'Registration successful!' : 'Login successful!');

        // Redirect ke home user
        if (data.user && data.user.id) {
          navigate(`/home/${data.user.id}`);
        } else {
          // fallback redirect
          navigate('/');
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
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
  };

  return (
    <div className="login-page">
      {/* Left side - Form */}
      <div className="form-side">
        <form onSubmit={handleSubmit}>
          <div className="logo">🌱 Reforest</div>
          <div className="welcome-text">
            <h1>Holla, Welcome Back</h1>
            <p>Hey, welcome back to your special place</p>
          </div>

          {errors.apiError && <div className="alert alert-danger">{errors.apiError}</div>}

          <div className="inputs">
            {action === 'Sign Up' && (
              <div className="input-wrapper">
                <label htmlFor="username">Username</label>
                <div className="input">
                  <img src={user_ic} alt="user icon" />
                  <input type="text" name="username" value={formData.username} onChange={handleChange} />
                </div>
                {errors.username && <span className="error">{errors.username}</span>}
              </div>
            )}

            {action === 'Sign Up' && (
              <div className="input-wrapper">
                <label htmlFor="name">Name</label>
                <div className="input">
                  <img src={user_ic} alt="user icon" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
            )}

            <div className="input-wrapper">
              <label htmlFor="email">Email</label>
              <div className="input">
                <img src={email_ic} alt="email icon" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <div className="input">
                <img src={password_ic} alt="password icon" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            {action === 'Sign Up' && (
              <div className="input-wrapper">
                <label htmlFor="password_confirmation">Password Confirmation</label>
                <div className="input">
                  <img src={password_ic} alt="password icon" />
                  <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} />
                </div>
                {errors.password_confirmation && <span className="error">{errors.password_confirmation}</span>}
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
              Don't have an account? <span onClick={toggleAction}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account? <span onClick={toggleAction}>Login</span>
            </>
          )}
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="image-side">
        <img src={tree_illustration} alt="Tree Illustration" />
      </div>
    </div>
  );
};

export default LoginSignup;
