import React from 'react';

const PromptPayQR = ({ amount, targetId = '0812345678' }) => {
    // Note: For a real production app, use a library like 'promptpay-qr' 
    // to generate the EMVCo payload. Here we use a safe representative URL.
    // In a real scenario, you'd generate the payload on backend or using a JS lib.

    // Placeholder dynamic QR generator for demonstration
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PromptPay_${targetId}_Amount_${amount}`;

    return (
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="mb-4">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png"
                    alt="PromptPay"
                    className="h-8 object-contain"
                />
            </div>

            <div className="relative p-4 bg-gray-50 rounded-xl mb-4">
                <img
                    src={qrUrl}
                    alt="PromptPay QR Code"
                    className="w-48 h-48 mix-blend-multiply"
                />
            </div>

            <div className="text-center space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">PromptPay ID</p>
                <p className="text-lg font-bold text-blue-600">{targetId}</p>
                <p className="text-sm text-gray-400">Merchant Name: Product Port Shop</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 w-full text-center">
                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                <p className="text-2xl font-black text-gray-900">฿ {parseFloat(amount).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default PromptPayQR;
