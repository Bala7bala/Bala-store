
import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import Header from './Header';
import CategoryGrid from './CategoryGrid';
import ProductList from './ProductList';
import CartView from './CartView';
import OrderHistory from './OrderHistory';
import { Category, Order, Product } from '../types';

type View = 'home' | 'products' | 'cart' | 'orders';

interface UserDashboardProps {
    products: Product[];
    categories: Category[];
    userOrders: Order[];
    onAddOrder: (order: Omit<Order, 'id'>) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ products, categories, userOrders, onAddOrder }) => {
  const [view, setView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart();
  const { user } = useAuth();
  
  const handleSelectCategory = useCallback((category: Category) => {
    setSelectedCategory(category);
    setView('products');
  }, []);

  const handlePlaceOrder = (paymentMethod: 'COD' | 'UPI', customerName: string, customerMobile: string, customerAddress: string) => {
    if (cart.length === 0 || !user) return;
    const newOrder: Omit<Order, 'id'> = {
      userId: user.id,
      customerName,
      customerMobile,
      customerAddress,
      date: new Date().toISOString(),
      items: cart,
      total: getCartTotal(),
      status: 'Processing',
      paymentMethod: paymentMethod,
      paymentStatus: 'Pending',
    };
    onAddOrder(newOrder);
    clearCart();
    setView('orders');
  };

  const renderContent = () => {
    switch (view) {
      case 'products':
        return selectedCategory && <ProductList category={selectedCategory} onAddToCart={addToCart} onBack={() => setView('home')} availableProducts={products} />;
      case 'cart':
        return <CartView cart={cart} onUpdateQuantity={updateQuantity} onRemoveFromCart={removeFromCart} onPlaceOrder={handlePlaceOrder} getCartTotal={getCartTotal} />;
      case 'orders':
        return <OrderHistory orders={userOrders} />;
      case 'home':
      default:
        return <CategoryGrid categories={categories} onSelectCategory={handleSelectCategory} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header onNavigate={setView} cartItemCount={getCartCount()} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm mt-8">
        <p>&copy; {new Date().getFullYear()} BALA GENERAL AND FANCY STORE – DOKIPARRU</p>
      </footer>
    </div>
  );
};

export default UserDashboard;
