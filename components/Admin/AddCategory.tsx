
import React, { useState } from 'react';
import { Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { UploadCloudIcon } from '../icons';

interface AddCategoryProps {
    onAddCategory: (category: Omit<Category, 'id'>) => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ onAddCategory }) => {
    const [nameEn, setNameEn] = useState('');
    const [nameTe, setNameTe] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { translateUI } = useLanguage();

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
        if (!nameEn || !nameTe || !imagePreview) {
            alert('Please fill all fields and upload an image');
            return;
        }

        const newCategory: Omit<Category, 'id'> = {
            name: { en: nameEn, te: nameTe },
            image: imagePreview,
        };

        onAddCategory(newCategory);

        // Reset form
        setNameEn('');
        setNameTe('');
        setImagePreview(null);
        if (document.getElementById('category-image-upload')) {
            (document.getElementById('category-image-upload') as HTMLInputElement).value = '';
        }
        
        alert('Category added successfully!');
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{translateUI('addCategory')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Category Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Category preview" className="mx-auto h-24 w-24 object-cover rounded-md" />
                            ) : (
                                <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                            )}
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="category-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                                    <span>Upload an image</span>
                                    <input id="category-image-upload" name="category-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name (English)</label>
                    <input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name (Telugu)</label>
                    <input type="text" value={nameTe} onChange={e => setNameTe(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <div className="pt-4">
                    <button type="submit" className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">Add Category</button>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;
