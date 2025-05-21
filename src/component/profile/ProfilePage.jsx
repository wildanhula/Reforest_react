import React from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  const userData = {
    name: "Wildan hula kece pisan",
    phone: "08123456789",
    birthDate: "09/12/2004",
    email: "wildankece@gmail.com"
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Data Diri</h1>
      </div>

      <div className="profile-content">
        <ul className="profile-list">
          <li>{userData.name}</li>
          <li>{userData.phone}</li>
          <li>{userData.birthDate}</li>
          <li>{userData.email}</li>
        </ul>

        <div className="divider"></div>

        <div className="update-section">
          <h2>Update</h2>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;