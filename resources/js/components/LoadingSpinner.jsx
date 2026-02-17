import React from 'react';

const LoadingSpinner = ({ isLoading, fullScreen = true, message = 'กำลังโหลด...' }) => {
    if (!isLoading) return null;

    const spinnerContent = (
        <div className="flex flex-col items-center justify-center space-y-4">
            {/* Modern Spinner */}
            <div className="relative">
                {/* Outer ring */}
                <div className="w-20 h-20 rounded-full border-4 border-gray-200"></div>
                
                {/* Inner spinning ring */}
                <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-gray-800 border-r-gray-800 animate-spin"></div>
                
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 bg-gray-800 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Loading Message */}
            {message && (
                <div className="text-center">
                    <p className="text-gray-800 font-medium animate-pulse">{message}</p>
                    <p className="text-sm text-gray-500 mt-1">กรุณารอสักครู่...</p>
                </div>
            )}

            {/* Progress Dots */}
            <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop with blur */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
                
                {/* Content */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-gray-100">
                    {/* Decorative top bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-600 via-gray-800 to-gray-600 rounded-t-2xl"></div>
                    
                    {spinnerContent}
                </div>
            </div>
        );
    }

    // Inline spinner
    return (
        <div className="flex items-center justify-center p-8">
            {spinnerContent}
        </div>
    );
};

// ทางเลือก: Simple Modern Spinner
export const SimpleSpinner = ({ isLoading, size = 'medium' }) => {
    if (!isLoading) return null;

    const sizeClasses = {
        small: 'w-8 h-8 border-2',
        medium: 'w-16 h-16 border-4',
        large: 'w-24 h-24 border-4'
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`${sizeClasses[size]} rounded-full border-gray-200 border-t-gray-800 border-r-gray-800 animate-spin`}></div>
        </div>
    );
};

// ทางเลือก: Spinner with Overlay
export const OverlaySpinner = ({ isLoading, message }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 transform animate-fadeIn">
                <div className="flex flex-col items-center space-y-6">
                    {/* Modern Spinner */}
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-gray-800 border-r-gray-800 animate-spin"></div>
                    </div>
                    
                    {/* Message */}
                    <div className="text-center">
                        <p className="text-gray-800 font-medium text-lg">{message || 'กำลังโหลด'}</p>
                        <p className="text-sm text-gray-500 mt-1">กรุณารอสักครู่...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ทางเลือก: Skeleton Loading (สำหรับ content)
export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
    const skeletons = {
        card: (
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-full animate-pulse mt-4"></div>
                </div>
            </div>
        ),
        text: (
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
            </div>
        ),
        avatar: (
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
            </div>
        ),
        button: (
            <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
        )
    };

    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index}>
                    {skeletons[type]}
                </div>
            ))}
        </div>
    );
};

// Animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);

export default LoadingSpinner;