import React, { useState, useEffect } from 'react';

const ProductModal = ({ 
    showProductModal, 
    setShowProductModal, 
    selectedProduct, 
    wishlist, 
    toggleWishlist,
    addToCart,
    isLoading 
}) => {
    const [productQuantity, setProductQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('รายละเอียด');

    useEffect(() => {
        if (selectedProduct?.colors?.length > 0) {
            setSelectedColor(selectedProduct.colors[0]);
        }
    }, [selectedProduct]);

    if (!selectedProduct) return null;

    const discount = Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
            showProductModal ? 'visible' : 'invisible'
        }`}>
            {/* Backdrop with blur */}
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                    showProductModal ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setShowProductModal(false)}
            />

            {/* Modal */}
            <div className={`relative bg-white max-w-6xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 shadow-2xl rounded-2xl ${
                showProductModal ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
            }`}>
                {/* Close Button */}
                <button 
                    onClick={() => setShowProductModal(false)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-100 hover:border-gray-300 hover:shadow-md transition-all"
                >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col lg:flex-row h-full">
                    {/* Left Column - Images */}
                    <div className="lg:w-3/5 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                        <ProductImages 
                            product={selectedProduct}
                            wishlist={wishlist}
                            toggleWishlist={toggleWishlist}
                            selectedImage={selectedImage}
                            setSelectedImage={setSelectedImage}
                            discount={discount}
                        />
                    </div>

                    {/* Right Column - Info */}
                    <div className="lg:w-2/5 bg-white overflow-y-auto border-l border-gray-200 rounded-r-2xl">
                        <div className="p-6">
                            <ProductInfo 
                                product={selectedProduct}
                                productQuantity={productQuantity}
                                setProductQuantity={setProductQuantity}
                                selectedColor={selectedColor}
                                setSelectedColor={setSelectedColor}
                                addToCart={addToCart}
                                setShowProductModal={setShowProductModal}
                                isLoading={isLoading}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                discount={discount}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductImages = ({ product, wishlist, toggleWishlist, selectedImage, setSelectedImage, discount }) => {
    const images = [
        'bg-gradient-to-br from-gray-800 to-gray-900',
        'bg-gradient-to-br from-gray-700 to-gray-800',
        'bg-gradient-to-br from-gray-600 to-gray-700',
        'bg-gradient-to-br from-gray-700 to-gray-800',
        'bg-gradient-to-br from-gray-800 to-gray-900'
    ];

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative group">
                <div className={`${images[selectedImage]} h-96 rounded-2xl shadow-xl overflow-hidden`}>
                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div className="absolute top-4 left-4 bg-black text-white px-4 py-2 text-sm font-bold shadow-lg rounded-full">
                            -{discount}%
                        </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <button 
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all border border-gray-200"
                    >
                        <span className="text-2xl">
                            {wishlist.includes(product.id) ? '♥' : '♡'}
                        </span>
                    </button>

                    {/* Zoom indicator */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative rounded-xl overflow-hidden shadow-md transition-all ${
                            selectedImage === index 
                                ? 'ring-2 ring-black ring-offset-2 scale-105' 
                                : 'hover:scale-105 hover:shadow-lg'
                        }`}
                    >
                        <div className={`${images[index]} h-20 rounded-xl`}>
                            {selectedImage === index && (
                                <div className="absolute inset-0 border-2 border-white rounded-xl"></div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const ProductInfo = ({ 
    product, 
    productQuantity, 
    setProductQuantity, 
    selectedColor, 
    setSelectedColor,
    addToCart,
    setShowProductModal,
    isLoading,
    activeTab,
    setActiveTab,
    discount 
}) => {
    const tabs = ['รายละเอียด', 'สเปก', 'รีวิว'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                        {product.category}
                    </span>
                    <ProductRating rating={product.rating} reviews={product.reviews} />
                </div>
            </div>

            {/* Price */}
            <div className="border-y border-gray-200 py-4 bg-gray-50/50 -mx-6 px-6">
                <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold text-gray-900">
                        ฿{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                        <>
                            <span className="text-gray-400 line-through text-lg">
                                ฿{product.originalPrice.toLocaleString()}
                            </span>
                            <span className="text-sm font-medium text-gray-700 bg-gray-200 px-2.5 py-1 rounded-full">
                                -{discount}%
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} shadow-sm`} />
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                    {product.stock > 0 
                        ? `เหลือในสต็อก ${product.stock} ชิ้น` 
                        : 'สินค้าหมดชั่วคราว'
                    }
                </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed border-l-2 border-gray-300 pl-3 italic">
                {product.description}
            </p>

            {/* Colors */}
            {product.colors?.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">เลือกสี</h3>
                    <div className="flex flex-wrap gap-3">
                        {product.colors.map(color => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className="relative group"
                            >
                                <div 
                                    className={`w-10 h-10 rounded-full shadow-md transition-all ${
                                        selectedColor === color 
                                            ? 'ring-2 ring-black ring-offset-2 scale-110' 
                                            : 'group-hover:scale-105 group-hover:shadow-lg'
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                                {selectedColor === color && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">จำนวน</h3>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-full shadow-sm overflow-hidden">
                        <button 
                            onClick={() => setProductQuantity(p => Math.max(1, p - 1))}
                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 text-lg font-medium"
                            disabled={product.stock === 0}
                        >
                            −
                        </button>
                        <span className="w-14 text-center text-lg font-semibold text-gray-900">
                            {productQuantity}
                        </span>
                        <button 
                            onClick={() => setProductQuantity(p => Math.min(product.stock, p + 1))}
                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 text-lg font-medium"
                            disabled={product.stock === 0 || productQuantity >= product.stock}
                        >
                            +
                        </button>
                    </div>
                    
                    {product.stock > 0 && product.stock < 10 && (
                        <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                            เหลือน้อย
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <button 
                    onClick={() => {
                        addToCart(product, productQuantity);
                        setShowProductModal(false);
                    }}
                    disabled={isLoading || product.stock === 0}
                    className="flex-1 bg-gray-900 text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:bg-gray-300 flex items-center justify-center space-x-2"
                >
                    {isLoading ? (
                        <span>กำลังเพิ่ม...</span>
                    ) : (
                        <>
                            <span>🛒</span>
                            <span>เพิ่มตะกร้า</span>
                        </>
                    )}
                </button>
                <button 
                    className="flex-1 border-2 border-gray-900 text-gray-900 py-4 rounded-full font-medium hover:bg-gray-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                    disabled={product.stock === 0}
                >
                    ซื้อทันที
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex space-x-6">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 text-sm font-medium transition-all relative ${
                                activeTab === tab 
                                    ? 'text-gray-900' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content - Scrollable */}
            <div className="py-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {activeTab === 'รายละเอียด' && (
                    <div className="space-y-3">
                        <p className="font-medium text-gray-900">รายละเอียดสินค้า:</p>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2 text-gray-400">•</span>
                                <span>วัสดุคุณภาพสูง ผลิตจากโรงงานมาตรฐาน ISO 9001:2015 ที่ได้รับการรับรองระดับสากล</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-gray-400">•</span>
                                <span>ออกแบบมาเพื่อการใช้งานที่ทนทานและยาวนาน ด้วยเทคโนโลยีการผลิตที่ทันสมัย</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-gray-400">•</span>
                                <span>รับประกันสินค้า 1 ปี พร้อมบริการหลังการขายและศูนย์บริการทั่วประเทศ</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-gray-400">•</span>
                                <span>ผ่านการทดสอบคุณภาพจากห้องปฏิบัติการมาตรฐานก่อนจัดส่งทุกชิ้น</span>
                            </li>
                        </ul>
                    </div>
                )}
                {activeTab === 'สเปก' && (
                    <div className="space-y-3">
                        <p className="font-medium text-gray-900">ข้อมูลจำเพาะ:</p>
                        <ul className="space-y-3">
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-xs">ขนาดสินค้า</span>
                                <span className="text-gray-900">15.6 x 25.4 x 1.8 ซม. (กว้าง x ยาว x สูง)</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-xs">น้ำหนัก</span>
                                <span className="text-gray-900">1.8 กิโลกรัม พร้อมแบตเตอรี่ในตัว</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-xs">วัสดุ</span>
                                <span className="text-gray-900">อะลูมิเนียมอัลลอยเกรดการบิน + พลาสติก PC/ABS คุณภาพสูง</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-xs">สี</span>
                                <span className="text-gray-900">{product.colors?.join(', ') || 'ดำ / เทา / เงิน'}</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-xs">การเชื่อมต่อ</span>
                                <span className="text-gray-900">Bluetooth 5.3, USB-C, Wi-Fi 6E, NFC</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-xs">แบตเตอรี่</span>
                                <span className="text-gray-900">5000 mAh ใช้งานได้ต่อเนื่อง 12 ชั่วโมง</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-xs">ระบบปฏิบัติการ</span>
                                <span className="text-gray-900">รองรับ Windows 11 / macOS / iOS / Android</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-xs">การรับประกัน</span>
                                <span className="text-gray-900">2 ปี (รวมอะไหล่และค่าแรง)</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-xs">มาตรฐานการผลิต</span>
                                <span className="text-gray-900">ISO 9001, ISO 14001, RoHS, CE, FCC</span>
                            </li>
                        </ul>
                    </div>
                )}
                {activeTab === 'รีวิว' && (
                    <div className="text-center py-6">
                        <div className="text-4xl text-gray-300 mb-2">★★★</div>
                        <p className="text-gray-400">ยังไม่มีรีวิวสำหรับสินค้านี้</p>
                        <p className="text-xs text-gray-400 mt-2">มาเป็นคนแรกที่รีวิวสินค้านี้</p>
                    </div>
                )}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-3 gap-3 pt-3">
                <div className="bg-gray-50 p-3 rounded-xl text-center hover:shadow-md transition">
                    <div className="text-black text-xl mb-1">📦</div>
                    <p className="text-xs font-medium text-gray-900">ส่งฟรี</p>
                    <p className="text-xs text-gray-500">เมื่อครบ 5,000</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-center hover:shadow-md transition">
                    <div className="text-black text-xl mb-1">✓</div>
                    <p className="text-xs font-medium text-gray-900">รับประกัน</p>
                    <p className="text-xs text-gray-500">2 ปีเต็ม</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-center hover:shadow-md transition">
                    <div className="text-black text-xl mb-1">↩</div>
                    <p className="text-xs font-medium text-gray-900">คืนเงิน</p>
                    <p className="text-xs text-gray-500">ภายใน 7 วัน</p>
                </div>
            </div>
        </div>
    );
};

const ProductRating = ({ rating, reviews }) => (
    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-gray-900' : 'text-gray-300'}`}>
                    ★
                </span>
            ))}
        </div>
        <span className="text-xs text-gray-600">{reviews} รีวิว</span>
    </div>
);

export default ProductModal;