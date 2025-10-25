
import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { Product, Order, Category } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './constants';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedProducts = localStorage.getItem('products');
      // For backwards compatibility, add size and stockStatus to old data
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        return parsed.map((p: Product) => ({
          ...p,
          size: p.size || undefined,
          stockStatus: p.stockStatus || 'In Stock',
        }))
      }
      return INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const savedCategories = localStorage.getItem('categories');
      return savedCategories ? JSON.parse(savedCategories) : INITIAL_CATEGORIES;
    } catch (e) {
      return INITIAL_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const savedOrders = localStorage.getItem('orders');
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error("Failed to save products to localStorage:", error);
      alert("Could not save product list. The browser's local storage might be full. This can happen if you upload large images.");
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: `p${Date.now()}` }]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const updateProductStockStatus = (productId: string, stockStatus: Product['stockStatus']) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockStatus } : p));
  };
  
  const addCategory = (category: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...category, id: `cat${Date.now()}` }]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const addOrder = (order: Omit<Order, 'id'>) => {
    setOrders(prev => [{ ...order, id: `ORDER-${Date.now()}` }, ...prev]);
  };
  
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };
  
  const updateOrderPaymentStatus = (orderId: string, paymentStatus: Order['paymentStatus']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus } : o));
  };
  
  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-500">Loading Application...</p></div>;
  }
  
  if (!user) {
    return <Login />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard 
              products={products} 
              categories={categories}
              orders={orders}
              onAddProduct={addProduct} 
              onAddCategory={addCategory}
              onUpdateOrderStatus={updateOrderStatus}
              onUpdateOrderPaymentStatus={updateOrderPaymentStatus}
              onDeleteProduct={deleteProduct}
              onUpdateProductStockStatus={updateProductStockStatus}
              onUpdateProduct={updateProduct}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
            />;
  }

  return <UserDashboard 
            products={products} 
            categories={categories}
            userOrders={orders.filter(o => o.userId === user.id)}
            onAddOrder={addOrder}
          />;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
