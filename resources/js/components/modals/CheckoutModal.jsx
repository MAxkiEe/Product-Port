import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Swal from 'sweetalert2';

import PromptPayQR from '../PromptPayQR';
import BankAccounts from '../BankAccounts';

const CheckoutModal = ({ show, onClose, cartItems, totalItems, subtotal, shipping, discount, total, onOrderSuccess }) => {
    const { t, i18n } = useTranslation();
    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
    const [formData, setFormData] = useState({
        shipping_address: '',
        contact_phone: '',
        payment_method: 'promptpay_omise' // Default to automated
    });
    const [slipFile, setSlipFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('promptpay_omise'); // promptpay_omise, card, manual_slip

    // Omise Card Data
    const [cardData, setCardData] = useState({
        name: '',
        number: '',
        expiration_month: '',
        expiration_year: '',
        security_code: ''
    });

    useEffect(() => {
        if (show) {
            const script = document.createElement('script');
            script.src = 'https://cdn.omise.co/omise.js';
            script.async = true;
            script.onload = () => {
                if (window.Omise) {
                    window.Omise.setPublicKey(import.meta.env.VITE_OMISE_PUBLIC_KEY || 'pkey_test_5y...');
                }
            };
            document.body.appendChild(script);
            return () => {
                const existingScript = document.querySelector('script[src="https://cdn.omise.co/omise.js"]');
                if (existingScript) document.body.removeChild(existingScript);
            };
        }
    }, [show]);

    const handleNextStep = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Create Order first
            const orderRes = await axios.post('/api/checkout', {
                items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
                shipping_address: formData.shipping_address,
                contact_phone: formData.contact_phone,
                total_amount: total,
                discount_amount: discount,
                shipping_cost: shipping
            });
            setOrderId(orderRes.data.order_id);

            // Sync Step 1 selection to Step 2 state
            if (formData.payment_method === 'qr') setPaymentMethod('promptpay_omise');
            else if (formData.payment_method === 'card') setPaymentMethod('card');
            else if (formData.payment_method === 'slip') setPaymentMethod('manual_slip');

            setStep(2);
        } catch (error) {
            Swal.fire({
                title: t('admin.error') || 'Error',
                text: error.response?.data?.message || 'Failed to create order',
                icon: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmPayment = async () => {
        setIsLoading(true);
        try {
            if (paymentMethod === 'manual_slip') {
                const data = new FormData();
                data.append('order_id', orderId);
                data.append('payment_method', 'manual_slip');
                if (slipFile) {
                    data.append('slip_image', slipFile);
                }
                await axios.post('/api/payment/process', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setStep(3);
                if (onOrderSuccess) onOrderSuccess();
            } else if (paymentMethod === 'card') {
                // Omise Credit Card
                window.Omise.createToken('card', {
                    name: cardData.name,
                    number: cardData.number,
                    expiration_month: parseInt(cardData.expiration_month),
                    expiration_year: parseInt(cardData.expiration_year),
                    security_code: cardData.security_code
                }, async (statusCode, response) => {
                    if (statusCode === 200) {
                        try {
                            const res = await axios.post('/api/omise/charge', {
                                order_id: orderId,
                                token: response.id,
                                amount: total
                            });
                            if (res.data.status === 'successful') {
                                setStep(3);
                                if (onOrderSuccess) onOrderSuccess();
                            } else if (res.data.authorize_uri) {
                                window.location.href = res.data.authorize_uri;
                            }
                        } catch (err) {
                            Swal.fire('Error', err.response?.data?.error || 'Charge failed', 'error');
                        } finally {
                            setIsLoading(false);
                        }
                    } else {
                        Swal.fire('Error', response.message, 'error');
                        setIsLoading(false);
                    }
                });
                return; // Exit here as Omise call is async
            } else if (paymentMethod === 'promptpay_omise') {
                // Omise PromptPay (Source)
                window.Omise.createSource('promptpay', {
                    amount: Math.round(total * 100),
                    currency: 'THB'
                }, async (statusCode, response) => {
                    if (statusCode === 200) {
                        try {
                            const res = await axios.post('/api/omise/charge', {
                                order_id: orderId,
                                source: response.id,
                                amount: total
                            });
                            // Usually returns authorize_uri for PromptPay QR to be displayed or redirected
                            if (res.data.authorize_uri) {
                                // For PromptPay, Omise might redirect to a page with a dynamic QR
                                window.location.href = res.data.authorize_uri;
                            } else {
                                setStep(3);
                                if (onOrderSuccess) onOrderSuccess();
                            }
                        } catch (err) {
                            Swal.fire('Error', err.response?.data?.error || 'Failed to create PromptPay source', 'error');
                        } finally {
                            setIsLoading(false);
                        }
                    } else {
                        Swal.fire('Error', response.message, 'error');
                        setIsLoading(false);
                    }
                });
                return;
            }
        } catch (error) {
            Swal.fire({
                title: t('admin.error') || 'Error',
                text: error.response?.data?.message || 'Payment failed',
                icon: 'error'
            });
        } finally {
            if (paymentMethod === 'manual_slip') setIsLoading(false);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleCancelOrder = async () => {
        const result = await Swal.fire({
            title: t('cart.cancel_confirm_title'),
            text: t('cart.cancel_confirm_text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: t('admin.delete') || 'Yes, cancel it!',
            cancelButtonText: t('admin.cancel') || 'Back'
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                await axios.post(`/api/orders/${orderId}/cancel`);
                setOrderId(null);
                onClose();
            } catch (error) {
                Swal.fire('Error', 'Failed to cancel order', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isLoading && onClose()}></div>

            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col md:flex-row max-h-[90vh]">
                {step === 1 && (
                    <>
                        <form onSubmit={handleNextStep} className="flex-1 p-6 md:p-8 overflow-y-auto">
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
                                            { id: 'qr', label: t('cart.payment_qr_auto') || 'PromptPay (Recommended)', icon: '📱' },
                                            { id: 'card', label: t('cart.payment_card') || 'Credit Card', icon: '💳' },
                                            { id: 'slip', label: t('cart.payment_bank_transfer') || 'Manual Bank Transfer', icon: '🏦' },
                                            { id: 'cod', label: t('cart.payment_cod') || 'Cash on Delivery', icon: '💵' }
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
                        </form>
                        <div className="w-full md:w-72 bg-gray-50 p-6 md:p-8 border-l border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-6">{t('cart.order_summary')}</h3>
                            <div className="space-y-3 text-sm text-gray-600 mb-6">
                                <div className="flex justify-between"><span>{t('cart.subtotal')}</span><span>฿{subtotal.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>{t('cart.shipping')}</span><span>{shipping === 0 ? t('cart.free') : `฿${shipping}`}</span></div>
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900"><span>{t('cart.total')}</span><span>฿{total.toLocaleString()}</span></div>
                                </div>
                            </div>
                            <button
                                onClick={handleNextStep}
                                disabled={isLoading || !formData.shipping_address || !formData.contact_phone}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? t('cart.processing') : t('cart.place_order')}
                            </button>
                            <button onClick={onClose} className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition">{t('cart.back_to_cart')}</button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <div className="p-8 w-full overflow-y-auto">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('cart.payment_title') || 'Payment Instruction'}</h2>
                            <p className="text-gray-500 text-sm">{t('cart.payment_desc') || 'Select your preferred payment method.'}</p>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
                            {[
                                { id: 'promptpay_omise', label: 'PromptPay', icon: '📱' },
                                { id: 'card', label: 'Credit Card', icon: '💳' },
                                { id: 'manual_slip', label: 'Manual Transfer', icon: '🏦' }
                            ].map(method => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${paymentMethod === method.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <span>{method.icon}</span>
                                    {method.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                {paymentMethod === 'promptpay_omise' && (
                                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-6 animate-fade-in text-center">
                                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 italic">PP</div>
                                        <h3 className="font-bold text-blue-900 mb-2">PromptPay Automated</h3>
                                        <p className="text-sm text-blue-700 leading-relaxed mb-4">ระบบจะสร้าง QR Code เฉพาะสำหรับคำสั่งซื้อนี้ คุณสามารถสแกนจ่ายและระบบจะตรวจสอบยอดเงินให้อัตโนมัติทันที</p>
                                        <div className="text-xs text-blue-400 font-bold uppercase tracking-widest">Instant Verification</div>
                                    </div>
                                )}

                                {paymentMethod === 'card' && (
                                    <div className="space-y-4 animate-fade-in mb-6">
                                        <div className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <div className="col-span-full">
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Cardholder Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="NAME SURNAME"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                                                    value={cardData.name}
                                                    onChange={e => setCardData({ ...cardData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-span-full">
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Card Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="0000 0000 0000 0000"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                                    value={cardData.number}
                                                    onChange={e => setCardData({ ...cardData, number: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">MM</label>
                                                    <input
                                                        type="text" placeholder="MM"
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                                        value={cardData.expiration_month}
                                                        onChange={e => setCardData({ ...cardData, expiration_month: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">YY</label>
                                                    <input
                                                        type="text" placeholder="YY"
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                                        value={cardData.expiration_year}
                                                        onChange={e => setCardData({ ...cardData, expiration_year: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">CVC</label>
                                                    <input
                                                        type="password" placeholder="***"
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                                        value={cardData.security_code}
                                                        onChange={e => setCardData({ ...cardData, security_code: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'manual_slip' && (
                                    <>
                                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-xs">1</div>
                                                <div className="text-sm text-blue-900 leading-tight">
                                                    <p className="font-bold mb-1">สแกนจ่ายหรือโอนเงิน</p>
                                                    <p className="opacity-75">โอนเงินเข้าบัญชีธนาคารด้านล่างหรือสแกนผ่าน QR Code</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 mt-4">
                                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-xs">2</div>
                                                <div className="text-sm text-blue-900 leading-tight">
                                                    <p className="font-bold mb-1">อัปโหลดหลักฐานการโอน</p>
                                                    <p className="opacity-75">หลังโอนเงินสำเร็จ กรุณาแนบรูปภาพสลิปที่ปุ่มด้านล่าง</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <label className="block">
                                                <span className="text-sm font-bold text-gray-700 block mb-2">{t('cart.upload_slip') || 'Upload Transfer Slip'}</span>
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setSlipFile(e.target.files[0])}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className={`p-4 border-2 border-dashed rounded-xl text-center transition-all ${slipFile ? 'border-green-400 bg-green-50' : 'border-gray-200 group-hover:border-blue-400'}`}>
                                                        <div className="mb-2">
                                                            {slipFile ? '✅' : '📷'}
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-600">
                                                            {slipFile ? slipFile.name : (t('cart.choose_file') || 'Click to upload image')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-3">
                                        <button
                                            type="button"
                                            onClick={handleConfirmPayment}
                                            disabled={isLoading || (paymentMethod === 'manual_slip' && !slipFile)}
                                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition active:scale-95 disabled:opacity-50"
                                        >
                                            {isLoading ? (t('cart.processing') || 'Processing...') : (t('cart.confirm_transfer') || 'Confirm Payment')}
                                        </button>

                                        <div className="flex items-center justify-between gap-4">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                disabled={isLoading}
                                                className="flex-1 py-2 text-gray-400 hover:text-gray-600 text-xs font-bold transition-all border border-gray-100 rounded-lg hover:bg-gray-50"
                                            >
                                                {t('cart.back_to_shipping') || 'Edit Info'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                disabled={isLoading}
                                                className="flex-1 py-2 text-gray-400 hover:text-gray-600 text-xs font-bold transition-all border border-gray-100 rounded-lg hover:bg-gray-50"
                                            >
                                                {t('cart.close_modal') || 'Close'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-72 shrink-0 space-y-6">
                                {paymentMethod === 'manual_slip' ? (
                                    <>
                                        <PromptPayQR amount={total} />
                                        <BankAccounts />
                                    </>
                                ) : (
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-1000 mb-4 tracking-tight">Order Summary</h3>
                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Subtotal</span>
                                                <span className="font-bold text-gray-700">฿{subtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3">
                                                <div className="flex justify-between items-center text-sm font-black text-gray-900">
                                                    <span>Total Due</span>
                                                    <span className="text-xl text-blue-600">฿{total.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white rounded-xl border border-gray-100 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">🔒</div>
                                            <p className="text-[10px] text-gray-400 leading-tight">Secure Payment<br /><span className="font-bold text-gray-900">OMISE GATEWAY</span></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-16 w-full flex flex-col items-center justify-center text-center animate-fade-in">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t('cart.payment_success')}</h2>
                        <p className="text-gray-600 mb-8 max-w-sm">{t('cart.order_placed_desc') || 'Your order has been received and is waiting for payment verification.'}</p>

                        <div className="space-y-3 w-full max-w-xs mx-auto">
                            <button
                                onClick={() => { onClose(); window.location.href = '/user-dashboard'; }}
                                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold shadow-xl hover:bg-gray-800 transition"
                            >
                                {t('cart.view_my_orders')}
                            </button>
                            <button onClick={onClose} className="w-full py-2 text-gray-500 hover:text-gray-700 font-medium transition">{t('user_dashboard.back_home')}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;
