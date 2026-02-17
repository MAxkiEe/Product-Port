import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client"; 
import "../css/app.css";

// Components
import Navbar from './components/Navbar';
import HomeSection from './components/sections/HomeSection';
import ProductsSection from './components/sections/ProductsSection';
import AboutSection from './components/sections/AboutSection';
import ContactSection from './components/sections/ContactSection';
import Footer from './components/Footer';
import CartModal from './components/modals/CartModal';
import SearchModal from './components/modals/SearchModal';
import ProductModal from './components/modals/ProductModal';
import Notification from './components/Notification';
import LoadingSpinner from './components/LoadingSpinner';

// Data
import { products } from './components/data/ProductsData';

function App() {
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
            showNotification('เพิ่มสินค้าลงตะกร้าเรียบร้อย', 'success');
            setIsLoading(false);
        }, 500);
    };

    const removeFromCart = (productId) => {
        const item = cartItems.find(item => item.id === productId);
        setCartItems(cartItems.filter(item => item.id !== productId));
        setCartCount(cartCount - item.quantity);
        showNotification('ลบสินค้าออกจากตะกร้าแล้ว', 'info');
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

    // Wishlist Functions
    const toggleWishlist = (productId) => {
        if (wishlist.includes(productId)) {
            setWishlist(wishlist.filter(id => id !== productId));
            showNotification('ลบออกจากรายการโปรด', 'info');
        } else {
            setWishlist([...wishlist, productId]);
            showNotification('เพิ่มในรายการโปรดแล้ว', 'success');
        }
    };

    // Notification
    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
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

            <Notification notification={notification} />
            <LoadingSpinner isLoading={isLoading} />
        </div>
    );
}

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-50px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    .animate-fade-in {
        animation: fadeIn 1s ease-out;
    }
    
    .animate-slide-in-left {
        animation: slideInLeft 1s ease-out;
    }
    
    .animate-slide-in-right {
        animation: slideInRight 1s ease-out;
    }
    
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// *** เพิ่มส่วนนี้เพื่อ render ลง DOM ***
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);