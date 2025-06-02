import React, { useState, useEffect, useCallback } from 'react';
import './ProfilePage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/user';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    profile_photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token');

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch user data');

      setUser(data.data);
      setForm({
        username: data.data.username || '',
        email: data.data.email || '',
        profile_photo: null,
      });
      setPreview(data.data.user_image?.image_url || null);
      setErrors('');
    } catch (error) {
      console.error(error);
      setErrors(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_photo') {
      const file = files[0];
      setForm({ ...form, profile_photo: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setErrors('');
    try {
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('email', form.email);
      if (form.profile_photo) {
        formData.append('profile_photo', form.profile_photo);
      }

      const response = await fetch(`${API_URL}/update`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          // Jangan set Content-Type kalau FormData
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');

      alert('Profile updated!');
      fetchUserData();
    } catch (error) {
      console.error(error);
      setErrors(error.message);
      alert('Failed to update profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;

    setIsLoading(true);
    setErrors('');
    try {
      const response = await fetch(`${API_URL}/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete account');

      alert('Account deleted');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
      setErrors(error.message);
      alert('Failed to delete account: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (isLoading && !user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Data Diri</h1>
      </div>

      <div className="profile-content">
        {errors && <div className="error-message">{errors}</div>}

        {preview && <img className="profile-photo" src={preview} alt="Profile" />}
        <ul className="profile-list">
          <li><strong>Username:</strong> {user?.username}</li>
          <li><strong>Email:</strong> {user?.email}</li>
          <li><strong>Role:</strong> {user?.role}</li>
        </ul>

        <div className="divider"></div>

        <div className="update-section">
          <h2>Update Profil</h2>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="file"
            name="profile_photo"
            onChange={handleChange}
          />

          <div className="button-row">
            <button onClick={handleUpdate} disabled={isLoading} className="save-btn">
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="delete-btn"
              style={{ marginLeft: '10px' }}
            >
              {isLoading ? 'Memproses...' : 'Hapus Akun'}
            </button>
          </div>
        </div>

        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
