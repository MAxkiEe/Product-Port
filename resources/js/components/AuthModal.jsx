import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, authModalView, openAuthModal, login } = useAuth();
    const { t } = useTranslation();

    // Login States
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register States
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isAuthModalOpen) return null;

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(loginEmail, loginPassword);
            closeAuthModal();
        } catch (err) {
            setError(err.response?.data?.message || t('invalid_credentials'));
        } finally {
            setLoading(false);
        }
    };

    // Note: Since we don't have a register method in AuthContext yet, 
    // we use a generic placeholder or you can implement register via axios here.
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (registerPassword !== registerPasswordConfirm) {
            setError(t('passwords_not_match'));
            return;
        }

        setLoading(true);
        try {
            // Placeholder: Assuming we are using axios directly for registration here
            // In a real app, move this to AuthContext
            const axios = require('axios');
            await axios.get('/sanctum/csrf-cookie');
            await axios.post('/api/register', {
                name: registerName,
                email: registerEmail,
                password: registerPassword,
                password_confirmation: registerPasswordConfirm
            });
            // Auto login after register
            await login(registerEmail, registerPassword);
            closeAuthModal();
        } catch (err) {
            setError(err.response?.data?.message || t('registration_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={closeAuthModal}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-900">
                        {authModalView === 'login' ? t('login') : t('create_account')}
                    </h3>
                    <button
                        onClick={closeAuthModal}
                        className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {authModalView === 'login' ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                                <input
                                    type="email" required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                                    placeholder="your@email.com"
                                    value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">{t('password')}</label>
                                    <a href="/forgot-password" onClick={closeAuthModal} className="text-xs font-medium text-blue-600 hover:text-blue-800">{t('forgot_password')}</a>
                                </div>
                                <input
                                    type="password" required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className={`w-full py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? t('logging_in') : t('login')}
                            </button>

                            <div className="mt-6 text-center text-sm text-gray-600">
                                {t('no_account')}{' '}
                                <button type="button" onClick={() => openAuthModal('register')} className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                    {t('register_here')}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                                <input
                                    type="text" required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                                    placeholder={t('name')}
                                    value={registerName} onChange={(e) => setRegisterName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                                <input
                                    type="email" required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                                    placeholder="your@email.com"
                                    value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                                <input
                                    type="password" required minLength="8"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('confirm_password')}</label>
                                <input
                                    type="password" required minLength="8"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={registerPasswordConfirm} onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className={`w-full py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? t('creating_account') : t('register')}
                            </button>

                            <div className="mt-6 text-center text-sm text-gray-600">
                                {t('already_have_account')}{' '}
                                <button type="button" onClick={() => openAuthModal('login')} className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                    {t('login')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
