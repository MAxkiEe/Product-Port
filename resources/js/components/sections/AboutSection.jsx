import React, { useState, useEffect, useRef } from 'react';
import { teamMembers } from '../data/ProductsData';

const AboutSection = ({ aboutRef }) => {
    const [activeStat, setActiveStat] = useState(null);
    const statsRef = useRef([]);

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

    return (
        <section ref={aboutRef} className="relative py-24 overflow-hidden bg-white">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full filter blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-200 rounded-full filter blur-3xl opacity-20"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 animate-on-scroll">
                   
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        รู้จักเราให้มากขึ้น
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        กว่า 10 ปีที่เรามุ่งมั่นนำเสนอสินค้าคุณภาพสู่ผู้บริโภค
                    </p>
                </div>

                <CompanyStory activeStat={activeStat} setActiveStat={setActiveStat} statsRef={statsRef} />
                <MissionVision />
                <TeamSection />
            </div>
        </section>
    );
};

const CompanyStory = ({ activeStat, setActiveStat, statsRef }) => {
    const stats = [
        { value: "10+", label: "ปีที่ให้บริการ", icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )},
        { value: "50k+", label: "ลูกค้าที่ไว้วางใจ", icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        )},
        { value: "1000+", label: "สินค้าพร้อมจำหน่าย", icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        )}
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 animate-on-scroll">
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-8 bg-gray-900 rounded-full mr-3"></span>
                    เรื่องราวของเรา
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    เราเริ่มต้นจากความมุ่งมั่นที่จะนำเสนอสินค้าคุณภาพดีให้กับผู้บริโภค 
                    ด้วยประสบการณ์กว่า 10 ปีในวงการ ทำให้เราเข้าใจความต้องการของลูกค้า
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                    วันนี้เรามีทีมงานมืออาชีพพร้อมให้บริการ และคัดสรรสินค้าที่ดีที่สุดมาให้คุณ
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            ref={el => statsRef.current[index] = el}
                            onMouseEnter={() => setActiveStat(index)}
                            onMouseLeave={() => setActiveStat(null)}
                            className={`text-center p-4 rounded-xl transition-all duration-300 ${
                                activeStat === index 
                                    ? 'bg-gray-900 text-white scale-105 shadow-xl' 
                                    : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                        >
                            <div className={`flex justify-center mb-2 transition-colors duration-300 ${
                                activeStat === index ? 'text-white' : 'text-gray-600'
                            }`}>
                                {stat.icon}
                            </div>
                            <div className={`text-2xl font-bold transition-colors duration-300 ${
                                activeStat === index ? 'text-white' : 'text-gray-900'
                            }`}>
                                {stat.value}
                            </div>
                            <div className={`text-sm transition-colors duration-300 ${
                                activeStat === index ? 'text-gray-200' : 'text-gray-500'
                            }`}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image with overlay */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-96 rounded-2xl shadow-xl overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-32 h-32 text-gray-400 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MissionVision = () => {
    const [activeCard, setActiveCard] = useState(null);

    const cards = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "พันธกิจของเรา",
            description: "มอบสินค้าคุณภาพพร้อมบริการที่เป็นเลิศให้กับลูกค้าทุกคน"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            title: "วิสัยทัศน์",
            description: "เป็นผู้นำด้านอีคอมเมิร์ซอันดับหนึ่งในใจลูกค้า"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 animate-on-scroll">
            {cards.map((card, index) => (
                <div
                    key={index}
                    onMouseEnter={() => setActiveCard(index)}
                    onMouseLeave={() => setActiveCard(null)}
                    className={`relative p-8 rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden ${
                        activeCard === index 
                            ? 'bg-gray-900 text-white scale-[1.02] shadow-2xl' 
                            : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                    {/* Background decoration */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full filter blur-3xl opacity-0 transition-opacity duration-500 ${
                        activeCard === index ? 'opacity-20' : ''
                    }`}></div>

                    <div className="relative z-10">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                            activeCard === index 
                                ? 'bg-white text-gray-900 rotate-12' 
                                : 'bg-gray-200 text-gray-700'
                        }`}>
                            {card.icon}
                        </div>
                        <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                            activeCard === index ? 'text-white' : 'text-gray-900'
                        }`}>
                            {card.title}
                        </h3>
                        <p className={`text-lg leading-relaxed transition-colors duration-300 ${
                            activeCard === index ? 'text-gray-200' : 'text-gray-600'
                        }`}>
                            {card.description}
                        </p>
                    </div>

                    {/* Corner decoration */}
                    <div className={`absolute bottom-0 right-0 w-24 h-24 border-2 border-gray-300 rounded-tl-[100px] transition-opacity duration-500 ${
                        activeCard === index ? 'opacity-20' : 'opacity-0'
                    }`}></div>
                </div>
            ))}
        </div>
    );
};

const TeamSection = () => {
    const [hoveredMember, setHoveredMember] = useState(null);

    const teamData = teamMembers.map((num, index) => ({
        id: num,
        name: `พนักงาน ${num}`,
        position: ['ผู้ก่อตั้ง', 'ซีอีโอ', 'หัวหน้าทีมขาย', 'ผู้จัดการฝ่ายบริการ'][index] || 'ตำแหน่ง',
        bio: ' passionate about delivering the best experience to our customers.'
    }));

    return (
        <div className="animate-on-scroll">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">ทีมงานของเรา</h2>
                <p className="text-gray-600">พบกับทีมงานมืออาชีพที่พร้อมให้บริการคุณ</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamData.map((member, index) => (
                    <div
                        key={member.id}
                        onMouseEnter={() => setHoveredMember(index)}
                        onMouseLeave={() => setHoveredMember(null)}
                        className="group relative"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                        
                        <div className="relative text-center">
                            {/* Avatar with animation */}
                            <div className="relative mb-6">
                                <div className={`w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden transition-all duration-500 ${
                                    hoveredMember === index ? 'scale-110 shadow-2xl' : 'shadow-lg'
                                }`}>
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className={`w-20 h-20 text-gray-400 transition-all duration-500 ${
                                            hoveredMember === index ? 'scale-110 text-white' : ''
                                        }`} fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Social links on hover */}
                                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 transition-all duration-500 ${
                                    hoveredMember === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}>
                                    {['facebook', 'twitter', 'linkedin'].map((social, i) => (
                                        <button
                                            key={i}
                                            className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                {social === 'facebook' && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />}
                                                {social === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                                                {social === 'linkedin' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Info */}
                            <h3 className={`text-xl font-bold text-gray-900 mb-1 transition-colors duration-300 ${
                                hoveredMember === index ? 'text-gray-700' : ''
                            }`}>
                                {member.name}
                            </h3>
                            <p className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                                hoveredMember === index ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                                {member.position}
                            </p>
                            <p className={`text-sm max-w-xs mx-auto transition-all duration-300 ${
                                hoveredMember === index ? 'text-gray-600 opacity-100' : 'text-gray-400 opacity-0'
                            }`}>
                                {member.bio}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

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
    
    .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out forwards;
    }
`;
document.head.appendChild(style);

export default AboutSection;