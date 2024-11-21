import { Routes, Route } from 'react-router-dom'
import AboutUs from "./components/AboutUs";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import SignUp from './components/SignUp';
import ContactUs from './components/ContactUs';
import CreateHabit from './components/CreateHabit';
import SetGoals from './components/SetGoals';
import UpdateHabit from './components/UpdateHabit';
import DeleteHabit from './components/DeleteHabit';
import SelectInterests from './components/Selectinterests';


function App() {
  return (
      <>
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/createHabit" element={<CreateHabit/>} />
          <Route path="/setGoals" element={<SetGoals/>} />
          <Route path="/updateHabit" element={<UpdateHabit/>} />
          <Route path="/deleteHabit" element={<DeleteHabit/>} />
          <Route path="/selectinterests" element={<SelectInterests />} />


        </Routes>
        </>
    
  );
}

export default App;
