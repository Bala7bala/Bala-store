
import React from 'react';
import { Order } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ManageOrdersProps {
    orders: Order[];
    onUpdateStatus: (orderId: string, status: Order['status']) => void;
    onUpdatePaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus']) => void;
}

const ManageOrders: React.FC<ManageOrdersProps> = ({ orders, onUpdateStatus, onUpdatePaymentStatus }) => {
    const { translate, translateUI } = useLanguage();

    const getStatusClasses = (status: Order['status']) => {
        switch (status) {
          case 'Processing': return 'bg-blue-100 text-blue-800';
          case 'Out for Delivery': return 'bg-yellow-100 text-yellow-800';
          case 'Delivered': return 'bg-green-100 text-green-800';
          default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusClasses = (status: Order['paymentStatus']) => {
        switch (status) {
            case 'Paid': return 'text-green-800';
            case 'Pending': return 'text-yellow-800';
            default: return 'text-gray-800';
        }
    }
    
    const getTranslatedStatus = (status: Order['status']) => {
        switch(status) {
          case 'Processing': return translateUI('processing');
          case 'Out for Delivery': return translateUI('outForDelivery');
          case 'Delivered': return translateUI('delivered');
        }
    }
    
    const getTranslatedPaymentStatus = (status: Order['paymentStatus']) => {
      switch(status) {
          case 'Paid': return translateUI('paid');
          case 'Pending': return translateUI('pending');
      }
    }

    if (orders.length === 0) {
        return <div className="text-center py-16 bg-white rounded-lg shadow-md"><p>No orders received yet.</p></div>;
    }

    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Customer Orders</h2>
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                            <div>
                                <p className="font-bold text-lg text-gray-800">{order.id}</p>
                                <div className="mt-1">
                                    <p className="font-semibold text-gray-700">{order.customerName} - {order.customerMobile}</p>
                                    <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">{order.customerAddress}</p>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">User ID: {order.userId}</p>
                                <p className="text-sm text-gray-500">Date: {new Date(order.date).toLocaleString()}</p>
                                <p className={`text-sm font-semibold mt-1 ${getPaymentStatusClasses(order.paymentStatus)}`}>
                                    {order.paymentMethod} - {getTranslatedPaymentStatus(order.paymentStatus)}
                                </p>
                            </div>
                            <span className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                                {getTranslatedStatus(order.status)}
                            </span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                             <h4 className="font-semibold mb-2 text-sm text-gray-600">Items:</h4>
                            <ul className="space-y-1 text-sm list-disc list-inside text-gray-600">
                                {order.items.map(item => (
                                    <li key={item.id}>
                                        {translate(item.name)} x {item.quantity} - <span className="font-medium text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="border-t pt-4 mt-4 flex flex-col sm:flex-row justify-between items-center">
                             <p className="font-bold text-lg text-gray-900 mb-4 sm:mb-0">
                                {translateUI('total')}: ₹{order.total.toFixed(2)}
                            </p>
                            <div className="flex items-center space-x-4 flex-wrap justify-end gap-y-2 w-full sm:w-auto">
                                {order.paymentStatus === 'Pending' && (
                                    <button 
                                        onClick={() => onUpdatePaymentStatus(order.id, 'Paid')}
                                        className="bg-green-500 text-white font-semibold py-1 px-3 rounded-md text-sm hover:bg-green-600 transition-colors w-full sm:w-auto"
                                    >
                                        Mark as Paid
                                    </button>
                                )}
                                <div className="flex items-center space-x-2 w-full sm:w-auto">
                                    <label htmlFor={`status-${order.id}`} className="text-sm font-medium text-gray-700 shrink-0">Update Status:</label>
                                    <select 
                                        id={`status-${order.id}`}
                                        value={order.status}
                                        onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                                        className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm w-full"
                                        disabled={order.status === 'Delivered'}
                                    >
                                        <option value="Processing">{translateUI('processing')}</option>
                                        <option value="Out for Delivery">{translateUI('outForDelivery')}</option>
                                        <option value="Delivered">{translateUI('delivered')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageOrders;