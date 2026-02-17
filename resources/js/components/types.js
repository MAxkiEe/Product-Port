// Type Definitions (for documentation)
export const Product = {
    id: 0,
    name: '',
    price: 0,
    originalPrice: 0,
    category: '',
    rating: 0,
    reviews: 0,
    description: '',
    colors: [],
    stock: 0,
    images: [],
    specs: []
};

export const CartItem = {
    id: 0,
    name: '',
    price: 0,
    quantity: 0
};

export const Notification = {
    show: false,
    message: '',
    type: 'success'
};