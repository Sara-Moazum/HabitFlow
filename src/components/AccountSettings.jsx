import React, { useState } from "react";
import "./AccountSettings.css";

const AccountSettings = () => {
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleChangePasswordClick = (e) => {
    e.preventDefault();
    setShowPasswordFields(!showPasswordFields);
  };

  return (
    <div className="account-settings">
      

      <div className="container">
        <h2>Account Information</h2>

        <form>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value="abc@gmail.com" disabled />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>User Name</label>
              <input type="text" />
            </div>
          </div>

          <a href="#" onClick={handleChangePasswordClick}>
            Change Password
          </a>

          {showPasswordFields && (
            <div className="form-row password-fields">
              <div className="form-group">
                <label>Old Password</label>
                <input type="password" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" />
              </div>
            </div>
          )}

          <button type="submit">Save Changes</button>
        </form>
      </div>

      <footer>HABITFLOW © 2024, All Rights Reserved</footer>
    </div>
  );
};

export default AccountSettings;
