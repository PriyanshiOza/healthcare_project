import {createAsyncThunk} from "@reduxjs/toolkit";
import API from "../../../services/API";
import { toast } from 'react-toastify';

export const userLogin = createAsyncThunk(
    'auth/login',
    async ({account,email,password} ,{rejectWithValue}) => {
        try{
            const {data} = await API.post('auth/login' , {account,email,password} )
            // store token
            if(data.success){
                alert(data.message)
                localStorage.setItem('token' , data.token);
                toast.success(data.message);
                
            }
            return data;
        }
        catch(error){
            if(error.response && error.response.data.message){
                return rejectWithValue(error.response.data.message);
            }
            else{
                return rejectWithValue(error.message);
            }
        }

    }
);