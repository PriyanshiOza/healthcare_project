import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contexts/AuthContext';
// import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [account, setAccount] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!account.trim() || !email.trim() || !password.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        axios.post('http://localhost:8080/api/auth/login', { account, email, password })
            .then(res => {
                if (res.data.status === "success") {
                    const { token, user } = res.data;
                    console.log("Logged In User Details:", user); // Log user details
                    login(token, user); // Set userData after successful login
                    switch (account) {
                        case 'admin':
                            navigate('/adminpage', { state : {user} });
                            break;
                        case 'doctor':
                            navigate('/doctorpage', { state : {user} });
                            break;
                        case 'patient':
                            navigate('/patientpage', { state : {user} });
                            break;
                        default:
                            navigate('/');
                            break;
                    }
                    toast.success("Login Successful");
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(err => {
                console.error("Login Error:", err);
                toast.error("An error occurred during login");
            });
    }

    return (
        <>
            <div className="login-page">
                <div className="container">
                    <div className="wrapperLogin">
                        <div className="form-container sign-in">
                            <form onSubmit={handleSubmit}>
                                <h2>LOGIN</h2>
                                <div className="form-group">
                                    <select name="account" onChange={(e) => setAccount(e.target.value)} required>
                                        <option value="admin">Admin</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="patient">Patient</option>
                                    </select>
                                    <i className="fas fa-user"></i>
                                    <label htmlFor="">Account Type</label>
                                </div>
                                <div className="form-group">
                                    <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} required />
                                    <i className="fas fa-at"></i>
                                    <label htmlFor="">Email</label>
                                </div>
                                <div className="form-group">
                                    <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                                    <i className="fas fa-lock"></i>
                                    <label htmlFor="">Password</label>
                                </div>
                                <button type="submit" className="btn">Login</button>
                                <div className="link">                   
                            <p>                  
                        <Link to="/forgot-pass" className="forgot-pass">
                            Forget Password

                        </Link>
                    </p>
                    </div>
                                <div className="link2">
                                    <p>Don't have an account?<Link to="/" className="signup-link"> Sign up</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;
