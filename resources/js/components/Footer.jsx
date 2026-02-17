import React, { useState } from 'react';
import { socialLinks } from './data/ProductsData';

const Footer = ({ scrollToSection, aboutRef, productsRef, contactRef }) => {
    const [hoveredLink, setHoveredLink] = useState(null);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    
    const quickLinks = [
        { name: 'about', label: 'เกี่ยวกับเรา', ref: aboutRef },
        { name: 'products', label: 'สินค้า', ref: productsRef },
        { name: 'contact', label: 'ติดต่อ', ref: contactRef }
    ];

    const helpLinks = [
        'วิธีการสั่งซื้อ',
        'นโยบายการคืนเงิน',
        'คำถามที่พบบ่อย'
    ];

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Check scroll position for back to top button
    React.useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currentYear = new Date().getFullYear();

    return (
        <>
            <footer className="bg-white border-t border-gray-200 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Main Footer Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        
                        {/* Brand Section - 4 cols */}
                        <div className="md:col-span-4">
                            <BrandSection />
                        </div>

                        {/* Quick Links - 2 cols */}
                        <div className="md:col-span-2">
                            <QuickLinksSection 
                                links={quickLinks} 
                                scrollToSection={scrollToSection}
                                hoveredLink={hoveredLink}
                                setHoveredLink={setHoveredLink}
                            />
                        </div>

                        {/* Help Section - 2 cols */}
                        <div className="md:col-span-2">
                            <HelpSection 
                                links={helpLinks}
                                hoveredLink={hoveredLink}
                                setHoveredLink={setHoveredLink}
                            />
                        </div>

                        {/* Contact & Newsletter - 4 cols */}
                        <div className="md:col-span-4">
                            <ContactSection />
                            <NewsletterSection 
                                email={email}
                                setEmail={setEmail}
                                handleSubscribe={handleSubscribe}
                                subscribed={subscribed}
                            />
                        </div>
                    </div>

                    {/* Copyright */}
                    <Copyright currentYear={currentYear} />
                </div>
            </footer>

            {/* Back to Top Button */}
            <BackToTopButton show={showBackToTop} onClick={scrollToTop} />
        </>
    );
};

const BrandSection = () => {
    const [logoHover, setLogoHover] = useState(false);

    return (
        <div className="space-y-4">
            <div 
                className="relative inline-block"
                onMouseEnter={() => setLogoHover(true)}
                onMouseLeave={() => setLogoHover(false)}
            >
                <h3 className="text-xl font-light tracking-wider text-gray-900">
                    <span className="font-bold">LO</span>GO
                </h3>
                <div className={`absolute -bottom-1 left-0 h-0.5 bg-gray-900 transition-all duration-300 ${
                    logoHover ? 'w-full' : 'w-0'
                }`} />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                เราคือผู้นำด้านสินค้าคุณภาพ ที่ใส่ใจทุกรายละเอียด เพื่อมอบประสบการณ์ที่ดีที่สุดให้กับคุณ
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>10K+ คำสั่งซื้อ</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>ถูกใจ 95%</span>
            </div>
        </div>
    );
};

const QuickLinksSection = ({ links, scrollToSection, hoveredLink, setHoveredLink }) => {
    return (
        <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                ลิงก์ด่วน
            </h3>
            <ul className="space-y-3">
                {links.map(link => (
                    <li key={link.name}>
                        <button 
                            onClick={() => scrollToSection(link.ref, link.name)}
                            onMouseEnter={() => setHoveredLink(link.name)}
                            onMouseLeave={() => setHoveredLink(null)}
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {link.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const HelpSection = ({ links, hoveredLink, setHoveredLink }) => {
    return (
        <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                ช่วยเหลือ
            </h3>
            <ul className="space-y-3">
                {links.map((link, index) => (
                    <li key={index}>
                        <button
                            onMouseEnter={() => setHoveredLink(`help-${index}`)}
                            onMouseLeave={() => setHoveredLink(null)}
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {link}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ContactSection = () => {
    return (
        <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                ติดต่อ
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
                <li>โทร: 02-123-4567</li>
                <li>อีเมล: contact@grayscale.com</li>
                <li>ที่อยู่: 123 ถนนสุขุมวิท กรุงเทพฯ</li>
            </ul>
        </div>
    );
};

const NewsletterSection = ({ email, setEmail, handleSubscribe, subscribed }) => {
    return (
        <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                จดหมายข่าว
            </h3>
            <form onSubmit={handleSubscribe} className="relative max-w-xs">
                <input
                    type="email"
                    placeholder="อีเมลของคุณ"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm 
                             focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                    required
                />
                <button
                    type="submit"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 
                             px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    ตกลง
                </button>
                
                {/* Success Message */}
                {subscribed && (
                    <div className="absolute -bottom-6 left-0 text-xs text-gray-600">
                ✓ สมัครเรียบร้อย
                    </div>
                )}
            </form>
        </div>
    );
};

const Copyright = ({ currentYear }) => {
    return (
        <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                <p>© {currentYear} logo. All rights reserved.</p>
                <div className="flex space-x-4 mt-2 md:mt-0">
                    <span className="hover:text-gray-600 transition-colors cursor-pointer">นโยบายส่วนตัว</span>
                    <span>•</span>
                    <span className="hover:text-gray-600 transition-colors cursor-pointer">ข้อกำหนด</span>
                </div>
            </div>
        </div>
    );
};

const BackToTopButton = ({ show, onClick }) => {
    if (!show) return null;
    
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 w-10 h-10 bg-white border border-gray-200 rounded-lg 
                     shadow-md hover:shadow-lg transition-all hover:scale-110 z-50
                     flex items-center justify-center text-gray-600 hover:text-gray-900"
            aria-label="Back to top"
        >
            ↑
        </button>
    );
};

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);

export default Footer;