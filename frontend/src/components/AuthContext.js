// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    // Check local storage for authentication state on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

        if (storedUser && storedIsLoggedIn) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(JSON.parse(storedIsLoggedIn));
        }
    }, []);

    const login = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Store user data in local storage
        localStorage.setItem('isLoggedIn', JSON.stringify(true)); // Store authentication state in local storage
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('user'); // Remove user data from local storage
        localStorage.removeItem('isLoggedIn'); // Remove authentication state from local storage
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
