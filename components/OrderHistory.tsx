
import React from 'react';
import { Order, Order as OrderType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface OrderHistoryProps {
  orders: OrderType[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  const { translate, translateUI } = useLanguage();
  
  const getStatusClasses = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPaymentStatusClasses = (status: Order['paymentStatus']) => {
      switch (status) {
          case 'Paid': return 'bg-green-100 text-green-800';
          case 'Pending': return 'bg-yellow-100 text-yellow-800';
          default: return 'bg-gray-100 text-gray-800';
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
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{translateUI('orderHistory')}</h2>
        <p className="text-gray-500">{translateUI('noOrders')}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{translateUI('orderHistory')}</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
              <div>
                <p className="font-bold text-lg text-gray-800">{translateUI('orderId')}: {order.id}</p>
                <div className="mt-2">
                    <p className="font-semibold text-gray-700">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.customerMobile}</p>
                    <p className="text-sm text-gray-500 whitespace-pre-wrap mt-1">{order.customerAddress}</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">{translateUI('date')}: {new Date(order.date).toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{translateUI('paymentMethod')}: <span className="font-semibold">{order.paymentMethod}</span></p>
              </div>
              <div className="flex flex-col items-end mt-2 sm:mt-0">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                  {getTranslatedStatus(order.status)}
                </span>
                <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusClasses(order.paymentStatus)}`}>
                   {translateUI('paymentStatus')}: {getTranslatedPaymentStatus(order.paymentStatus)}
                </span>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">{translateUI('items')}</h4>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-gray-700">
                    <span>{translate(item.name)} x {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t pt-4 mt-4 text-right">
              <p className="font-bold text-xl text-gray-900">{translateUI('total')}: ₹{order.total.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;