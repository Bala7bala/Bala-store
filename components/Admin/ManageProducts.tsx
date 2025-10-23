
import React, { useState } from 'react';
import { Product, Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Trash2Icon, EditIcon } from '../icons';
import EditProductModal from './EditProductModal';

interface ManageProductsProps {
    products: Product[];
    categories: Category[];
    onDeleteProduct: (productId: string) => void;
    onUpdateStockStatus: (productId: string, stockStatus: Product['stockStatus']) => void;
    onUpdateProduct: (product: Product) => void;
}

const ManageProducts: React.FC<ManageProductsProps> = ({ products, categories, onDeleteProduct, onUpdateStockStatus, onUpdateProduct }) => {
    const { translate, translateUI } = useLanguage();
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const getCategoryName = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? translate(category.name) : 'N/A';
    };

    const handleDelete = (productId: string, productName: string) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            onDeleteProduct(productId);
        }
    };
    
    const handleStockToggle = (product: Product) => {
        const newStatus = product.stockStatus === 'In Stock' ? 'Out of Stock' : 'In Stock';
        onUpdateStockStatus(product.id, newStatus);
    }
    
    const handleSaveProduct = (updatedProduct: Product) => {
        onUpdateProduct(updatedProduct);
        setEditingProduct(null);
    }

    if (products.length === 0) {
        return <div className="text-center py-16 bg-white rounded-lg shadow-md"><p>No products have been added yet.</p></div>;
    }

    return (
        <>
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    categories={categories}
                    onClose={() => setEditingProduct(null)}
                    onSave={handleSaveProduct}
                />
            )}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{translateUI('productManagement')}</h2>
                <div className="overflow-x-auto">
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {products.map(product => (
                             <div key={product.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <div className="flex items-center space-x-4 mb-4">
                                    <img src={product.image} alt={translate(product.name)} className="w-16 h-16 object-cover rounded-md" />
                                    <div>
                                        <p className="font-bold text-gray-800">{translate(product.name)}</p>
                                        <p className="text-sm text-gray-500">{product.size || ''}</p>
                                        <p className="text-sm font-semibold text-gray-900">₹{product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="border-t pt-2 space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-gray-600">Category:</span>
                                        <span>{getCategoryName(product.categoryId)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-gray-600">{translateUI('stockStatus')}:</span>
                                        <button onClick={() => handleStockToggle(product)} 
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer
                                                ${product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
                                            }
                                        >
                                            {translateUI(product.stockStatus === 'In Stock' ? 'inStock' : 'outOfStock')}
                                        </button>
                                    </div>
                                    <div className="flex justify-end space-x-3 pt-2">
                                        <button onClick={() => setEditingProduct(product)} className="text-blue-600 hover:text-blue-900 p-1" title={translateUI('edit')}>
                                            <EditIcon className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => handleDelete(product.id, translate(product.name))} className="text-red-600 hover:text-red-900 p-1" title={translateUI('delete')}>
                                            <Trash2Icon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translateUI('stockStatus')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translateUI('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={product.image} alt={translate(product.name)} className="w-12 h-12 object-cover rounded-md" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{translate(product.name)}</div>
                                        {product.size && <div className="text-sm text-gray-500">{product.size}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{getCategoryName(product.categoryId)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">₹{product.price.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => handleStockToggle(product)} 
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer
                                                ${product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
                                            }
                                        >
                                            {translateUI(product.stockStatus === 'In Stock' ? 'inStock' : 'outOfStock')}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => setEditingProduct(product)} className="text-blue-600 hover:text-blue-900" title={translateUI('edit')}>
                                            <EditIcon className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => handleDelete(product.id, translate(product.name))} className="text-red-600 hover:text-red-900" title={translateUI('delete')}>
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

export default ManageProducts;
