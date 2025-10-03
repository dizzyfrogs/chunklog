import React from 'react';
import Profile from '../components/Profile';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { logout, checkProfileCompletion } = useAuth();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Your Profile</h2>
        <button onClick={logout} className="link-button" style={{color: 'var(--text-secondary)'}}>Logout</button>
      </div>
      <hr />
      <Profile onProfileUpdate={checkProfileCompletion} />
    </div>
  );
}
export default ProfilePage;