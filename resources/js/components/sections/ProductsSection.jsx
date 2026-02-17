import React, { useState, useMemo } from 'react';

const ProductsSection = ({ productsRef, products, wishlist, toggleWishlist, addToCart, isLoading, setSelectedProduct, setShowProductModal }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [addedToCart, setAddedToCart] = useState({});

  const categories = useMemo(() => {
    return ['ทั้งหมด', ...new Set(products.map(p => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (activeFilter !== 'ทั้งหมด') {
      filtered = filtered.filter(p => p.category === activeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, activeFilter, searchTerm, sortBy]);

  const loadMore = () => {
    setVisibleProducts(prev => Math.min(prev + 3, filteredProducts.length));
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const calculateDiscount = (price, original) => {
    if (!original) return null;
    const discount = ((original - price) / original * 100).toFixed(0);
    return discount > 0 ? discount : null;
  };

  const getStockColor = (stock) => {
    if (stock === 0) return 'bg-red-500';
    if (stock < 5) return 'bg-orange-500';
    if (stock < 10) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <section ref={productsRef} className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            สินค้าของเรา
          </h2>
          <p className="text-gray-600 text-lg">
            เลือกซื้อสินค้าคุณภาพจากเรา
          </p>
          <div className="w-20 h-0.5 bg-gray-300 mx-auto mt-4"></div>
        </div>

        {/* Search */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 px-2 py-1 rounded"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${activeFilter === cat 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {cat}
                {cat !== 'ทั้งหมด' && (
                  <span className="ml-1 text-xs opacity-75">
                    ({products.filter(p => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl">
            <div className="text-sm text-gray-600">
              พบ {filteredProducts.length} สินค้า
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-gray-400 outline-none bg-white"
            >
              <option value="default">เรียงลำดับ</option>
              <option value="price-low">ราคา ต่ำ-สูง</option>
              <option value="price-high">ราคา สูง-ต่ำ</option>
              <option value="rating">คะแนนรีวิว</option>
              <option value="name">ชื่อสินค้า</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">ไม่พบสินค้าที่ค้นหา</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('ทั้งหมด');
              }}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              รีเซ็ตตัวกรอง
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.slice(0, visibleProducts).map((product) => {
                const discount = calculateDiscount(product.price, product.originalPrice);
                const isHovered = hoveredProduct === product.id;
                const isAdded = addedToCart[product.id];

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowProductModal(true);
                    }}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    {/* Product Image */}
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      {/* Stock Badge */}
                      {product.stock < 10 && (
                        <span className={`absolute top-2 left-2 ${getStockColor(product.stock)} text-white px-2 py-1 rounded text-xs`}>
                          {product.stock === 0 ? 'หมด' : `เหลือ ${product.stock}`}
                        </span>
                      )}

                      {/* Discount Badge */}
                      {discount && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                          ลด {discount}%
                        </span>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-sm hover:shadow-md transition"
                      >
                        <span className="text-gray-700">
                          {wishlist.includes(product.id) ? '♥' : '♡'}
                        </span>
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {product.name}
                        </h3>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">
                          {product.category}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < Math.floor(product.rating) ? 'text-gray-900' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-500 text-xs ml-2">
                          ({product.reviews})
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Price */}
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-gray-900">
                            ฿{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through text-sm ml-2">
                              ฿{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart */}
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition
                            ${product.stock === 0 
                              ? 'bg-gray-300 cursor-not-allowed' 
                              : isAdded
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                          disabled={product.stock === 0 || isLoading}
                        >
                          {isAdded ? 'เพิ่มแล้ว' : product.stock === 0 ? 'หมด' : 'เพิ่ม'}
                        </button>
                      </div>

                      {/* Stock Progress */}
                      {product.stock > 0 && product.stock < 20 && (
                        <div className="mt-3">
                          <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getStockColor(product.stock)}`}
                              style={{ width: `${(product.stock / 20) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            เหลือน้อย
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {visibleProducts < filteredProducts.length && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  โหลดเพิ่ม ({filteredProducts.length - visibleProducts})
                </button>
              </div>
            )}
          </>
        )}

        {/* Stats */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 grid grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-white p-3 rounded-lg">
              <div className="font-bold text-gray-900">{products.length}</div>
              <div className="text-gray-600">สินค้าทั้งหมด</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-bold text-gray-900">
                {products.filter(p => p.stock > 0).length}
              </div>
              <div className="text-gray-600">มีในสต็อก</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-bold text-gray-900">
                ฿{Math.min(...products.map(p => p.price)).toLocaleString()}
              </div>
              <div className="text-gray-600">เริ่มต้น</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;