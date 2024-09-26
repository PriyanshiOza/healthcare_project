import { userLogin } from '../redux/features/auth/authActions';
import store from '../redux/store';

export const handleLogin = (e,account,email,password) => {
    e.preventDefault();
    try{
        if (!account || !email || !password){
            return alert("Please provide all fields");
        }
        store.dispatch(userLogin({account,email,password}));

    }
    catch(error)
    {
        console.log(error);
    }
};

export const handleRegister = (e,account,username,email,password,confirmPassword) => {
    e.preventDefault();
    try{
        console.log("register" , e,account,username,email,password,confirmPassword);

    }
    catch(error)
    {
        console.log(error);
    }
};