import React, { useState, useRef, useEffect } from "react";
import Navbar from './Navbar';
import HomeSection from './sections/HomeSection';
import ProductsSection from './sections/ProductsSection';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';
import Footer from './Footer';
import CartModal from './modals/CartModal';
import SearchModal from './modals/SearchModal';
import ProductModal from './modals/ProductModal';
import CheckoutModal from './modals/CheckoutModal';
import Notification from './Notification';
import LoadingSpinner from './LoadingSpinner';
import { products } from './data/ProductsData';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Index() {
    const { user, logout, openAuthModal } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // State Management
    const [cartCount, setCartCount] = useState(0);
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [wishlist, setWishlist] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    // Refs for sections
    const homeRef = useRef(null);
    const productsRef = useRef(null);
    const aboutRef = useRef(null);
    const contactRef = useRef(null);

    // Scroll to section
    const scrollToSection = (sectionRef, sectionName) => {
        setActiveSection(sectionName);
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    // Detect active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                { ref: homeRef, name: 'home' },
                { ref: productsRef, name: 'products' },
                { ref: aboutRef, name: 'about' },
                { ref: contactRef, name: 'contact' }
            ];

            for (const section of sections) {
                if (section.ref.current) {
                    const rect = section.ref.current.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(section.name);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cart Functions
    const addToCart = (product, quantity = 1) => {
        if (!user) {
            return openAuthModal('login');
        }

        setIsLoading(true);
        setTimeout(() => {
            const existingItem = cartItems.find(item => item.id === product.id);

            if (existingItem) {
                setCartItems(cartItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                ));
            } else {
                setCartItems([...cartItems, { ...product, quantity }]);
            }

            setCartCount(cartCount + quantity);
            showNotification(t('added_to_cart'), 'success');
            setIsLoading(false);
        }, 500);
    };

    const removeFromCart = (productId) => {
        const item = cartItems.find(item => item.id === productId);
        setCartItems(cartItems.filter(item => item.id !== productId));
        setCartCount(cartCount - item.quantity);
        showNotification(t('removed_from_cart'), 'info');
    };

    const updateCartQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setCartItems(cartItems.map(item => {
            if (item.id === productId) {
                const diff = newQuantity - item.quantity;
                setCartCount(cartCount + diff);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
        setCartCount(0);
    };

    // Wishlist Functions
    const toggleWishlist = (productId) => {
        if (!user) {
            return openAuthModal('login');
        }

        if (wishlist.includes(productId)) {
            setWishlist(wishlist.filter(id => id !== productId));
            showNotification(t('removed_from_wishlist'), 'info');
        } else {
            setWishlist([...wishlist, productId]);
            showNotification(t('added_to_wishlist'), 'success');
        }
    };

    // Notification
    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar
                activeSection={activeSection}
                scrollToSection={scrollToSection}
                homeRef={homeRef}
                productsRef={productsRef}
                aboutRef={aboutRef}
                contactRef={contactRef}
                setShowSearch={setShowSearch}
                setShowCart={setShowCart}
                cartCount={cartCount}
            />

            <main>
                <HomeSection
                    homeRef={homeRef}
                    productsRef={productsRef}
                    scrollToSection={scrollToSection}
                />

                <ProductsSection
                    productsRef={productsRef}
                    products={products}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    addToCart={addToCart}
                    isLoading={isLoading}
                    setSelectedProduct={setSelectedProduct}
                    setShowProductModal={setShowProductModal}
                />

                <AboutSection aboutRef={aboutRef} />

                <ContactSection contactRef={contactRef} />
            </main>

            <Footer
                scrollToSection={scrollToSection}
                aboutRef={aboutRef}
                productsRef={productsRef}
                contactRef={contactRef}
            />

            {/* Modals */}
            <CartModal
                showCart={showCart}
                setShowCart={setShowCart}
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateCartQuantity={updateCartQuantity}
                onCheckout={() => setShowCheckout(true)}
            />

            <SearchModal
                showSearch={showSearch}
                setShowSearch={setShowSearch}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                products={products}
                onSelectProduct={(product) => {
                    setSelectedProduct(product);
                    setShowProductModal(true);
                }}
            />

            <ProductModal
                showProductModal={showProductModal}
                setShowProductModal={setShowProductModal}
                selectedProduct={selectedProduct}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                addToCart={addToCart}
                isLoading={isLoading}
            />

            <CheckoutModal
                show={showCheckout}
                onClose={() => setShowCheckout(false)}
                cartItems={cartItems}
                totalItems={cartCount}
                subtotal={cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
                shipping={cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) > 5000 ? 0 : 100}
                discount={0}
                total={
                    cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) +
                    (cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) > 5000 ? 0 : 100)
                }
                onOrderSuccess={() => {
                    clearCart();
                }}
            />

            <Notification notification={notification} />
            <LoadingSpinner isLoading={isLoading} />
        </div>
    );
}
