
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Product, Order, Category } from '../../types';
import { LogOutIcon, PlusSquareIcon, ArchiveIcon, CreditCardIcon, ClipboardListIcon, UsersIcon, SettingsIcon } from '../icons';
import AddProduct from './AddProduct';
import AddCategory from './AddCategory';
import ManageOrders from './ManageOrders';
import ManageProducts from './ManageProducts';
import TransactionHistory from './TransactionHistory';
import ManageUsers from './ManageUsers';
import StoreSettings from './StoreSettings';
import { useLanguage } from '../../context/LanguageContext';

type AdminView = 'orders' | 'add-product' | 'add-category' | 'manage-products' | 'transactions' | 'manage-users' | 'settings';

interface AdminDashboardProps {
    products: Product[];
    categories: Category[];
    orders: Order[];
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onAddCategory: (category: Omit<Category, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
    onUpdateOrderPaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus']) => void;
    onDeleteProduct: (productId: string) => void;
    onUpdateProductStockStatus: (productId: string, stockStatus: Product['stockStatus']) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    products, 
    categories,
    orders, 
    onAddProduct,
    onAddCategory,
    onUpdateProduct,
    onUpdateOrderStatus, 
    onUpdateOrderPaymentStatus,
    onDeleteProduct, 
    onUpdateProductStockStatus 
}) => {
    const [view, setView] = useState<AdminView>('orders');
    const { logout, user } = useAuth();
    const { translateUI } = useLanguage();

    const renderContent = () => {
        switch(view) {
            case 'orders':
                return <ManageOrders orders={orders} onUpdateStatus={onUpdateOrderStatus} onUpdatePaymentStatus={onUpdateOrderPaymentStatus} />;
            case 'add-product':
                return <AddProduct onAddProduct={onAddProduct} categories={categories} />;
            case 'add-category':
                return <AddCategory onAddCategory={onAddCategory} />;
            case 'manage-products':
                return <ManageProducts products={products} categories={categories} onDeleteProduct={onDeleteProduct} onUpdateStockStatus={onUpdateProductStockStatus} onUpdateProduct={onUpdateProduct} />;
            case 'transactions':
                return <TransactionHistory orders={orders} />;
            case 'manage-users':
                return <ManageUsers />;
            case 'settings':
                return <StoreSettings />;
            default:
                return <ManageOrders orders={orders} onUpdateStatus={onUpdateOrderStatus} onUpdatePaymentStatus={onUpdateOrderPaymentStatus} />;
        }
    };
    
    const NavButton: React.FC<{
        targetView: AdminView;
        icon: React.ReactNode;
        label: string;
    }> = ({ targetView, icon, label}) => (
         <button 
            onClick={() => setView(targetView)}
            className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left ${view === targetView ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    )

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={logout} className="text-gray-600 hover:text-red-600 flex items-center space-x-2">
                                <LogOutIcon className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
                <aside className="w-full md:w-64 bg-white p-4 md:h-[calc(100vh-64px)] md:sticky top-16">
                    <nav className="flex flex-row md:flex-col md:space-y-2 space-x-2 md:space-x-0 overflow-x-auto">
                       <NavButton targetView="orders" icon={<ClipboardListIcon className="w-5 h-5"/>} label={translateUI('manageOrders')} />
                       <NavButton targetView="add-product" icon={<PlusSquareIcon className="w-5 h-5" />} label={translateUI('addProduct')} />
                       <NavButton targetView="add-category" icon={<PlusSquareIcon className="w-5 h-5" />} label={translateUI('addCategory')} />
                       <NavButton targetView="manage-products" icon={<ArchiveIcon className="w-5 h-5" />} label={translateUI('manageProducts')} />
                       <NavButton targetView="transactions" icon={<CreditCardIcon className="w-5 h-5" />} label={translateUI('transactionHistory')} />
                       <NavButton targetView="manage-users" icon={<UsersIcon className="w-5 h-5" />} label={translateUI('manageUsers')} />
                       <NavButton targetView="settings" icon={<SettingsIcon className="w-5 h-5" />} label={translateUI('storeSettings')} />
                    </nav>
                </aside>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                   {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
