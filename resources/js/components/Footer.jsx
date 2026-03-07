import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { socialLinks } from './data/ProductsData';

const Footer = ({ scrollToSection, aboutRef, productsRef, contactRef }) => {
    const { t } = useTranslation();
    const [hoveredLink, setHoveredLink] = useState(null);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const quickLinks = [
        { name: 'about', label: t('footer.about'), ref: aboutRef },
        { name: 'products', label: t('footer.products'), ref: productsRef },
        { name: 'contact', label: t('footer.contact'), ref: contactRef }
    ];

    const helpLinks = [
        t('footer.help_order'),
        t('footer.help_refund'),
        t('footer.help_faq')
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
                            <BrandSection t={t} />
                        </div>

                        {/* Quick Links - 2 cols */}
                        <div className="md:col-span-2">
                            <QuickLinksSection
                                links={quickLinks}
                                scrollToSection={scrollToSection}
                                hoveredLink={hoveredLink}
                                setHoveredLink={setHoveredLink}
                                t={t}
                            />
                        </div>

                        {/* Help Section - 2 cols */}
                        <div className="md:col-span-2">
                            <HelpSection
                                links={helpLinks}
                                hoveredLink={hoveredLink}
                                setHoveredLink={setHoveredLink}
                                t={t}
                            />
                        </div>

                        {/* Contact & Newsletter - 4 cols */}
                        <div className="md:col-span-4">
                            <ContactSection t={t} />
                            <NewsletterSection
                                email={email}
                                setEmail={setEmail}
                                handleSubscribe={handleSubscribe}
                                subscribed={subscribed}
                                t={t}
                            />
                        </div>
                    </div>

                    {/* Copyright */}
                    <Copyright currentYear={currentYear} t={t} />
                </div>
            </footer>

            {/* Back to Top Button */}
            <BackToTopButton show={showBackToTop} onClick={scrollToTop} />
        </>
    );
};

const BrandSection = ({ t }) => {
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
                <div className={`absolute -bottom-1 left-0 h-0.5 bg-gray-900 transition-all duration-300 ${logoHover ? 'w-full' : 'w-0'
                    }`} />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                {t('footer.brand_desc')}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{t('footer.orders_count')}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{t('footer.satisfaction_rate')}</span>
            </div>
        </div>
    );
};

const QuickLinksSection = ({ links, scrollToSection, hoveredLink, setHoveredLink, t }) => {
    return (
        <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {t('footer.quick_links')}
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

const HelpSection = ({ links, hoveredLink, setHoveredLink, t }) => {
    return (
        <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {t('footer.help')}
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

const ContactSection = ({ t }) => {
    return (
        <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {t('footer.contact_title')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
                <li>{t('footer.phone_val')}</li>
                <li>{t('footer.email_val')}</li>
                <li>{t('footer.address_val')}</li>
            </ul>
        </div>
    );
};

const NewsletterSection = ({ email, setEmail, handleSubscribe, subscribed, t }) => {
    return (
        <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {t('footer.newsletter')}
            </h3>
            <form onSubmit={handleSubscribe} className="relative max-w-xs">
                <input
                    type="email"
                    placeholder={t('footer.email_plh')}
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
                    {t('footer.subscribe_btn')}
                </button>

                {/* Success Message */}
                {subscribed && (
                    <div className="absolute -bottom-6 left-0 text-xs text-gray-600">
                        {t('footer.subscribed')}
                    </div>
                )}
            </form>
        </div>
    );
};

const Copyright = ({ currentYear, t }) => {
    return (
        <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                <p>{t('footer.copyright', { year: currentYear })}</p>
                <div className="flex space-x-4 mt-2 md:mt-0">
                    <span className="hover:text-gray-600 transition-colors cursor-pointer">{t('footer.privacy_policy')}</span>
                    <span>•</span>
                    <span className="hover:text-gray-600 transition-colors cursor-pointer">{t('footer.terms')}</span>
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