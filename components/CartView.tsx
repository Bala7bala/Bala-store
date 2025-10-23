
import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { Trash2Icon } from './icons';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onPlaceOrder: (paymentMethod: 'COD' | 'UPI', customerName: string, customerMobile: string, customerAddress: string) => void;
  getCartTotal: () => number;
}

const PaymentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirmOrder: (paymentMethod: 'COD' | 'UPI', customerName: string, customerMobile: string, customerAddress: string) => void;
    totalAmount: number;
}> = ({ isOpen, onClose, onConfirmOrder, totalAmount }) => {
    const { translateUI } = useLanguage();
    const { settings } = useSettings();
    const [paymentStep, setPaymentStep] = useState<'details' | 'select' | 'upi'>('details');
    const [customerName, setCustomerName] = useState('');
    const [customerMobile, setCustomerMobile] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    
    const isUpiConfigured = settings.upiId && settings.qrCode;

    useEffect(() => {
        if (isOpen) {
            setPaymentStep('details');
            setCustomerName('');
            setCustomerMobile('');
            setCustomerAddress('');
        }
    }, [isOpen]);

    const handleUpiConfirm = () => {
        onConfirmOrder('UPI', customerName, customerMobile, customerAddress);
    }
    
    const handleCodConfirm = () => {
        onConfirmOrder('COD', customerName, customerMobile, customerAddress);
    }

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customerName && customerMobile && customerAddress) {
            setPaymentStep('select');
        }
    }

    const handlePayWithUpiApp = () => {
        if (!settings.upiId || totalAmount <= 0) return;

        const payeeName = translateUI('storeName');
        const transactionNote = `Payment for your order`;
        
        const upiLink = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
        
        // This will attempt to open a UPI app on mobile devices
        window.location.href = upiLink;
    };


    if (!isOpen) return null;

    const renderStep = () => {
        switch (paymentStep) {
            case 'details':
                return (
                    <form onSubmit={handleDetailsSubmit} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">{translateUI('customerName')}</label>
                            <input type="text" id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500" />
                        </div>
                        <div>
                            <label htmlFor="customerMobile" className="block text-sm font-medium text-gray-700">{translateUI('customerMobile')}</label>
                            <input type="tel" id="customerMobile" value={customerMobile} onChange={e => setCustomerMobile(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500" />
                        </div>
                        <div>
                            <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700">{translateUI('address')}</label>
                            <textarea 
                                id="customerAddress" 
                                rows={3}
                                value={customerAddress} 
                                onChange={e => setCustomerAddress(e.target.value)} 
                                required 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500" 
                                placeholder="House No, Street, Landmark..."
                            />
                        </div>
                        <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
                            {translateUI('proceedToPayment')}
                        </button>
                    </form>
                );
            case 'select':
                 return (
                    <div className="p-6 space-y-4">
                        <button onClick={handleCodConfirm} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center transition-colors">
                            <span className="font-semibold text-lg text-gray-800">{translateUI('cashOnDelivery')}</span>
                            <span className="text-xl text-gray-800">›</span>
                        </button>
                        <button 
                            onClick={() => setPaymentStep('upi')} 
                            disabled={!isUpiConfigured}
                            className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                        >
                             <span className="font-semibold text-lg text-gray-800">{translateUI('upiPayment')}</span>
                             {!isUpiConfigured && <span className="text-xs font-normal">(Unavailable)</span>}
                             <span className="text-xl">›</span>
                        </button>
                    </div>
                );
            case 'upi':
                return (
                    <div className="p-6 text-center">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Option 1: Scan QR</h4>
                        <img src={settings.qrCode} alt="UPI QR Code" className="mx-auto mb-4 border rounded-lg max-w-[200px]" />
                        <p className="font-semibold">{translateUI('storeUpiId')}:</p>
                        <p className="text-lg text-gray-800 font-mono p-2 bg-gray-100 rounded-md mb-4 break-words">{settings.upiId}</p>

                        <div className="my-6 flex items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <h4 className="text-lg font-semibold text-gray-700 mb-3">Option 2: Pay from App</h4>
                         <button 
                            onClick={handlePayWithUpiApp} 
                            className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors mb-6"
                        >
                            Pay ₹{totalAmount.toFixed(2)} with a UPI App
                        </button>

                        <p className="text-sm text-gray-600 mb-6">{translateUI('paymentInstructions')}</p>
                        <button onClick={handleUpiConfirm} className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
                            {translateUI('confirmPayment')}
                        </button>
                    </div>
                );
        }
    }

    const getTitle = () => {
        switch (paymentStep) {
            case 'details': return translateUI('customerDetails');
            case 'select': return translateUI('selectPaymentMethod');
            case 'upi': return translateUI('payWithUPI');
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b">
                    <h3 className="text-2xl font-bold text-gray-800 text-center">{getTitle()}</h3>
                </div>
                
                {renderStep()}

                <div className="p-4 bg-gray-50 text-right rounded-b-lg">
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800 font-semibold py-2 px-4 rounded-lg">
                        {translateUI('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};


const CartView: React.FC<CartViewProps> = ({ cart, onUpdateQuantity, onRemoveFromCart, onPlaceOrder, getCartTotal }) => {
  const { translate, translateUI } = useLanguage();
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{translateUI('shoppingCart')}</h2>
        <p className="text-gray-500">{translateUI('emptyCart')}</p>
      </div>
    );
  }
  
  const handleConfirmOrder = (method: 'COD' | 'UPI', customerName: string, customerMobile: string, customerAddress: string) => {
      onPlaceOrder(method, customerName, customerMobile, customerAddress);
      setPaymentModalOpen(false);
  }

  return (
    <>
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onConfirmOrder={handleConfirmOrder}
        totalAmount={getCartTotal()}
      />
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">{translateUI('shoppingCart')}</h2>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={translate(item.name)} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h3 className="font-semibold text-gray-800">{translate(item.name)}</h3>
                  <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100">-</button>
                  <span className="px-4 py-1 text-center">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100">+</button>
                </div>
                <p className="font-semibold w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => onRemoveFromCart(item.id)} className="text-red-500 hover:text-red-700">
                  <Trash2Icon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-4 border-t flex justify-end items-center">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">{translateUI('total')}: ₹{getCartTotal().toFixed(2)}</p>
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="mt-4 w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors duration-300 text-lg"
            >
              {translateUI('placeOrder')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartView;