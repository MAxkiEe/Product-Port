import React from 'react';
import { useTranslation } from 'react-i18next';

const BankAccounts = () => {
    const { t } = useTranslation();

    const accounts = [
        {
            bank: 'KBank',
            name: 'Kasikorn Bank',
            accountName: 'Product Port Co., Ltd.',
            accountNumber: '123-4-56789-0',
            color: 'bg-emerald-600',
            logo: 'https://www.kasikornbank.com/SiteCollectionImages/logos/logo-kbank.png'
        },
        {
            bank: 'SCB',
            name: 'Siam Commercial Bank',
            accountName: 'Product Port Co., Ltd.',
            accountNumber: '987-6-54321-0',
            color: 'bg-purple-700',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/SCB_Logo.svg/1200px-SCB_Logo.svg.png'
        },
        {
            bank: 'BBL',
            name: 'Bangkok Bank',
            accountName: 'Product Port Co., Ltd.',
            accountNumber: '555-4-33322-1',
            color: 'bg-blue-800',
            logo: 'https://www.bangkokbank.com/-/media/library/design/logo_bbl.png'
        }
    ];

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 mb-2">{t('cart.bank_transfer_title') || 'Bank Transfer Details'}</h3>
            <div className="grid grid-cols-1 gap-3">
                {accounts.map((acc, idx) => (
                    <div key={idx} className="flex items-center p-3 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                        <div className={`w-12 h-12 ${acc.color} rounded-lg flex items-center justify-center p-2 mr-4 shrink-0 shadow-sm`}>
                            {/* In a real app, use local SVGs or optimized images */}
                            <span className="text-white font-black text-xs">{acc.bank}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter truncate">{acc.name}</p>
                            <p className="text-base font-black text-gray-900 tracking-tight">{acc.accountNumber}</p>
                            <p className="text-[10px] text-gray-500 truncate">{acc.accountName}</p>
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText(acc.accountNumber.replace(/-/g, ''))}
                            className="p-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Copy Number"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BankAccounts;
