import React, { useState, useMemo } from 'react';
import { Category, Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from './ProductCard';
import { SearchIcon, ChevronLeftIcon } from './icons';

interface ProductListProps {
  category: Category;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
  availableProducts: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ category, onAddToCart, onBack, availableProducts }) => {
  const { translate, translateUI } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return availableProducts.filter(product =>
      product.categoryId === category.id &&
      (translate(product.name).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [category.id, searchTerm, translate, availableProducts]);

  return (
    <div>
       <div className="flex items-center mb-6">
         <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 mr-4">
           <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
         </button>
         <h2 className="text-3xl font-bold text-gray-800">{translate(category.name)}</h2>
       </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder={translateUI('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <SearchIcon className="w-5 h-5" />
        </div>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : (
         <p className="text-center text-gray-500 mt-8">{`No products found in ${translate(category.name)} matching "${searchTerm}"`}</p>
      )}
    </div>
  );
};

export default ProductList;
