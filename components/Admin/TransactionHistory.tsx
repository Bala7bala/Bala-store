import React from 'react';
import { Order } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface TransactionHistoryProps {
    orders: Order[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ orders }) => {
    const { translateUI } = useLanguage();

    const getPaymentStatusClasses = (status: Order['paymentStatus']) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
    
    const getTranslatedPaymentStatus = (status: Order['paymentStatus']) => {
      switch(status) {
          case 'Paid': return translateUI('paid');
          case 'Pending': return translateUI('pending');
      }
    }

    if (orders.length === 0) {
        return <div className="text-center py-16 bg-white rounded-lg shadow-md"><p>No transactions found.</p></div>;
    }

    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{translateUI('allTransactions')}</h2>

             {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                         <div className="flex justify-between items-start">
                             <div>
                                <p className="font-bold text-gray-800">{order.id}</p>
                                <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
                             </div>
                             <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusClasses(order.paymentStatus)}`}>
                                {getTranslatedPaymentStatus(order.paymentStatus)}
                            </span>
                         </div>
                         <div className="border-t mt-2 pt-2 space-y-1">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-600">{translateUI('paymentMethod')}:</span>
                                <span>{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-semibold text-gray-800">{translateUI('total')}:</span>
                                <span className="font-bold text-gray-900">₹{order.total.toFixed(2)}</span>
                            </div>
                         </div>
                    </div>
                ))}
            </div>


            {/* Desktop Table View */}
            <div className="overflow-x-auto hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translateUI('orderId')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translateUI('date')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translateUI('total')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translateUI('paymentMethod')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translateUI('paymentStatus')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₹{order.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.paymentMethod}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusClasses(order.paymentStatus)}`}>
                                        {getTranslatedPaymentStatus(order.paymentStatus)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;