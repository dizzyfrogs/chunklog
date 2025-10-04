import React from 'react';
import Profile from '../components/Profile';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';

function ProfilePage({ onProfileUpdate }) {
  const { logout, checkProfileCompletion } = useAuth();
  
  const handleProfileUpdated = () => {
    checkProfileCompletion();
    if (onProfileUpdate) {
      onProfileUpdate(); // trigger the app-wide refresh
    }
  };

  return (
    <div>
      <PageHeader title="Your Profile">
        <button onClick={logout} className="link-button" style={{color: 'var(--text-secondary)', fontSize: '1.5rem'}}>
          <FiLogOut />
        </button>
      </PageHeader>
      <hr />
      <Profile onProfileUpdate={handleProfileUpdated} />
    </div>
  );
}
export default ProfilePage;