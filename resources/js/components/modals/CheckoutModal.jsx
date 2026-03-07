import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Swal from 'sweetalert2';

const CheckoutModal = ({ show, onClose, cartItems, totalItems, subtotal, shipping, discount, total, onOrderSuccess }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1); // 1: Shipping & Payment, 2: Processing, 3: Success
    const [formData, setFormData] = useState({
        shipping_address: '',
        contact_phone: '',
        payment_method: 'qr'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStep(2);

        try {
            // 1. Create Order
            const orderRes = await axios.post('/api/checkout', {
                items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
                shipping_address: formData.shipping_address,
                contact_phone: formData.contact_phone,
                total_amount: total,
                discount_amount: discount,
                shipping_cost: shipping
            });

            const orderId = orderRes.data.order_id;

            // 2. Process Payment (Mock)
            await axios.post('/api/payment/process', {
                order_id: orderId,
                payment_method: formData.payment_method
            });

            setStep(3);
            if (onOrderSuccess) onOrderSuccess();
        } catch (error) {
            console.error('Checkout failed', error);
            setStep(1);
            setIsLoading(false);
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Something went wrong with your order.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => step !== 2 && onClose()}></div>

            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                {step === 1 && (
                    <form onSubmit={handleCheckout} className="flex flex-col md:flex-row h-full max-h-[90vh]">
                        {/* Left: Form */}
                        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('cart.checkout_title')}</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{t('cart.shipping_info')}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cart.address_label')}</label>
                                            <textarea
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none h-24"
                                                placeholder={t('cart.address_plh')}
                                                value={formData.shipping_address}
                                                onChange={e => setFormData({ ...formData, shipping_address: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cart.phone_label')}</label>
                                            <input
                                                type="tel" required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                                placeholder={t('cart.phone_plh')}
                                                value={formData.contact_phone}
                                                onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{t('cart.payment_method')}</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: 'qr', label: t('cart.payment_qr'), icon: '📱' },
                                            { id: 'card', label: t('cart.payment_card'), icon: '💳' },
                                            { id: 'cod', label: t('cart.payment_cod'), icon: '💵' }
                                        ].map(method => (
                                            <label key={method.id} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.payment_method === method.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                                <input
                                                    type="radio" name="payment" className="hidden"
                                                    value={method.id} checked={formData.payment_method === method.id}
                                                    onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                                                />
                                                <span className="text-2xl mr-3">{method.icon}</span>
                                                <span className={`font-semibold ${formData.payment_method === method.id ? 'text-blue-700' : 'text-gray-700'}`}>{method.label}</span>
                                                {formData.payment_method === method.id && (
                                                    <div className="ml-auto w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Summary */}
                        <div className="w-full md:w-72 bg-gray-50 p-6 md:p-8 border-l border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-6">{t('cart.order_summary')}</h3>
                            <div className="space-y-3 text-sm text-gray-600 mb-6">
                                <div className="flex justify-between">
                                    <span>{t('cart.subtotal')}</span>
                                    <span>฿{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t('cart.shipping')}</span>
                                    <span>{shipping === 0 ? t('cart.free') : `฿${shipping}`}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>{t('cart.discount')}</span>
                                        <span>-฿{discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>{t('cart.total')}</span>
                                        <span>฿{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? t('cart.processing') : t('cart.place_order')}
                            </button>
                            <button
                                type="button" onClick={onClose}
                                className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition"
                            >
                                {t('cart.back_to_cart')}
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <div className="p-16 flex flex-col items-center justify-center text-center">
                        <div className="relative w-20 h-20 mb-8">
                            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('cart.processing')}</h2>
                        <p className="text-gray-500">{t('cart.order_placed_desc') || 'Please wait while we process your request.'}</p>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-16 flex flex-col items-center justify-center text-center animate-fade-in">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t('cart.payment_success')}</h2>
                        <p className="text-gray-600 mb-8 max-w-sm">{t('cart.order_placed')}</p>

                        <div className="space-y-3 w-full max-w-xs">
                            <button
                                onClick={() => { onClose(); window.location.href = '/user-dashboard'; }}
                                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold shadow-xl hover:bg-gray-800 transition"
                            >
                                {t('cart.view_my_orders')}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-2 text-gray-500 hover:text-gray-700 font-medium transition"
                            >
                                {t('user_dashboard.back_home')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;
