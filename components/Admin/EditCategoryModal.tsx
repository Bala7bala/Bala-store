
import React, { useState } from 'react';
import { Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { UploadCloudIcon } from '../icons';

interface EditCategoryModalProps {
    category: Category;
    onClose: () => void;
    onSave: (category: Category) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ category, onClose, onSave }) => {
    const [nameEn, setNameEn] = useState(category.name.en);
    const [nameTe, setNameTe] = useState(category.name.te);
    const [imagePreview, setImagePreview] = useState<string | null>(category.image);
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
            alert('Please fill all fields and ensure an image is present');
            return;
        }

        const updatedCategory: Category = {
            ...category,
            name: { en: nameEn, te: nameTe },
            image: imagePreview,
        };

        onSave(updatedCategory);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
                <div className="p-6 border-b">
                    <h3 className="text-2xl font-bold text-gray-800">{translateUI('editCategory')}</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Category Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Category preview" className="mx-auto h-24 w-24 object-cover rounded-md" />
                                ) : (
                                    <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label htmlFor="edit-category-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500">
                                        <span>Change image</span>
                                        <input id="edit-category-image-upload" name="edit-category-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Category Name (English)</label>
                        <input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Category Name (Telugu)</label>
                        <input type="text" value={nameTe} onChange={e => setNameTe(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500" />
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

export default EditCategoryModal;
