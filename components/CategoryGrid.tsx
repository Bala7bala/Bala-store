
import React from 'react';
import { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelectCategory }) => {
  const { translate, translateUI } = useLanguage();

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{translateUI('categories')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className="group cursor-pointer aspect-w-1 aspect-h-1"
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img src={category.image} alt={translate(category.name)} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2">
                <h3 className="text-white text-center font-semibold text-lg">{translate(category.name)}</h3>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
