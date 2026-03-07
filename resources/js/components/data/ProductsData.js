// Products Data
export const products = Array.from({ length: 6 }).map((_, index) => ({
    id: index + 1,
    name: `Product Name ${index + 1}`,
    price: 9990,
    originalPrice: 12990,
    categoryKey: index % 3 === 0 ? 'products_section.category_smartphone' : index % 3 === 1 ? 'products_section.category_laptop' : 'products_section.category_accessories',
    rating: 4.5,
    reviews: Math.floor(Math.random() * 100) + 20,
    descriptionKey: 'products_section.short_desc',
    colors: ['white', 'gray-200', 'gray-400', 'gray-600'],
    stock: Math.floor(Math.random() * 50) + 10,
    images: ['main', '1', '2', '3'],
    specsKeys: [
        'products_section.spec_screen',
        'products_section.spec_battery',
        'products_section.spec_os',
        'products_section.spec_camera'
    ]
}));

export const features = [
    { icon: "⭐", titleKey: "home_section.features.premium.title", descKey: "home_section.features.premium.desc" },
    { icon: "🚚", titleKey: "home_section.features.delivery.title", descKey: "home_section.features.delivery.desc" },
    { icon: "🛡️", titleKey: "home_section.features.warranty.title", descKey: "home_section.features.warranty.desc" },
    { icon: "💯", titleKey: "home_section.features.satisfaction.title", descKey: "home_section.features.satisfaction.desc" }
];

export const teamMembers = [1, 2, 3, 4];
export const socialLinks = [1, 2, 3];