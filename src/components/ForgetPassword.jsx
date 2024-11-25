import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './ForgetPassword.css';

const ForgetPassword = () => {
  const [stage, setStage] = useState(1); // Stage 1: Enter username, Stage 2: Enter new password
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // Initialize navigate hook

  const handleResetClick = () => {
    if (username.trim() !== '') {
      setStage(2); // Move to stage 2 if username is provided
    } else {
      alert('Please enter a username!');
    }
  };

  const handlePasswordSubmit = () => {
    if (newPassword.trim() === '') {
      alert('Please enter a new password!');
    } else if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
    } else {
      alert('Password reset successfully!');
      navigate('/login'); // Redirect to the Login page
    }
  };

  return (
    <div className="forget-password-container">
      {stage === 1 && (
        <div className="reset-stage">
          <h2>Forget Password</h2>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleResetClick}>Reset</button>
        </div>
      )}
      {stage === 2 && (
        <div className="password-stage">
          <h2>Reset Password</h2>
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <button onClick={handlePasswordSubmit}>Submit</button>
        
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
