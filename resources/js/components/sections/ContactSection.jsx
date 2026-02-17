import React, { useState, useEffect, useRef } from 'react';

const ContactSection = ({ contactRef }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [mapHovered, setMapHovered] = useState(false);
    const [mapExpanded, setMapExpanded] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    
    const formRef = useRef(null);
    const mapRef = useRef(null);

    // Animation on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fadeInUp');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'กรุณากรอกชื่อ-นามสกุล';
        } else if (formData.name.length < 2) {
            errors.name = 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร';
        }

        if (!formData.email.trim()) {
            errors.email = 'กรุณากรอกอีเมล';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
        } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/-/g, ''))) {
            errors.phone = 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก';
        }

        if (!formData.message.trim()) {
            errors.message = 'กรุณากรอกข้อความ';
        } else if (formData.message.length < 10) {
            errors.message = 'ข้อความต้องมีความยาวอย่างน้อย 10 ตัวอักษร';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            const firstError = Object.keys(formErrors)[0];
            const errorElement = document.getElementById(firstError);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setIsSubmitting(true);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Form submitted:', formData);
        setSubmitSuccess(true);
        setIsSubmitting(false);
        
        setTimeout(() => {
            setFormData({ name: '', email: '', phone: '', message: '' });
            setSubmitSuccess(false);
        }, 3000);
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0,3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0,3)}-${numbers.slice(3,6)}-${numbers.slice(6,10)}`;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setFormData({ ...formData, phone: formatted });
    };

    return (
        <section ref={contactRef} className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
            {/* Background Decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-100 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-200 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-gray-300 rounded-full filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 animate-on-scroll">
                    
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        พูดคุยกับเรา
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        ทีมงานของเราพร้อมให้บริการและตอบทุกคำถาม 24 ชั่วโมง
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8 animate-on-scroll">
                        <ContactInfo 
                            mapHovered={mapHovered}
                            setMapHovered={setMapHovered}
                            mapExpanded={mapExpanded}
                            setMapExpanded={setMapExpanded}
                            mapRef={mapRef}
                            onCopy={handleCopy}
                            copiedIndex={copiedIndex}
                        />
                    </div>

                    {/* Contact Form */}
                    <div className="animate-on-scroll">
                        <ContactForm 
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            formErrors={formErrors}
                            setActiveField={setActiveField}
                            activeField={activeField}
                            isSubmitting={isSubmitting}
                            submitSuccess={submitSuccess}
                            handlePhoneChange={handlePhoneChange}
                            formRef={formRef}
                        />
                    </div>
                </div>

                {/* Success Modal */}
                {submitSuccess && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl animate-slideInRight z-50">
                        <div className="flex items-center space-x-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>ส่งข้อความสำเร็จ! ทีมงานจะติดต่อกลับโดยเร็ว</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

const ContactInfo = ({ mapHovered, setMapHovered, mapExpanded, setMapExpanded, mapRef, onCopy, copiedIndex }) => {
    const contactDetails = [
        { 
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ), 
            text: "123 ถนนสุขุมวิท กรุงเทพฯ 10110", 
            label: "ที่อยู่" 
        },
        { 
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ), 
            text: "02-123-4567", 
            label: "โทรศัพท์" 
        },
        { 
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ), 
            text: "info@grayscale.com", 
            label: "อีเมล" 
        },
        { 
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ), 
            text: "จันทร์-ศุกร์ 9:00 - 18:00 น.", 
            label: "เวลาทำการ" 
        }
    ];

    const socialIcons = [
        { name: 'facebook', icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
        )},
        { name: 'twitter', icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
        )},
        { name: 'instagram', icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
            </svg>
        )},
        { name: 'line', icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.365 9.863c.349 0 .632.285.632.635 0 .35-.283.637-.632.637h-3.172v2.748h3.172c.349 0 .632.284.632.635 0 .35-.283.635-.632.635h-3.172v2.748h3.172c.349 0 .632.284.632.635 0 .35-.283.635-.632.635h-4.439c-.349 0-.632-.285-.632-.635V9.863c0-.35.283-.635.632-.635h4.439zM2.573 9.863c.349 0 .632.285.632.635v6.173c0 .35-.283.635-.632.635s-.632-.285-.632-.635V10.5c0-.35.283-.635.632-.635zm2.908 0c.349 0 .631.285.631.635v6.173c0 .35-.282.635-.631.635-.349 0-.632-.285-.632-.635V10.5c0-.35.283-.635.632-.635zm2.908 0c.349 0 .632.285.632.635v6.173c0 .35-.283.635-.632.635s-.632-.285-.632-.635V10.5c0-.35.283-.635.632-.635zm2.908 0c.349 0 .632.285.632.635v6.173c0 .35-.283.635-.632.635s-.632-.285-.632-.635V10.5c0-.35.283-.635.632-.635z" />
            </svg>
        )}
    ];

    return (
        <>
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-1 h-8 bg-gray-900 rounded-full mr-3"></span>
                    ช่องทางติดต่อ
                </h2>
                
                <div className="space-y-6">
                    {contactDetails.map((detail, index) => (
                        <ContactDetailItem 
                            key={index}
                            detail={detail}
                            index={index}
                            onCopy={onCopy}
                            copiedIndex={copiedIndex}
                        />
                    ))}
                </div>

                {/* Social Media Links */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">ติดตามเรา</h3>
                    <div className="flex space-x-4">
                        {socialIcons.map((social, index) => (
                            <button
                                key={social.name}
                                className="w-12 h-12 bg-gray-100 rounded-xl hover:bg-gray-200 flex items-center justify-center transform hover:scale-110 hover:rotate-6 transition-all duration-300 group"
                            >
                                <span className="text-gray-600 group-hover:text-gray-900 transition">
                                    {social.icon}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map */}
            <div 
                ref={mapRef}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 cursor-pointer transform hover:shadow-2xl ${
                    mapExpanded ? 'fixed inset-4 z-50' : 'h-64'
                }`}
                onMouseEnter={() => setMapHovered(true)}
                onMouseLeave={() => setMapHovered(false)}
                onClick={() => setMapExpanded(!mapExpanded)}
            >
                {mapHovered && !mapExpanded && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                            คลิกเพื่อขยายแผนที่
                        </span>
                    </div>
                )}
                
                <div className="relative w-full h-full bg-gradient-to-br from-gray-300 to-gray-400">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto mb-2 text-gray-700 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-gray-700 font-medium">Google Maps</span>
                            <p className="text-sm text-gray-600 mt-1">123 ถนนสุขุมวิท กรุงเทพฯ</p>
                        </div>
                    </div>
                    
                    {mapExpanded && (
                        <button 
                            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMapExpanded(false);
                            }}
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

const ContactDetailItem = ({ detail, index, onCopy, copiedIndex }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 transition-all duration-300 ${
                    isHovered ? 'bg-gray-900 text-white scale-110' : ''
                }`}>
                    {detail.icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{detail.label}</p>
                    <p className="text-gray-900 font-medium">{detail.text}</p>
                </div>
                
                {/* Copy button */}
                {detail.label !== 'ที่อยู่' && detail.label !== 'เวลาทำการ' && (
                    <button
                        onClick={() => onCopy(detail.text, index)}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                            copiedIndex === index
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-gray-200'
                        }`}
                    >
                        {copiedIndex === index ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                    </button>
                )}
            </div>
            
            {/* Animated underline on hover */}
            <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transform scale-x-0 transition-transform duration-300 ${
                isHovered ? 'scale-x-100' : ''
            }`}></div>
        </div>
    );
};

const ContactForm = ({ 
    formData, 
    setFormData, 
    onSubmit, 
    formErrors, 
    setActiveField, 
    activeField,
    isSubmitting,
    submitSuccess,
    handlePhoneChange,
    formRef
}) => {
    const formFields = [
        { 
            name: 'name', 
            label: 'ชื่อ-นามสกุล', 
            type: 'text', 
            placeholder: 'กรุณากรอกชื่อ',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            validation: 'ต้องมีอย่างน้อย 2 ตัวอักษร'
        },
        { 
            name: 'email', 
            label: 'อีเมล', 
            type: 'email', 
            placeholder: 'กรุณากรอกอีเมล',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            validation: 'example@email.com'
        },
        { 
            name: 'phone', 
            label: 'เบอร์โทรศัพท์', 
            type: 'tel', 
            placeholder: 'กรุณากรอกเบอร์โทร',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            validation: 'รูปแบบ 000-000-0000',
            onChange: handlePhoneChange
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-1 h-8 bg-gray-900 rounded-full mr-3"></span>
                ส่งข้อความถึงเรา
            </h2>
            
            <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
                {formFields.map(field => (
                    <FormInput 
                        key={field.name}
                        field={field}
                        value={formData[field.name]}
                        onChange={field.onChange || ((e) => setFormData({ ...formData, [e.target.name]: e.target.value }))}
                        error={formErrors[field.name]}
                        isActive={activeField === field.name}
                        setActiveField={setActiveField}
                    />
                ))}
                
                <div className="relative">
                    <label className="block text-gray-700 mb-2 font-medium">
                        ข้อความ
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <textarea 
                            name="message"
                            rows="4"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            onFocus={() => setActiveField('message')}
                            onBlur={() => setActiveField(null)}
                            className={`w-full bg-gray-50 text-gray-900 border-2 rounded-xl p-4 pr-12 transition-all duration-300 ${
                                formErrors.message 
                                    ? 'border-red-300 focus:border-red-500' 
                                    : 'border-gray-200 focus:border-gray-400'
                            } focus:outline-none focus:ring-4 focus:ring-gray-100`}
                            placeholder="พิมพ์ข้อความที่ต้องการติดต่อ..."
                        />
                        <span className="absolute right-4 bottom-4 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </span>
                    </div>
                    {formErrors.message && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.message}
                        </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                        * ข้อความต้องมีความยาวอย่างน้อย 10 ตัวอักษร
                    </p>
                </div>
                
                <button 
                    type="submit"
                    disabled={isSubmitting || submitSuccess}
                    className={`relative w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl overflow-hidden group ${
                        isSubmitting || submitSuccess
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-800'
                    }`}
                >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>กำลังส่ง...</span>
                            </>
                        ) : submitSuccess ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>ส่งสำเร็จ!</span>
                            </>
                        ) : (
                            <>
                                <span>ส่งข้อความ</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </span>
                    
                    {/* Shine effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                </button>

                {/* Form Status */}
                <p className="text-xs text-gray-400 text-center">
                    ข้อมูลของคุณจะถูกเก็บเป็นความลับและใช้สำหรับการติดต่อกลับเท่านั้น
                </p>
            </form>
        </div>
    );
};

const FormInput = ({ field, value, onChange, error, isActive, setActiveField }) => (
    <div className="relative">
        <label className="block text-gray-700 mb-2 font-medium">
            {field.label}
            <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
            <input 
                type={field.type}
                name={field.name}
                value={value}
                onChange={onChange}
                onFocus={() => setActiveField(field.name)}
                onBlur={() => setActiveField(null)}
                className={`w-full bg-gray-50 text-gray-900 border-2 rounded-xl p-4 pl-12 transition-all duration-300 ${
                    error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-gray-400'
                } focus:outline-none focus:ring-4 focus:ring-gray-100`}
                placeholder={field.placeholder}
            />
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                isActive ? 'scale-110 text-gray-900' : ''
            }`}>
                {field.icon}
            </span>
        </div>
        
        {/* Error Message */}
        {error && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
            </p>
        )}
        
        {/* Validation Hint */}
        {!error && isActive && (
            <p className="text-xs text-gray-400 mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {field.validation}
            </p>
        )}
    </div>
);

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes pulse-slow {
        0%, 100% {
            opacity: 0.2;
        }
        50% {
            opacity: 0.3;
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .animate-slideInRight {
        animation: slideInRight 0.3s ease-out forwards;
    }
    
    .animate-pulse-slow {
        animation: pulse-slow 4s ease-in-out infinite;
    }
    
    .animation-delay-2000 {
        animation-delay: 2s;
    }
`;
document.head.appendChild(style);

export default ContactSection;