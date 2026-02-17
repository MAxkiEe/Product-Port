import React, { useState, useEffect } from 'react';
import { features } from '../data/ProductsData';

const HomeSection = ({ homeRef, productsRef, scrollToSection }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // จำลองวิดิโอด้วย Slideshow
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
      
    },
    {
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200',
      
    },
    {
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200',
      
    },
    {
      image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=1200',
      
    }
  ];

  // Auto play slides
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  // เปลี่ยนสไลด์
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section ref={homeRef} className="relative">
      {/* Hero Section with Slideshow Background */}
      <div className="relative h-screen min-h-[600px] max-h-[800px] overflow-hidden">
        {/* Slideshow Background */}
        <div className="absolute inset-0 w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === activeSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center scale-110"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  transform: `scale(${index === activeSlide ? 1.1 : 1.2})`,
                  transition: 'transform 8s ease-out'
                }}
              >
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            </div>
          ))}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60"></div>

          {/* Slide Controls */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === activeSlide 
                    ? 'w-8 bg-white' 
                    : 'w-4 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>        

        

    
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="animate-fade-in-up">
                    

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="block">สินค้าคุณภาพ</span>
                <span className="text-white/90 text-4xl md:text-6xl">ที่คุณไว้วางใจ</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto backdrop-blur-sm bg-black/10 p-4 rounded-2xl">
                สัมผัสประสบการณ์ใหม่กับสินค้าสุดล้ำที่ออกแบบมาเพื่อคุณโดยเฉพาะ
                พร้อมฟีเจอร์ที่ครบครันและใช้งานง่าย
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => scrollToSection(productsRef, 'products')}
                  className="px-8 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  เริ่มต้นใช้งาน
                </button>
                <button className="px-8 py-3 bg-transparent border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                  ดูตัวอย่าง
                </button>
              </div>

              {/* Scroll Indicator */}
             
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-sm text-gray-400 uppercase tracking-wider">คุณสมบัติ</span>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mt-2">
              ทำไมต้องเลือกเรา
            </h2>
            <div className="w-16 h-0.5 bg-gray-200 mx-auto mt-6"></div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          75% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-gray-50 p-8 rounded-2xl transition-all duration-500 hover:shadow-xl animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Minimal Number */}
      <div className="relative mb-6">
        <span className="text-5xl font-light text-gray-300">
          {(index + 1).toString().padStart(2, '0')}
        </span>
        <div className={`absolute -top-2 -right-2 w-16 h-16 bg-gray-900/5 rounded-full transition-all duration-700 ${
          isHovered ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
        }`}></div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-medium text-gray-900 mb-3">
        {feature.title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {feature.desc}
      </p>

      {/* Animated Line */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-gray-200 overflow-hidden">
        <div className={`h-full bg-gray-900 transition-all duration-700 ${
          isHovered ? 'w-full' : 'w-0'
        }`}></div>
      </div>

      {/* Hover Effect */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${
        isHovered ? 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]' : ''
      }`}></div>
    </div>
  );
};

export default HomeSection;