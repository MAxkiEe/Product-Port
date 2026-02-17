import React, { useState } from 'react';

const CartModal = ({ showCart, setShowCart, cartItems, removeFromCart, updateCartQuantity }) => {
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 50;
    const discount = promoApplied ? subtotal * 0.1 : 0; // 10% discount
    const total = subtotal + shipping - discount;

    return (
        <div className={`fixed inset-0 z-50 transition-all duration-500 ${showCart ? 'visible' : 'invisible'}`}>
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                    showCart ? 'opacity-50' : 'opacity-0'
                }`}
                onClick={() => setShowCart(false)}
            />
            
            {/* Cart Panel */}
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-gray-50 to-white shadow-2xl transform transition-transform duration-500 ease-out ${
                showCart ? 'translate-x-0' : 'translate-x-full'
            }`}>
                {/* Header */}
                <div className="relative bg-white border-b border-gray-200 p-6">
                    <button 
                        onClick={() => setShowCart(false)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center group"
                    >
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    <h2 className="text-center">
                        <span className="text-2xl font-bold text-gray-900">ตะกร้าสินค้า</span>
                        <span className="ml-2 text-sm font-medium text-gray-500">
                            ({cartItems.length} {cartItems.length === 1 ? 'รายการ' : 'รายการ'})
                        </span>
                    </h2>
                </div>

                {/* Cart Items */}
                <div className="h-[calc(100vh-320px)] overflow-y-auto px-6 py-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        cartItems.map(item => (
                            <CartItem 
                                key={item.id} 
                                item={item} 
                                removeFromCart={removeFromCart}
                                updateCartQuantity={updateCartQuantity}
                            />
                        ))
                    )}
                </div>

                {/* Promo Code */}
                {cartItems.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                placeholder="รหัสส่วนลด"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition"
                            />
                            <button
                                onClick={() => {
                                    if (promoCode === 'SAVE10') {
                                        setPromoApplied(true);
                                    }
                                }}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                            >
                                ใช้
                            </button>
                        </div>
                        {promoApplied && (
                            <p className="text-green-600 text-sm mt-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                ใช้โค้ดส่วนลด 10% เรียบร้อย
                            </p>
                        )}
                    </div>
                )}

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 space-y-4">
                        {/* Summary */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>ยอดรวมสินค้า</span>
                                <span>฿{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>ค่าจัดส่ง</span>
                                <span className={shipping === 0 ? 'text-green-600' : ''}>
                                    {shipping === 0 ? 'ฟรี' : `฿${shipping}`}
                                </span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>ส่วนลด</span>
                                    <span>-฿{discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>ยอดรวมทั้งสิ้น</span>
                                    <span>฿{total.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    รวมภาษีมูลค่าเพิ่มแล้ว
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl">
                                ดำเนินการชำระเงิน
                            </button>
                            <button 
                                onClick={() => setShowCart(false)}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                            >
                                เลือกสินค้าเพิ่มเติม
                            </button>
                        </div>

                        {/* Payment Methods */}
                        <div className="flex justify-center space-x-2 pt-2">
                            <div className="w-10 h-6 bg-gray-200 rounded"></div>
                            <div className="w-10 h-6 bg-gray-200 rounded"></div>
                            <div className="w-10 h-6 bg-gray-200 rounded"></div>
                            <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">ตะกร้าของคุณว่างเปล่า</h3>
        <p className="text-gray-500 mb-8">เพิ่มสินค้าลงในตะกร้าเพื่อเริ่มต้นช้อปปิ้ง</p>
        <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg">
            เริ่มช้อปปิ้ง
        </button>
    </div>
);

const CartItem = ({ item, removeFromCart, updateCartQuantity }) => (
    <div className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div className="flex gap-4">
            {/* Product Image Placeholder */}
            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0"></div>
            
            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">฿{item.price.toLocaleString()}</p>
                    </div>
                    <button 
                        onClick={() => removeFromCart(item.id)}
                        className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all"
                    >
                        <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                        <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition"
                            disabled={item.quantity <= 1}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                        <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                    <span className="font-bold text-gray-900">
                        ฿{(item.price * item.quantity).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    </div>
);

export default CartModal;