import React, { useState, useEffect } from 'react';

const Notification = ({ notification }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(100);
    const [mouseOn, setMouseOn] = useState(false);
    const [exitAnimation, setExitAnimation] = useState('');

    useEffect(() => {
        if (notification.show) {
            setIsVisible(true);
            setProgress(100);
            setExitAnimation('');

            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev <= 0 || mouseOn) {
                        clearInterval(timer);
                        return prev;
                    }
                    return prev - 1;
                });
            }, 30);

            const hideTimer = setTimeout(() => {
                if (!mouseOn) {
                    setExitAnimation('animate-slideOut');
                    setTimeout(() => {
                        setIsVisible(false);
                        setExitAnimation('');
                    }, 300);
                }
            }, 3000);

            return () => {
                clearInterval(timer);
                clearTimeout(hideTimer);
            };
        }
    }, [notification.show, mouseOn]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div 
                className={`relative overflow-hidden bg-white border border-gray-200 shadow-md transform transition-all duration-300 hover:shadow-lg cursor-pointer ${exitAnimation}`}
                onMouseEnter={() => setMouseOn(true)}
                onMouseLeave={() => setMouseOn(false)}
                onClick={() => {
                    setExitAnimation('animate-slideOut');
                    setTimeout(() => {
                        setIsVisible(false);
                        setExitAnimation('');
                    }, 300);
                }}
            >
                {/* Content */}
                <div className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm text-gray-900 mb-1">
                                {notification.type === 'success' && 'สำเร็จ'}
                                {notification.type === 'error' && 'ข้อผิดพลาด'}
                                {notification.type === 'info' && 'แจ้งเตือน'}
                                {notification.type === 'warning' && 'คำเตือน'}
                            </p>
                            <p className="text-sm text-gray-600">
                                {notification.message}
                            </p>
                        </div>
                        
                        {/* Close Button */}
                        <button 
                            className="ml-4 text-gray-400 hover:text-gray-600 transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                setExitAnimation('animate-slideOut');
                                setTimeout(() => {
                                    setIsVisible(false);
                                    setExitAnimation('');
                                }, 300);
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-0.5 bg-gray-100">
                    <div 
                        className="h-full bg-gray-400 transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .animate-slideOut {
        animation: slideOut 0.3s ease-out forwards;
    }
`;
document.head.appendChild(style);

export default Notification;