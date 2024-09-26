import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const storedData = JSON.parse(localStorage.getItem('user_data'));
    const [userProfile, setUserProfile] = useState(null);


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
              if (userData) {
                const response = await fetch('http://localhost:8080/doctor/profile', {
                  method: 'GET',
                  credentials: 'include'
                });
                if (response.ok) {
                  const data = await response.json();
                  setUserProfile(data.profile);
                } else {
                  console.error('Failed to fetch user profile');
                }
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          };
      
          fetchUserProfile();
    }, [userData]);

    const login = (newToken, newData) => {
        localStorage.setItem(
            'user_data',
            JSON.stringify({ userToken: newToken, user: newData }),
        );

        setToken(newToken);
        setUserData(newData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('user_data');
        setToken(null);
        setUserData(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{ token, isAuthenticated, login, logout, userData }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
