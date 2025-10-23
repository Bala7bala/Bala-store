import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCartIcon, HomeIcon, PackageIcon, LogOutIcon } from './icons';

interface HeaderProps {
  onNavigate: (view: 'home' | 'cart' | 'orders') => void;
  cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, cartItemCount }) => {
  const { language, toggleLanguage, translateUI } = useLanguage();
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-orange-600 cursor-pointer" onClick={() => onNavigate('home')}>
              {translateUI('storeName')}
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="hidden sm:flex space-x-4">
               <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-orange-600 flex items-center space-x-1">
                 <HomeIcon className="w-5 h-5" />
                 <span>{translateUI('home')}</span>
               </button>
               <button onClick={() => onNavigate('orders')} className="text-gray-600 hover:text-orange-600 flex items-center space-x-1">
                 <PackageIcon className="w-5 h-5" />
                 <span>{translateUI('orders')}</span>
               </button>
            </nav>
            
            <div className="flex items-center">
              <span className={`px-2 text-sm font-medium ${language === 'en' ? 'text-orange-600' : 'text-gray-500'}`}>EN</span>
              <button onClick={toggleLanguage} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                <span className={`${language === 'te' ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
              </button>
              <span className={`px-2 text-sm font-medium ${language === 'te' ? 'text-orange-600' : 'text-gray-500'}`}>తె</span>
            </div>

            <button onClick={() => onNavigate('cart')} className="relative text-gray-600 hover:text-orange-600 p-2">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            <button onClick={logout} className="text-gray-600 hover:text-orange-600 p-2 flex items-center space-x-1" title={translateUI('logout')}>
              <LogOutIcon className="w-5 h-5" />
              <span className="hidden sm:inline">{translateUI('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;