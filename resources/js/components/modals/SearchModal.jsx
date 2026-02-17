import React, { useState, useEffect, useRef } from 'react';

const SearchModal = ({ showSearch, setShowSearch, searchQuery, setSearchQuery, products, onSelectProduct }) => {
    const [recentSearches, setRecentSearches] = useState([]);
    const [popularSearches] = useState(['สมาร์ทโฟน', 'แล็ปท็อป', 'หูฟัง', 'แท็บเล็ต', 'อุปกรณ์เสริม']);
    const inputRef = useRef(null);
    
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Focus input when modal opens
    useEffect(() => {
        if (showSearch && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [showSearch]);

    // Save recent search
    const handleSearch = (term) => {
        if (term.trim()) {
            setRecentSearches(prev => {
                const updated = [term, ...prev.filter(t => t !== term)].slice(0, 5);
                return updated;
            });
        }
    };

    return (
        <div 
            className={`fixed inset-0 z-50 transition-all duration-500 ${
                showSearch ? 'visible' : 'invisible'
            }`}
        >
            {/* Backdrop with blur */}
            <div 
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
                    showSearch ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setShowSearch(false)}
            />

            {/* Modal */}
            <div className={`relative max-w-2xl mx-auto mt-20 transform transition-all duration-500 ${
                showSearch ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
            }`}>
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="relative p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">ค้นหาสินค้า</h2>
                            </div>
                            <button 
                                onClick={() => setShowSearch(false)}
                                className="w-10 h-10 rounded-2xl hover:bg-gray-100 flex items-center justify-center group transition"
                            >
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="p-6">
                        <div className="relative">
                            <input 
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && searchQuery.trim()) {
                                        handleSearch(searchQuery);
                                    }
                                }}
                                placeholder="พิมพ์ชื่อสินค้า หรือหมวดหมู่ที่ต้องการค้นหา..."
                                className="w-full bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:border-gray-400 focus:outline-none transition placeholder-gray-400"
                            />
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search Stats */}
                    {searchQuery && (
                        <div className="px-6 pb-2">
                            <p className="text-sm text-gray-500">
                                พบ {filteredProducts.length} รายการ สำหรับ "{searchQuery}"
                            </p>
                        </div>
                    )}

                    {/* Quick Searches */}
                    {!searchQuery && (
                        <div className="px-6 pb-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-700">ค้นหาล่าสุด</h3>
                                {recentSearches.length > 0 && (
                                    <button 
                                        onClick={() => setRecentSearches([])}
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        ล้างทั้งหมด
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {recentSearches.length > 0 ? (
                                    recentSearches.map((term, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSearchQuery(term);
                                                handleSearch(term);
                                            }}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-700 transition flex items-center space-x-1 group"
                                        >
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{term}</span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400">ไม่มีประวัติการค้นหา</p>
                                )}
                            </div>

                            <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-3">ค้นหายอดนิยม</h3>
                            <div className="flex flex-wrap gap-2">
                                {popularSearches.map((term, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSearchQuery(term);
                                            handleSearch(term);
                                        }}
                                        className="px-4 py-2 bg-white border border-gray-200 hover:border-gray-400 rounded-xl text-sm text-gray-700 transition shadow-sm hover:shadow"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search Results */}
                    <div className="max-h-80 overflow-y-auto px-6 pb-6">
                        {searchQuery ? (
                            filteredProducts.length > 0 ? (
                                <div className="space-y-2">
                                    {filteredProducts.map(product => (
                                        <SearchResultItem 
                                            key={product.id} 
                                            product={product} 
                                            onClick={() => {
                                                onSelectProduct(product);
                                                handleSearch(product.name);
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 font-medium">ไม่พบสินค้าที่ค้นหา</p>
                                    <p className="text-sm text-gray-400 mt-1">ลองค้นหาด้วยคำอื่นดูนะคะ</p>
                                </div>
                            )
                        ) : (
                            /* Suggestions */
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-700">สินค้าแนะนำ</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {products.slice(0, 4).map(product => (
                                        <div
                                            key={product.id}
                                            onClick={() => {
                                                onSelectProduct(product);
                                                handleSearch(product.name);
                                            }}
                                            className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl cursor-pointer transition"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex-shrink-0"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                                <p className="text-xs text-gray-500">฿{product.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 p-4 bg-gray-50">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                                <span>↑↓ เลือก</span>
                                <span>↵ เข้า</span>
                                <span>ESC ปิด</span>
                            </div>
                            <span>ค้นหาสินค้าทั้งหมด {products.length} รายการ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SearchResultItem = ({ product, onClick }) => (
    <div 
        className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md"
        onClick={onClick}
    >
        <div className="flex items-center space-x-4">
            {/* Product Image Placeholder */}
            <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex-shrink-0"></div>
            
            <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 transition">
                    {product.name}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                <div className="flex items-center mt-1 space-x-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-3 h-3 ${
                                    i < Math.floor(product.rating) ? 'text-gray-700' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>
            </div>
        </div>
        
        <div className="text-right">
            <span className="text-lg font-bold text-gray-900">฿{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
                <p className="text-xs text-gray-400 line-through">฿{product.originalPrice.toLocaleString()}</p>
            )}
        </div>

        {/* Quick add button on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition ml-4">
            <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-900 hover:text-white transition group/btn">
                <svg className="w-4 h-4 text-gray-600 group-hover/btn:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    </div>
);

export default SearchModal;