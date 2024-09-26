import React , {useState} from 'react';
import './ForgotPassword.css';
import {  useNavigate} from 'react-router-dom';
import axios from 'axios';
//import { toast } from 'react-toastify'; // Import toast
//import 'react-toastify/dist/ReactToastify.css';
//import { handleLogin } from '../../services/authService';

const ForgotPasswordPage = () => {
    
    const [email , setEmail]  = useState("");
    
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    const handleSubmit = (e ) => {
        e.preventDefault();
        axios.post('http://localhost:8080/forgot-pass',{ email })
        .then(res => {
           
            if(res.data.Status === "success")
            { 
                navigate('/login');
            }
            
            
        }).catch(err => console.log(err))
    }
   


  return (
    <>
    <div className="forgot-page">
        <div className="container">
            <div className="wrapperForgot">
                <div className="form-container sign-in">
                    <form onSubmit={handleSubmit} >
                        <h2>FORGOT PASSWORD</h2>
                        
                        <div className="form-group">
                            <input type="email" name="email"  onChange={(e)=>setEmail(e.target.value)} required />
                            <i className="fas fa-at"></i>
                            <label htmlFor="">email</label>
                        </div>
                    
                        <button type="submit" className="btn" onClick={handleSubmit}>Change</button>
                        
                    </form>
                </div>
                
            </div>
        </div>
    </div>
    
      
    </>
  )
}

export default ForgotPasswordPage;
