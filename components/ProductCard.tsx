
import React from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ShareIcon } from './icons';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { translate, translateUI } = useLanguage();
  const isOutOfStock = product.stockStatus === 'Out of Stock';

  const handleShare = async () => {
    const shareData = {
      title: translateUI('storeName'),
      text: `Check out ${translate(product.name)} for ₹${product.price.toFixed(2)} at ${translateUI('storeName')}!`,
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert('Sharing is not supported on this browser.');
      }
    } catch (err) {
      console.error('Error sharing product:', err);
    }
  };
  
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl relative">
       {canShare && (
        <button
          onClick={handleShare}
          className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-2 text-gray-600 hover:text-orange-600 hover:bg-opacity-100 z-20 transition-colors"
          aria-label={translateUI('share')}
          title={translateUI('share')}
        >
          <ShareIcon className="w-5 h-5" />
        </button>
      )}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <span className="px-4 py-2 bg-gray-800 text-white font-bold rounded-full">{translateUI('outOfStock')}</span>
        </div>
      )}
      <div className="aspect-w-1 aspect-h-1 w-full">
        <img src={product.image} alt={translate(product.name)} className="object-cover w-full h-full" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-semibold text-gray-800 flex-grow">{translate(product.name)}</h3>
        {product.size && <p className="text-sm text-gray-500">{product.size}</p>}
        <p className="text-lg font-bold text-gray-900 mt-2">₹{product.price.toFixed(2)}</p>
        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className="mt-4 w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {translateUI('addToCart')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;