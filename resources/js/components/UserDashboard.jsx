import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// --- Heroicons Components ---
const UserIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ShoppingBagIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const ArrowLeftIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const LogoutIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export default function UserDashboard() {
    const { t, i18n } = useTranslation();
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    // States
    const [profileData, setProfileData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (user) {
            setProfileData({ ...profileData, name: user.name, email: user.email });
        }
        if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [user, activeTab]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/user/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setIsLoading(true);

        if (profileData.password && profileData.password !== profileData.password_confirmation) {
            setMessage({ text: t('user_dashboard.pass_mismatch'), type: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            await axios.put('/api/user/profile', profileData);
            setMessage({ text: t('user_dashboard.update_success'), type: 'success' });
            if (refreshUser) await refreshUser();
            setProfileData({ ...profileData, password: '', password_confirmation: '' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || t('user_dashboard.update_error'), type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const menuItems = [
        { id: 'profile', label: t('user_dashboard.profile'), icon: UserIcon },
        { id: 'orders', label: t('user_dashboard.my_orders'), icon: ShoppingBagIcon },
    ];

    // --- Components ---
    const ProfileView = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('user_dashboard.profile')}</h2>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-start gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                    {message.type === 'error' ? (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    )}
                    <p>{message.text}</p>
                </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-5 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('user_dashboard.fullname')}</label>
                        <input
                            type="text" required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-gray-900"
                            value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('user_dashboard.email')}</label>
                        <input
                            type="email" required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-gray-900"
                            value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('user_dashboard.change_password')} <span className="text-sm font-normal text-gray-400">{t('user_dashboard.optional')}</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('user_dashboard.new_password')}</label>
                            <input
                                type="password" minLength="8"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                value={profileData.password} onChange={e => setProfileData({ ...profileData, password: e.target.value })}
                                placeholder={t('user_dashboard.new_password_placeholder')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('user_dashboard.confirm_password')}</label>
                            <input
                                type="password" minLength="8"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                value={profileData.password_confirmation} onChange={e => setProfileData({ ...profileData, password_confirmation: e.target.value })}
                                placeholder={t('user_dashboard.confirm_password_placeholder')}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-sm hover:bg-blue-700 hover:shadow transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? t('user_dashboard.saving') : t('user_dashboard.save_changes')}
                    </button>
                </div>
            </form>
        </div>
    );

    const OrdersView = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">{t('user_dashboard.my_orders')}</h2>
                <p className="text-gray-500 mt-1">{t('user_dashboard.orders_desc')}</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                            <th className="px-6 py-4 font-semibold">{t('user_dashboard.order_id')}</th>
                            <th className="px-6 py-4 font-semibold">{t('user_dashboard.date')}</th>
                            <th className="px-6 py-4 font-semibold">{t('user_dashboard.total')}</th>
                            <th className="px-6 py-4 font-semibold">{t('user_dashboard.status')}</th>
                            <th className="px-6 py-4 font-semibold text-right">{t('user_dashboard.action')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex justify-center items-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>{t('user_dashboard.loading')}</span>
                                    </div>
                                </td>
                            </tr>
                        ) : orders.length > 0 ? orders.map((order, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString(i18n.language === 'th' ? 'th-TH' : 'en-US')}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">฿{parseFloat(order.total_amount).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'paid' || order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                        {t(`user_dashboard.status_${order.status}`) || order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">{t('user_dashboard.view_details')}</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                        <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">{t('user_dashboard.no_orders')}</h3>
                                    <p className="text-gray-500">{t('user_dashboard.no_orders_desc')}</p>
                                    <button onClick={() => navigate('/')} className="mt-4 text-blue-600 font-medium hover:text-blue-800">
                                        {t('user_dashboard.shop_now')}
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (!user) return null; // Or a loading spinner if context is loading

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Minimal Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors group"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            {t('user_dashboard.back_home')}
                        </button>
                        <div className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-4">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-inner relative">
                                {user.name.charAt(0).toUpperCase()}
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <span className="hidden sm:block text-sm font-semibold text-gray-800 tracking-wide">
                                {user.name}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        {/* User Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-50 text-blue-600 flex items-center justify-center font-bold text-2xl shadow-inner mb-4 border-4 border-white ring-1 ring-gray-100">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                            <p className="text-sm text-gray-500 truncate w-full">{user.email}</p>
                            <div className="mt-4 flex flex-wrap justify-center gap-1">
                                {(user.roles || []).map(r => (
                                    <span key={r.id} className="text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                                        {r.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-1.5">
                            {menuItems.map(item => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20 translate-y-0.5'
                                            : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-white/90' : 'text-gray-400'}`} />
                                        {item.label}
                                    </button>
                                )
                            })}
                            <div className="pt-4 mt-4 border-t border-gray-200/60 space-y-2">
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                                >
                                    <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    {t('user_dashboard.back_to_shop')}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                                >
                                    <LogoutIcon className="w-5 h-5 opacity-80" />
                                    {t('user_dashboard.logout')}
                                </button>
                            </div>
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        {activeTab === 'profile' && <ProfileView />}
                        {activeTab === 'orders' && <OrdersView />}
                    </div>
                </div>
            </main>
        </div>
    );
}
