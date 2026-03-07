import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = ({
    activeSection,
    scrollToSection,
    homeRef,
    productsRef,
    aboutRef,
    contactRef,
    setShowSearch,
    setShowCart,
    cartCount
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [scrollDirection, setScrollDirection] = useState('up');

    // Auth context
    const { user, logout, hasRole, openAuthModal } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        // Force state update to save to localStorage and cascade down
    };

    const navItems = [
        {
            name: 'home',
            label: t('home'),
            ref: homeRef,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'products',
            label: t('products'),
            ref: productsRef,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            )
        },
        {
            name: 'about',
            label: t('about'),
            ref: aboutRef,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            name: 'contact',
            label: t('contact'),
            ref: contactRef,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        }
    ];

    // Handle scroll effects
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // ตรวจสอบว่าเลื่อนลงหรือขึ้น
            if (currentScrollY > lastScrollY) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }

            // แสดง/ซ่อน Navbar ตามทิศทางการเลื่อน
            if (currentScrollY > 100 && currentScrollY > lastScrollY) {
                setIsVisible(false); // ซ่อนเมื่อเลื่อนลง
            } else {
                setIsVisible(true); // แสดงเมื่อเลื่อนขึ้น
            }

            // เปลี่ยนสไตล์เมื่อเลื่อนเกิน 20px
            setIsScrolled(currentScrollY > 20);

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Handle click outside to close mobile menu
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMobileMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.menu-button')) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileMenuOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const showNotification = (message) => {
        setTooltipMessage(message);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    const handleLoginClick = () => {
        openAuthModal('login');
    };

    const handleLogoutClick = async () => {
        await logout();
        navigate('/');
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'
                } ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm border-b border-gray-200/50'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo with animation */}
                        <Logo
                            scrollToSection={scrollToSection}
                            homeRef={homeRef}
                            isScrolled={isScrolled}
                            showNotification={showNotification}
                        />

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map(item => (
                                <NavItem
                                    key={item.name}
                                    item={item}
                                    isActive={activeSection === item.name}
                                    isHovered={hoveredItem === item.name}
                                    onHover={setHoveredItem}
                                    scrollToSection={scrollToSection}
                                />
                            ))}
                        </div>

                        {/* Action Icons */}
                        <ActionIcons
                            setShowSearch={setShowSearch}
                            setShowCart={setShowCart}
                            cartCount={cartCount}
                            onLoginClick={handleLoginClick}
                            showNotification={showNotification}
                            user={user}
                            logout={handleLogoutClick}
                            hasRole={hasRole}
                            navigate={navigate}
                            openAuthModal={openAuthModal}
                            t={t}
                            i18n={i18n}
                            changeLanguage={changeLanguage}
                        />

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden menu-button w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden mobile-menu overflow-hidden transition-all duration-500 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-4 space-y-2">
                        {navItems.map(item => (
                            <MobileNavItem
                                key={item.name}
                                item={item}
                                isActive={activeSection === item.name}
                                scrollToSection={(ref, name) => {
                                    scrollToSection(ref, name);
                                    setIsMobileMenuOpen(false);
                                }}
                            />
                        ))}
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 px-2 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>

                                    {hasRole(['Admin']) && (
                                        <button
                                            onClick={() => navigate('/dashboard')}
                                            className="w-full bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition flex items-center justify-center space-x-2 font-medium"
                                        >
                                            <span>{t('admin_dashboard')}</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={handleLogoutClick}
                                        className="w-full bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-100 transition flex items-center justify-center space-x-2 font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>{t('logout')}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openAuthModal('login')}
                                        className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-3 rounded-xl hover:from-gray-900 hover:to-gray-800 transition transform flex items-center justify-center space-x-2 shadow-lg"
                                    >
                                        <span>{t('login')}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => openAuthModal('register')}
                                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition transform flex items-center justify-center space-x-2 shadow-lg"
                                    >
                                        <span>{t('register')}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Mobile Language Switcher */}
                            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => changeLanguage('th')}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${i18n.language === 'th' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    🇹🇭 TH
                                </button>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${i18n.language === 'en' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    🇬🇧 EN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Tooltip Notification */}
            <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                <div className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{tooltipMessage}</span>
                </div>
            </div>

            {/* Scroll Progress Indicator */}
            <div className={`fixed left-0 right-0 h-1 bg-gray-100 z-40 transition-all duration-300 ${isVisible ? 'top-16' : 'top-0'
                }`}>
                <div
                    className="h-full bg-gradient-to-r from-gray-600 to-gray-800 transition-all duration-300"
                    style={{ width: `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%` }}
                />
            </div>
        </>
    );
};

const Logo = ({ scrollToSection, homeRef, isScrolled, showNotification }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        scrollToSection(homeRef, 'home');
        showNotification(t('notifications.back_to_home'));
        setTimeout(() => setIsClicked(false), 300);
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex items-center space-x-2 group relative"
        >
            <div className={`relative w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl transition-all duration-300 ${isHovered ? 'rotate-12 scale-110 shadow-lg' : 'shadow-md'
                } ${isClicked ? 'scale-90' : ''}`}>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition"></div>
            </div>
            <div className="relative">
                <span className={`text-gray-900 font-bold text-xl transition-all duration-300 ${isScrolled ? 'tracking-wide' : 'tracking-normal'
                    }`}>
                    LOGO
                </span>
                <span className={`absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full animate-ping ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`}></span>
            </div>
        </button>
    );
};

// NavItem component
const NavItem = ({ item, isActive, isHovered, onHover, scrollToSection }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        setIsAnimating(true);
        scrollToSection(item.ref, item.name);
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => onHover(item.name)}
            onMouseLeave={() => onHover(null)}
            className="relative group px-4 py-2 overflow-hidden"
        >
            <span className={`relative z-10 flex items-center space-x-2 transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-500'
                } group-hover:text-gray-900`}>
                <span className={`text-lg transition-all duration-300 ${isActive ? 'text-gray-900' : 'text-gray-500'
                    } group-hover:text-gray-900 group-hover:scale-110`}>
                    {item.icon}
                </span>
                <span>{item.label}</span>
            </span>

            <span className={`absolute inset-0 bg-gray-100 transform transition-transform duration-300 ${isHovered ? 'scale-x-100' : 'scale-x-0'
                } origin-left rounded-lg`}></span>

            {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-600 to-gray-800 transform origin-left transition-transform">
                    <span className="absolute inset-0 bg-gray-800 animate-pulse"></span>
                </span>
            )}

            {isAnimating && (
                <span className="absolute inset-0 bg-gray-200 rounded-lg animate-ripple"></span>
            )}
        </button>
    );
};

// MobileNavItem component
const MobileNavItem = ({ item, isActive, scrollToSection }) => {
    const [isTapped, setIsTapped] = useState(false);

    const handleClick = () => {
        setIsTapped(true);
        scrollToSection(item.ref, item.name);
        setTimeout(() => setIsTapped(false), 300);
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                } ${isTapped ? 'scale-95' : ''}`}
        >
            <span className={`text-lg ${isActive ? 'text-white' : 'text-gray-600'
                }`}>
                {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
            {isActive && (
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            )}
        </button>
    );
};

const ActionIcons = ({ setShowSearch, setShowCart, cartCount, onLoginClick, user, logout, hasRole, navigate, openAuthModal, t, i18n, changeLanguage, showNotification }) => {
    const [isSearchHovered, setIsSearchHovered] = useState(false);
    const [isCartHovered, setIsCartHovered] = useState(false);
    const [isLoginHovered, setIsLoginHovered] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [cartPulse, setCartPulse] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen]);

    useEffect(() => {
        if (cartCount > 0) {
            setCartPulse(true);
            setTimeout(() => setCartPulse(false), 500);
        }
    }, [cartCount]);

    const handleSearchClick = () => {
        setShowSearch(true);
        showNotification(t('notifications.search_open'));
    };

    const handleCartClick = () => {
        setShowCart(true);
        showNotification(t('notifications.cart_open'));
    };

    return (
        <div className="hidden md:flex items-center space-x-2">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 mr-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                <button
                    onClick={() => changeLanguage('th')}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${i18n.language === 'th' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    title="ภาษาไทย"
                >
                    TH
                </button>
                <button
                    onClick={() => changeLanguage('en')}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${i18n.language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    title="English"
                >
                    EN
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <button
                    onClick={handleSearchClick}
                    onMouseEnter={() => setIsSearchHovered(true)}
                    onMouseLeave={() => setIsSearchHovered(false)}
                    className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all duration-300 group"
                >
                    <svg className={`w-5 h-5 text-gray-600 transition-all duration-300 ${isSearchHovered ? 'scale-110 text-gray-900' : ''
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

                {isSearchHovered && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
                        ค้นหา
                    </div>
                )}
            </div>

            {/* Cart */}
            <div className="relative">
                <button
                    onClick={handleCartClick}
                    onMouseEnter={() => setIsCartHovered(true)}
                    onMouseLeave={() => setIsCartHovered(false)}
                    className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all duration-300 group"
                >
                    <svg className={`w-5 h-5 text-gray-600 transition-all duration-300 ${isCartHovered ? 'scale-110 text-gray-900' : ''
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>

                    {cartCount > 0 && (
                        <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 transition-all duration-300 shadow-lg ${cartPulse ? 'scale-125 bg-red-500' : ''
                            }`}>
                            {cartCount}
                        </span>
                    )}
                </button>

                {isCartHovered && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
                        ตะกร้า
                    </div>
                )}
            </div>

            {/* User Area */}
            {user ? (
                <div className="relative ml-2" ref={dropdownRef}>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-2 p-1 pl-3 pr-1 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        <span className="text-sm font-medium text-gray-700 hidden lg:block tracking-wide max-w-[100px] truncate">
                            {user.name}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                            {user.name.charAt(0)}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn origin-top-right">
                            <div className="px-4 py-3 border-b border-gray-50 flex flex-col">
                                <span className="text-sm font-semibold text-gray-900 truncate">{user.name}</span>
                                <span className="text-xs text-gray-500 truncate">{user.email}</span>
                            </div>

                            <div className="py-2">
                                {hasRole(['Admin']) && (
                                    <button
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            navigate('/dashboard');
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {t('admin_dashboard')}
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        navigate('/user-dashboard');
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {t('profile')}
                                </button>

                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        // Need a standard route to reach orders. State could be passed if needed.
                                        navigate('/user-dashboard', { state: { tab: 'orders' } });
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    {t('orders')}
                                </button>
                            </div>

                            <div className="border-t border-gray-50 pt-1">
                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        logout();
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    {t('logout')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => openAuthModal('login')}
                    onMouseEnter={() => setIsLoginHovered(true)}
                    onMouseLeave={() => setIsLoginHovered(false)}
                    className="relative ml-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-xl hover:from-gray-900 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 group overflow-hidden"
                >
                    <span className="relative z-10">{t('login')}</span>
                    <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>

                    <span className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform transition-transform duration-1000 ${isLoginHovered ? 'translate-x-full' : '-translate-x-full'
                        }`}></span>
                </button>
            )}
        </div>
    );
};

// Add custom animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 0.5;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, 10px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    .animate-ripple {
        animation: ripple 0.5s ease-out;
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
    }
`;
document.head.appendChild(style);

export default Navbar;