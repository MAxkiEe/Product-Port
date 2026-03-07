import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

// --- Heroicons Components ---
const HomeIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const DocumentTextIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ShieldCheckIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ShieldExclamationIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const LogoutIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const BanknotesIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const MenuIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // States for data
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [blockedIps, setBlockedIps] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        users: 0,
        roles: 0,
        permissions: 0,
        recent_users: [],
        total_revenue: 0,
        orders_today: 0,
        pending_orders: 0
    });
    const [adminOrders, setAdminOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    // States for Security Model
    const [ipToBlock, setIpToBlock] = useState('');
    const [blockReason, setBlockReason] = useState('');

    // States for Permission Modal
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [permissionForm, setPermissionForm] = useState({ name: '' });

    // States for User Modal
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: '' });
    const [formError, setFormError] = useState('');

    // Notification State
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchStats();
        } else if (activeTab === 'users') {
            fetchUsers();
            fetchRoles();
        } else if (activeTab === 'permissions') {
            fetchPermissions();
        } else if (activeTab === 'security') {
            fetchSecurityData();
        } else if (activeTab === 'revenue') {
            fetchAdminOrders();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        setIsLoadingStats(true);
        try {
            const response = await axios.get('/api/dashboard/stats');
            setDashboardStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    const fetchPermissions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/permissions');
            setPermissions(response.data);
        } catch (error) {
            console.error('Failed to fetch permissions', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSecurityData = async () => {
        setIsLoading(true);
        try {
            const [visitorsRes, blockedRes] = await Promise.all([
                axios.get('/api/security/visitors'),
                axios.get('/api/security/blocked-ips')
            ]);
            setVisitors(visitorsRes.data);
            setBlockedIps(blockedRes.data);
        } catch (error) {
            console.error('Failed to fetch security data', error);
            showNotification(t('admin.fetch_security_failed'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
            showNotification(t('admin.loading'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get('/api/roles');
            setRoles(response.data);
        } catch (error) {
            console.error('Failed to fetch roles', error);
        }
    };

    const fetchAdminOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/admin/orders');
            setAdminOrders(response.data.data); // It's paginated
        } catch (error) {
            console.error('Failed to fetch admin orders', error);
            showNotification(t('admin.fetch_orders_failed'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
            showNotification(t('admin.order_status_updated'));
            fetchAdminOrders();
            fetchStats(); // Update dashboard stats if visible
        } catch (error) {
            console.error('Failed to update status', error);
            showNotification(t('admin.update_status_failed'), 'error');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setUserForm({ name: '', email: '', password: '', role: 'User' });
        setFormError('');
        setShowUserModal(true);
    };

    const openEditModal = (userToEdit) => {
        setEditingUser(userToEdit);
        setUserForm({
            name: userToEdit.name,
            email: userToEdit.email,
            password: '',
            role: userToEdit.roles && userToEdit.roles.length > 0 ? userToEdit.roles[0].name : ''
        });
        setFormError('');
        setShowUserModal(true);
    };

    const handleDeleteUser = async (userId) => {
        const result = await Swal.fire({
            title: t('swal.confirm_title'),
            text: t('admin.confirm_delete_user'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('swal.confirm_button'),
            cancelButtonText: t('swal.cancel_button')
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/users/${userId}`);
                showNotification(t('admin.delete_user_success'));
                fetchUsers();
            } catch (error) {
                console.error('Failed to delete user', error);
                showNotification(t('admin.delete_user_failed'), 'error');
            }
        }
    };

    const submitUserForm = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            const payload = { ...userForm };
            if (editingUser && !payload.password) {
                delete payload.password; // Don't send empty password on edit
            }

            if (editingUser) {
                await axios.put(`/api/users/${editingUser.id}`, payload);
                showNotification(t('admin.update_user_success'));
            } else {
                await axios.post('/api/users', payload);
                showNotification(t('admin.add_user_success'));
            }
            setShowUserModal(false);
            fetchUsers();
        } catch (error) {
            setFormError(error.response?.data?.message || t('admin.save_error'));
        }
    };

    const handleDeletePermission = async (permissionId) => {
        const result = await Swal.fire({
            title: t('swal.confirm_title'),
            text: t('admin.confirm_delete_permission'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('swal.confirm_button'),
            cancelButtonText: t('swal.cancel_button')
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/permissions/${permissionId}`);
                showNotification(t('admin.delete_permission_success'));
                fetchPermissions();
            } catch (error) {
                console.error('Failed to delete permission', error);
                showNotification(t('admin.delete_user_failed'), 'error');
            }
        }
    };

    const submitPermissionForm = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            await axios.post('/api/permissions', permissionForm);
            showNotification(t('admin.add_permission_success'));
            setShowPermissionModal(false);
            setPermissionForm({ name: '' });
            fetchPermissions();
        } catch (error) {
            setFormError(error.response?.data?.message || t('admin.save_error'));
        }
    };

    const menuItems = [
        { id: 'dashboard', label: t('admin.dashboard_overview'), icon: HomeIcon },
        { id: 'users', label: t('admin.user_management'), icon: UsersIcon },
        { id: 'permissions', label: t('admin.roles_permissions'), icon: ShieldCheckIcon },
        { id: 'content', label: t('admin.content_management'), icon: DocumentTextIcon },
        { id: 'revenue', label: t('admin.revenue_management'), icon: BanknotesIcon },
        { id: 'security', label: t('admin.security_logs'), icon: ShieldExclamationIcon },
    ];

    // --- Sub-components for different views ---

    const DashboardOverview = () => (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('admin.dashboard_overview')}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t('admin.overview_desc')}</p>
                </div>
                <button
                    onClick={fetchStats}
                    disabled={isLoadingStats}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Refresh Stats"
                >
                    <svg className={`w-5 h-5 ${isLoadingStats ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            {/* Stats Grid - 8 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Users Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">{t('admin.total_users')}</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">{isLoadingStats ? '...' : dashboardStats.users}</h3>
                        <p className="text-xs text-blue-600/80 mt-2 font-medium bg-blue-50 inline-block px-2 py-1 rounded">{t('admin.users_in_system')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl text-blue-600 shadow-inner">
                        <UsersIcon className="w-8 h-8" />
                    </div>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">{t('admin.total_revenue')}</p>
                        <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-amber-600 transition-colors">
                            {isLoadingStats ? '...' : `฿ ${parseFloat(dashboardStats.total_revenue).toLocaleString()}`}
                        </h3>
                        <p className="text-xs text-amber-600/80 mt-2 font-medium bg-amber-50 inline-block px-2 py-1 rounded">{t('admin.revenue_desc')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-2xl text-amber-600 shadow-inner">
                        <BanknotesIcon className="w-8 h-8" />
                    </div>
                </div>

                {/* Orders Today Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">{t('admin.orders_today')}</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-rose-600 transition-colors">{isLoadingStats ? '...' : dashboardStats.orders_today}</h3>
                        <p className="text-xs text-rose-600/80 mt-2 font-medium bg-rose-50 inline-block px-2 py-1 rounded">{t('admin.orders_today_desc') || 'Orders today'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-2xl text-rose-600 shadow-inner">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                </div>

                {/* Roles Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">{t('admin.total_roles')}</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-purple-600 transition-colors">{isLoadingStats ? '...' : dashboardStats.roles}</h3>
                        <p className="text-xs text-purple-600/80 mt-2 font-medium bg-purple-50 inline-block px-2 py-1 rounded">{t('admin.roles_in_system')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl text-purple-600 shadow-inner">
                        <ShieldCheckIcon className="w-8 h-8" />
                    </div>
                </div>

                {/* Permissions Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">{t('admin.total_permissions')}</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-emerald-600 transition-colors">{isLoadingStats ? '...' : dashboardStats.permissions}</h3>
                        <p className="text-xs text-emerald-600/80 mt-2 font-medium bg-emerald-50 inline-block px-2 py-1 rounded">{t('admin.permissions_in_system')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-2xl text-emerald-600 shadow-inner">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                </div>

                {/* {t('admin.total_visitors')} Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">{t('admin.total_visitors')}</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-amber-500 transition-colors">{isLoadingStats ? '...' : (dashboardStats.visitors_total || 0)}</h3>
                        <p className="text-xs text-amber-600/80 mt-2 font-medium bg-amber-50 inline-block px-2 py-1 rounded">{t('admin.visitors_total_desc')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-2xl text-amber-500 shadow-inner">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* Today Visitors Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">{t('admin.today_visitors')}</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors">{isLoadingStats ? '...' : (dashboardStats.visitors_today || 0)}</h3>
                        <p className="text-xs text-indigo-600/80 mt-2 font-medium bg-indigo-50 inline-block px-2 py-1 rounded">{t('admin.visitors_today_desc')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-2xl text-indigo-600 shadow-inner">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* {t('admin.blocked_ips')} Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">{t('admin.blocked_ips')}</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-red-600 transition-colors">{isLoadingStats ? '...' : (dashboardStats.blocked_ips || 0)}</h3>
                        <p className="text-xs text-red-600/80 mt-2 font-medium bg-red-50 inline-block px-2 py-1 rounded">{t('admin.blocked_ips_desc')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-2xl text-red-600 shadow-inner">
                        <ShieldExclamationIcon className="w-8 h-8" />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">

                {/* Recent Registered Users */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <UsersIcon className="w-5 h-5 text-gray-500" />
                            {t('admin.recent_registrations')}
                        </h3>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{t('admin.newest_5')}</span>
                    </div>
                    <div className="divide-y divide-gray-100 flex-1">
                        {dashboardStats.recent_users && dashboardStats.recent_users.length > 0 ? dashboardStats.recent_users.map((item, i) => (
                            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/80 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm shrink-0">
                                    {item.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{item.email}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-xs font-medium text-gray-400 block">{new Date(item.created_at).toLocaleDateString('th-TH')}</span>
                                    <span className="text-[10px] text-gray-400 block">{new Date(item.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="px-6 py-12 flex flex-col items-center justify-center text-gray-500 h-full">
                                <UsersIcon className="w-12 h-12 text-gray-200 mb-3" />
                                <p className="text-sm font-medium">{t('admin.no_recent_registrations')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* {t('admin.recent_visitors')} */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {t('admin.recent_visitors')}
                        </h3>
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{t('admin.newest_5')}</span>
                    </div>
                    <div className="divide-y divide-gray-100 flex-1">
                        {dashboardStats.recent_visitors && dashboardStats.recent_visitors.length > 0 ? dashboardStats.recent_visitors.map((visitor, i) => (
                            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/80 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border-2 border-white shadow-sm shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 font-mono truncate">{visitor.ip_address}</p>
                                    <p className="text-xs text-gray-500 truncate pr-4" title={visitor.user_agent}>{visitor.user_agent || `${t('admin.unknown')} Browser`}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-xs font-medium text-gray-400 block">{new Date(visitor.visited_at).toLocaleDateString('th-TH')}</span>
                                    <span className="text-[10px] text-gray-400 block">{new Date(visitor.visited_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="px-6 py-12 flex flex-col items-center justify-center text-gray-500 h-full">
                                <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                                <p className="text-sm font-medium">{t('admin.no_visitor_data')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const UserManagement = () => (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t('admin.user_management')}</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    {t('admin.add_new_user')}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4 font-semibold">{t('admin.name')}</th>
                                <th className="px-6 py-4 font-semibold">{t('admin.email')}</th>
                                <th className="px-6 py-4 font-semibold">{t('admin.role')}</th>
                                <th className="px-6 py-4 font-semibold text-right">{t('admin.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center space-x-2">
                                            <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>{t('admin.loading')}</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length > 0 ? users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {u.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-900">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {(u.roles || []).map(role => (
                                                <span key={role.id} className={`text-xs px-2 py-1 rounded-full font-medium ${role.name === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {role.name}
                                                </span>
                                            ))}
                                            {(!u.roles || u.roles.length === 0) && <span className="text-xs text-gray-400">{t('admin.general_user')}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => openEditModal(u)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4 flex-inline items-center bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition"
                                        >
                                            {t('admin.edit')}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            disabled={u.id === user.id} // Prevent deleting self
                                            className={`text-sm font-medium flex-inline items-center px-3 py-1.5 rounded transition ${u.id === user.id
                                                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                                                : 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100'
                                                }`}
                                        >
                                            {t('admin.delete')}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 bg-gray-50 rounded-lg m-4">
                                        {t('admin.no_users_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Modal (Create/Edit) */}
            {showUserModal && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingUser ? t('admin.edit_user') : t('admin.add_user_title')}
                            </h3>
                            <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={submitUserForm} className="p-6">
                            {formError && (
                                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                                    {formError}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.fullname')}</label>
                                    <input
                                        type="text" required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.email')}</label>
                                    <input
                                        type="email" required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('admin.password_leave_blank')}
                                    </label>
                                    <input
                                        type="password" required={!editingUser} minLength="8"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.permissions_in_system')} (Role)</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                                    >
                                        <option value="">{t('admin.select_role')}</option>
                                        {roles.map(r => (
                                            <option key={r.id} value={r.name}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3 justify-end">
                                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">
                                    ยกเลิก
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-sm">
                                    บันทึกข้อมูล
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    const PermissionManagement = () => (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t('admin.roles_permissions')}</h2>
                <button
                    onClick={() => { setFormError(''); setPermissionForm({ name: '' }); setShowPermissionModal(true); }}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2"
                >
                    <ShieldCheckIcon className="w-5 h-5" />
                    {t('admin.add_permission')}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4 font-semibold">{t('admin.permission_name')}</th>
                                <th className="px-6 py-4 font-semibold">{t('admin.guard_name')}</th>
                                <th className="px-6 py-4 font-semibold text-right">{t('admin.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center space-x-2">
                                            <svg className="animate-spin h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>{t('admin.loading')}</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : permissions.length > 0 ? permissions.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{p.guard_name}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeletePermission(p.id)}
                                            className="text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition"
                                        >
                                            {t('admin.delete')}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500 bg-gray-50 rounded-lg m-4">
                                        {t('admin.no_permissions_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Permission Modal */}
            {showPermissionModal && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">{t('admin.add_permission')} ใหม่</h3>
                            <button onClick={() => setShowPermissionModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={submitPermissionForm} className="p-6">
                            {formError && (
                                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                                    {formError}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.new_permission_example')}</label>
                                    <input
                                        type="text" required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        value={permissionForm.name} onChange={e => setPermissionForm({ name: e.target.value })}
                                        placeholder={t('admin.permission_name')}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3 justify-end">
                                <button type="button" onClick={() => setShowPermissionModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">
                                    {t('admin.cancel')}
                                </button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition shadow-sm">
                                    {t('admin.save_data')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    const ContentManagement = () => (
        <div className="animate-fade-in bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('admin.content_management')}</h2>
            <p className="text-gray-500 max-w-sm">{t('admin.content_desc')}</p>
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium shadow-sm hover:bg-blue-700 transition-all">
                {t('admin.getting_started')}
            </button>
        </div>
    );

    const RevenueManagement = () => (
        <div className="animate-fade-in space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('admin.revenue_management')}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t('admin.revenue_desc')}</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold border border-amber-100">
                        Total: ฿ {parseFloat(dashboardStats.total_revenue).toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                                <th className="p-4">ID</th>
                                <th className="p-4">{t('admin.user')}</th>
                                <th className="p-4">{t('admin.total')}</th>
                                <th className="p-4">{t('admin.status')}</th>
                                <th className="p-4">{t('admin.date')}</th>
                                <th className="p-4 text-right">{t('admin.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {adminOrders.length > 0 ? adminOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900">#{order.id}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{order.user?.name}</div>
                                        <div className="text-xs text-gray-500">{order.user?.email}</div>
                                    </td>
                                    <td className="p-4 font-bold text-gray-900">฿ {parseFloat(order.total_amount).toLocaleString()}</td>
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                            className={`text-xs font-bold px-2 py-1 rounded-lg border-none focus:ring-2 focus:ring-blue-500 transition-all ${order.status === 'paid' || order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                }`}
                                        >
                                            <option value="pending">{t('user_dashboard.status_pending')}</option>
                                            <option value="paid">{t('user_dashboard.status_paid')}</option>
                                            <option value="processing">{t('user_dashboard.status_processing')}</option>
                                            <option value="shipped">{t('user_dashboard.status_shipped')}</option>
                                            <option value="completed">{t('user_dashboard.status_completed')}</option>
                                            <option value="cancelled">{t('user_dashboard.status_cancelled')}</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(order.created_at).toLocaleDateString(i18n.language === 'th' ? 'th-TH' : 'en-US')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-bold">{t('admin.view_details') || 'View Details'}</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-500">
                                        {isLoading ? t('admin.loading') : t('admin.no_orders_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const SecurityLogs = () => {
        const handleBlockIp = async (e) => {
            e.preventDefault();
            setFormError('');
            try {
                await axios.post('/api/security/block-ip', {
                    ip_address: ipToBlock,
                    reason: blockReason
                });
                showNotification(t('admin.block_ip_success'));
                setIpToBlock('');
                setBlockReason('');
                fetchSecurityData();
            } catch (error) {
                setFormError(error.response?.data?.message || t('admin.block_error'));
            }
        };

        const handleUnblockIp = async (id) => {
            const result = await Swal.fire({
                title: t('swal.confirm_title'),
                text: t('admin.unblock_confirm'),
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: t('swal.confirm_button'),
                cancelButtonText: t('swal.cancel_button')
            });

            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/security/block-ip/${id}`);
                    showNotification(t('admin.unblock_success'));
                    fetchSecurityData();
                } catch (error) {
                    console.error('Failed to unblock IP', error);
                    showNotification(t('admin.unblock_failed'), 'error');
                }
            }
        };

        return (
            <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{t('admin.security_logs')}</h2>
                        <p className="text-sm text-gray-500 mt-1">{t('admin.security_desc')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Block Form & {t('admin.blocked_ips')}) */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* {t('admin.block_ip_btn')} Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                            <div className="p-5 bg-red-50/50 border-b border-red-100">
                                <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
                                    <ShieldExclamationIcon className="w-5 h-5 text-red-600" />
                                    {t('admin.block_ip_address')}
                                </h3>
                            </div>
                            <div className="p-5">
                                <form onSubmit={handleBlockIp} className="space-y-4">
                                    {formError && (
                                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg font-medium">{formError}</div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.ip_address')}</label>
                                        <input
                                            type="text" required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 transition-shadow"
                                            placeholder="e.g. 192.168.1.1"
                                            value={ipToBlock} onChange={(e) => setIpToBlock(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.reason_optional')}</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 transition-shadow"
                                            placeholder="e.g. Spamming API"
                                            value={blockReason} onChange={(e) => setBlockReason(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-sm"
                                    >
                                        {t('admin.block_ip_btn')}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* {t('admin.blocked_ips')} List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">{t('admin.currently_blocked')}</h3>
                                <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{blockedIps.length}</span>
                            </div>
                            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                                {blockedIps.length > 0 ? (
                                    blockedIps.map(ip => (
                                        <div key={ip.id} className="p-4 hover:bg-gray-50 flex items-start justify-between group transition-colors">
                                            <div>
                                                <div className="font-mono text-sm font-bold text-gray-900">{ip.ip_address}</div>
                                                <div className="text-xs text-gray-500 mt-1">{ip.reason || t('admin.no_reason')}</div>
                                                <div className="text-[10px] text-gray-400 mt-1">{t('admin.blocked_at')} {new Date(ip.created_at).toLocaleString('th-TH')}</div>
                                            </div>
                                            <button
                                                onClick={() => handleUnblockIp(ip.id)}
                                                className="text-gray-400 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Unblock"
                                            >
                                                <ShieldCheckIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500 text-sm">{t('admin.no_blocked_ips')}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Visitor History) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">{t('admin.recent_visitors_last_100')}</h3>
                                <span className="text-xs text-gray-500">{t('admin.auto_log_desc')}</span>
                            </div>
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                                            <th className="p-4 font-medium">{t('admin.ip_address')}</th>
                                            <th className="p-4 font-medium">{t('admin.time_visited')}</th>
                                            <th className="p-4 font-medium">{t('admin.user_agent')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-sm">
                                        {visitors.length > 0 ? visitors.map((v) => (
                                            <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4 font-mono font-medium text-gray-800 whitespace-nowrap">{v.ip_address}</td>
                                                <td className="p-4 text-gray-600 whitespace-nowrap">{new Date(v.visited_at).toLocaleString('th-TH')}</td>
                                                <td className="p-4 text-xs text-gray-500 max-w-xs truncate" title={v.user_agent}>{v.user_agent || t('admin.unknown')}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="p-8 text-center text-gray-500">{t('admin.no_visitor_data')}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Global Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-slide-in-right flex items-center gap-2 ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                    }`}>
                    {notification.type === 'error' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    )}
                    {notification.message}
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">PP</span>
                    </div>
                    <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Admin<span className="text-blue-600">Port</span></h1>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                    <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('admin.main_menu')}</p>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsSidebarOpen(false); // Close on mobile after click
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* User Info / Bottom Area */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || t('admin.dashboard_title')}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            {t('home')}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <LogoutIcon className="w-4 h-4" />
                            {t('logout')}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-md hover:bg-gray-100"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-bold text-gray-800">{t('admin.dashboard_title')}</h2>
                    </div>

                    {/* Empty placeholder for left desktop, push items to right */}
                    <div className="hidden lg:block"></div>

                    {/* Header Right */}
                    <div className="flex items-center gap-4">
                        {/* Language Toggle */}
                        <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                            <button
                                onClick={() => changeLanguage('th')}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${i18n.language === 'th' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                title={t('admin.language_th')}
                            >
                                TH
                            </button>
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${i18n.language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                title={t('admin.language_en')}
                            >
                                EN
                            </button>
                        </div>

                        {/* Notification Bell */}
                        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {activeTab === 'dashboard' && <DashboardOverview />}
                        {activeTab === 'users' && <UserManagement />}
                        {activeTab === 'permissions' && <PermissionManagement />}
                        {activeTab === 'content' && <ContentManagement />}
                        {activeTab === 'revenue' && <RevenueManagement />}
                        {activeTab === 'security' && <SecurityLogs />}
                    </div>
                </div>
            </main>
        </div>
    );
}
