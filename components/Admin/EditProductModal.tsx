
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { UploadCloudIcon } from '../icons';

interface EditProductModalProps {
    product: Product;
    categories: Category[];
    onClose: () => void;
    onSave: (product: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, categories, onClose, onSave }) => {
    const [nameEn, setNameEn] = useState(product.name.en);
    const [nameTe, setNameTe] = useState(product.name.te);
    const [price, setPrice] = useState(product.price.toString());
    const [size, setSize] = useState(product.size || '');
    const [categoryId, setCategoryId] = useState(product.categoryId);
    const [imagePreview, setImagePreview] = useState<string | null>(product.image);
    const { translate, translateUI } = useLanguage();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameEn || !nameTe || !price || !categoryId || !imagePreview) {
            alert('Please fill all fields and ensure an image is present');
            return;
        }

        const updatedProduct: Product = {
            ...product,
            name: { en: nameEn, te: nameTe },
            price: parseFloat(price),
            categoryId,
            image: imagePreview,
            size: size || undefined,
        };

        onSave(updatedProduct);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
                <div className="p-6 border-b">
                    <h3 className="text-2xl font-bold text-gray-800">{translateUI('editProduct')}</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Product Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Product preview" className="mx-auto h-24 w-24 object-cover rounded-md" />
                                ) : (
                                    <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="edit-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500">
                                        <span>Change image</span>
                                        <input id="edit-image-upload" name="edit-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name (English)</label>
                        <input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name (Telugu)</label>
                        <input type="text" value={nameTe} onChange={e => setNameTe(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{translateUI('size')}</label>
                        <input type="text" value={size} onChange={e => setSize(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                        {/* FIX: Corrected a typo in the onChange handler for the price input. `e.getTarge t.value` was changed to `e.target.value`. */}
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500">
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{translate(cat.name)}</option>)}
                        </select>
                    </div>
                </form>
                <div className="p-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                    <button type="button" onClick={onClose} className="bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50">
                        {translateUI('cancel')}
                    </button>
                     <button type="submit" onClick={handleSubmit} className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600">
                        {translateUI('saveChanges')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;
