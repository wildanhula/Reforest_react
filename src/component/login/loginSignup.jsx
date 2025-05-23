import React, { useState } from 'react';
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
    F_name: '',
    L_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      if (!formData.F_name) newErrors.F_name = 'First name is required';
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
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: rememberMe ? 'include' : 'same-origin'
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.message || 
          (responseData.errors ? Object.values(responseData.errors).flat().join(', ') : 'Authentication failed');
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
          F_name: formData.F_name,
          L_name: formData.L_name || null,
          password_confirmation: formData.password_confirmation
        })
      };

      const data = await handleAuthRequest(endpoint, payload);
      
      // Handle successful authentication
      if ((action === 'Login' && data.status === 'Success') || 
          (action === 'Sign Up' && data.status === 'success')) {
        
        // Save user data to localStorage or sessionStorage if needed
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(action === 'Login' ? data.data.user : data.data));
        }
        
        alert(`${action} successful!`);
        // Here you would typically redirect to dashboard page
        // window.location.href = '/dashboard';
      }
      
    } catch (error) {
      setErrors({ ...errors, apiError: error.message });
    }
  };

  const toggleAction = () => {
    setAction(action === 'Login' ? 'Sign Up' : 'Login');
    setErrors({});
    // Reset form when switching
    setFormData({
      username: '',
      F_name: '',
      L_name: '',
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

            {action === 'Sign Up' && (
              <>
                <div className="input-wrapper">
                  <label htmlFor="F_name">First Name</label>
                  <div className="input">
                    <img src={user_ic} alt="user icon" />
                    <input
                      type="text"
                      name="F_name"
                      value={formData.F_name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.F_name && <span className="error">{errors.F_name}</span>}
                </div>

                <div className="input-wrapper">
                  <label htmlFor="L_name">Last Name (Optional)</label>
                  <div className="input">
                    <img src={user_ic} alt="user icon" />
                    <input
                      type="text"
                      name="L_name"
                      value={formData.L_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
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

      {/* Right side - Illustration */}
      <div className="image-side">
        <img src={tree_illustration} alt="Tree Illustration" />
      </div>
    </div>
  );
};

export default LoginSignup;