import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios
// We don't set baseURL so it uses the current origin
axios.defaults.withCredentials = true; // Required for Sanctum CSRF

// Add global interceptor for Authorization header
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Global Auth Modal States
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('login'); // 'login' or 'register'

    const openAuthModal = (view = 'login') => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/user');
            setUser(response.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            // Get CSRF cookie first
            await axios.get('/sanctum/csrf-cookie');

            const response = await axios.post('/api/login', { email, password });
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            setUser(userData);
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const hasRole = (roles) => {
        if (!user || !user.roles) return false;
        const userRoles = user.roles.map(r => r.name);
        return roles.some(role => userRoles.includes(role));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, checkAuth, loading, hasRole, isAuthModalOpen, authModalView, openAuthModal, closeAuthModal }}>
            {children}
        </AuthContext.Provider>
    );
};
