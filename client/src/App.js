import {  Routes , Route} from 'react-router-dom';
import './App.css';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DoctorPage from  "./pages/DoctorPage";
import AdminPage from "./pages/AdminPage";
import PatientPage from "./pages/PatientPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  return (
   <>
    <ToastContainer/> 
      <Routes>
        <Route path="/" element={<Register/>}></Route>   
        <Route path="/login" element={<Login/>}> </Route>
        <Route path="/doctorpage" element={<DoctorPage/>}></Route>
        <Route path="/adminpage" element={<AdminPage/>}></Route>
        <Route path="/patientpage" element={<PatientPage/>}></Route>
        <Route path="/forgot-pass" element={<ForgotPasswordPage/>}></Route>
        <Route path="/reset-password/:id/:token" element={<ResetPassword/>}></Route>
        <Route path="/doctor/:id"  />



      </Routes>
      
    
      </>
   
  );
}

export default App;
