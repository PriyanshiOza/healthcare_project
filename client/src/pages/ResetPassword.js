import React , {useState} from 'react';
import './ResetPassword.css';
import {  useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
//import { toast } from 'react-toastify'; // Import toast
//import 'react-toastify/dist/ReactToastify.css';
//import { handleLogin } from '../../services/authService';

const ResetPassword = () => {
    
    const [password , setPassword]  = useState(""); 
    const navigate = useNavigate();
    const {id,token} = useParams();

    axios.defaults.withCredentials = true;
    const handleSubmit = (e ) => {
        e.preventDefault();
        axios.post(`http://localhost:8080/reset-password/${id}/${token}`,{ password })
        .then(res => {
           
            if(res.data.Status === "success")
            { 
                navigate('/login');
            }
            
            
        }).catch(err => console.log(err))
    }
   


  return (
    <>
    <div className="reset-page">
        <div className="container">
            <div className="wrapperReset">
                <div className="form-container sign-in">
                    <form onSubmit={handleSubmit} >
                        <h2>RESET PASSWORD</h2>
                        
                        <div className="form-group">
                            <input type="password" name="password" onChange={(e)=>setPassword(e.target.value)} required/>
                            <i className="fas fa-lock"></i>
                            <label htmlFor="">new password</label>
                        </div>
                    
                        <button type="submit" className="btn" >Update</button>
                        
                    </form>
                </div>
                
            </div>
        </div>
    </div>
       
    
      
    </>
  )
}

export default ResetPassword;
