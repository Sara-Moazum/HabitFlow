import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode'; // Import jwt_decode to decode the token
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import NavBar from './components/NavBar';
import SignUp from './components/SignUp';
import ContactUs from './components/ContactUs';
import CreateHabit from './components/CreateHabit';
import SetGoals from './components/SetGoals';
import UpdateHabit from './components/UpdateHabit';
import DeleteHabit from './components/DeleteHabit';
import SelectInterests from './components/Selectinterests';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import TrackProgress from './components/TrackProgress';
import AccountSettings from './components/AccountSettings';
import HabitSuggestions from './components/HabitSuggestions';

function App() {
  const [user, setUser] = useState({ userId: '', username: '' });

  useEffect(() => {
    // Fetch token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the JWT token to get userId and username
        const decodedToken = jwt_decode(token);
        console.log('token is',decodedToken);
        setUser({
          userId: decodedToken.userId,
          username: decodedToken.username,
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/createHabit" element={<CreateHabit userId={user.userId} />} />
        <Route path="/setGoals" element={<SetGoals />} />
        <Route path="/updateHabit" element={<UpdateHabit />} />
        <Route path="/deleteHabit" element={<DeleteHabit />} />
        <Route path="/selectinterests" element={<SelectInterests />} />
        {/* Pass userId and username as props to Dashboard */}
        <Route path="/dashboard" element={<Dashboard userId={user.userId} username={user.username} />} />
        <Route path="/habitSuggestions" element={<HabitSuggestions />} />
        <Route path="/trackProgress" element={<TrackProgress />} />
        <Route path="/accountSettings" element={<AccountSettings />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
