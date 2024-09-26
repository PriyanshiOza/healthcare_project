import React , {useState} from 'react';
import './Register.css';
import {Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';
//import { handleRegister } from '../../services/authService';



export default function Register() {

  const [account , setAccount] = useState(" ");
  const [username , setUsername] = useState(" ");
  const [email , setEmail]  = useState(" ");
  const [password, setPassword] = useState(" ");
  const [confirmPassword , setConfirmPassword] = useState(" ");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!account.trim() || !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        toast.error("Please fill in all fields");
        return;
    }
    
    // Check if password and confirm password match
    if (password !== confirmPassword) {
        toast.error("Password & Confirm Password do not match");
        return;
    }
    axios.post('http://localhost:8080/api/auth/register',{account , username , email , password , confirmPassword})
    .then(res => {
        console.log("Registered Data:", res.data); // Log registered data
        navigate('/login');
        toast.success("Registration Successful");
    }).catch(err => {
        console.log(err);
        toast.error("An error occurred"); // Display error toast
    });
  }
  
  return (
    <>
    <div className="register-page">
        <div className="container">

            <div className="wrapperRegister">
                <div className="form-container sign-up">
                    <form onSubmit={handleSubmit}  >
                        <h2>SIGN UP</h2>
                        <div className="form-group">
                            <select name="account" onChange={(e)=>setAccount(e.target.value)} required>
                                <option value="admin" name="admin" >admin</option>
                                <option value="doctor" name="doctor" >doctor</option>
                                <option value="patient" name="patient" >patient</option>
                            </select>
                            <i className="fas fa-user"></i>
                            <label htmlFor="">Account Type</label>
                        </div>
                        <div className="form-group">
                            <input type="text" name="username" onChange={(e)=>setUsername(e.target.value)} required />
                            <i className="fas fa-user"></i>
                            <label htmlFor="">username</label>
                        </div>
                        <div className="form-group">
                            <input type="email" name="email" onChange={(e)=>setEmail(e.target.value)} required />
                            <i className="fas fa-at"></i>
                            <label htmlFor="">email</label>
                        </div>
                        <div className="form-group">
                            <input type="password" name="password" onChange={(e)=>setPassword(e.target.value)} required />
                            <i className="fas fa-lock"></i>
                            <label htmlFor="">password</label>
                        </div>
                        <div className="form-group">
                            <input type="password" name="confirmPassword" onChange={(e)=>setConfirmPassword(e.target.value)} required />
                            <i className="fas fa-lock"></i>
                            <label htmlFor="">confirm password</label>
                        </div>
                        <button type="submit" className="btn"  onClick={handleSubmit} >sign up</button>
                        <div className="link">
                            <p>Already have an account?<Link to="/login" className="signin-link"> sign in</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
      
    </>
  )
}


