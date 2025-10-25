
import React, { useState } from 'react';
import { Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Trash2Icon, EditIcon } from '../icons';
import EditCategoryModal from './EditCategoryModal';

interface ManageCategoriesProps {
    categories: Category[];
    onUpdateCategory: (category: Category) => void;
    onDeleteCategory: (categoryId: string) => void;
}

const ManageCategories: React.FC<ManageCategoriesProps> = ({ categories, onUpdateCategory, onDeleteCategory }) => {
    const { translate, translateUI } = useLanguage();
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleDelete = (categoryId: string, categoryName: string) => {
        if (window.confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
            onDeleteCategory(categoryId);
        }
    };

    const handleSaveCategory = (updatedCategory: Category) => {
        onUpdateCategory(updatedCategory);
        setEditingCategory(null);
    };

    if (categories.length === 0) {
        return <div className="text-center py-16 bg-white rounded-lg shadow-md"><p>No categories have been added yet.</p></div>;
    }

    return (
        <>
            {editingCategory && (
                <EditCategoryModal
                    category={editingCategory}
                    onClose={() => setEditingCategory(null)}
                    onSave={handleSaveCategory}
                />
            )}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{translateUI('manageCategories')}</h2>
                <div className="overflow-x-auto">
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {categories.map(category => (
                             <div key={category.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <div className="flex items-center space-x-4 mb-4">
                                    <img src={category.image} alt={translate(category.name)} className="w-16 h-16 object-cover rounded-md" />
                                    <div>
                                        <p className="font-bold text-gray-800">{translate(category.name)}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-2 border-t">
                                    <button onClick={() => setEditingCategory(category)} className="text-blue-600 hover:text-blue-900 p-1" title={translateUI('edit')}>
                                        <EditIcon className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => handleDelete(category.id, translate(category.name))} className="text-red-600 hover:text-red-900 p-1" title={translateUI('delete')}>
                                        <Trash2Icon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translateUI('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map(category => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={category.image} alt={translate(category.name)} className="w-12 h-12 object-cover rounded-md" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{translate(category.name)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => setEditingCategory(category)} className="text-blue-600 hover:text-blue-900" title={translateUI('edit')}>
                                            <EditIcon className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => handleDelete(category.id, translate(category.name))} className="text-red-600 hover:text-red-900" title={translateUI('delete')}>
                                            <Trash2Icon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageCategories;
