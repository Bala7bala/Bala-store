
import React, { useState, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import { UploadCloudIcon, DownloadIcon, UploadIcon } from '../icons';

const StoreSettings: React.FC = () => {
    const { settings, saveSettings } = useSettings();
    const { translateUI } = useLanguage();
    const [upiId, setUpiId] = useState(settings.upiId);
    const [qrCode, setQrCode] = useState(settings.qrCode);
    const importInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrCode(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveSettings({ upiId, qrCode });
        alert(translateUI('settingsSaved'));
    };

    const handleExport = () => {
        try {
            const dataToExport = {
                products: JSON.parse(localStorage.getItem('products') || '[]'),
                categories: JSON.parse(localStorage.getItem('categories') || '[]'),
                orders: JSON.parse(localStorage.getItem('orders') || '[]'),
                users: JSON.parse(localStorage.getItem('app_users') || '[]'),
                settings: JSON.parse(localStorage.getItem('storeSettings') || '{}'),
            };

            const dataStr = JSON.stringify(dataToExport, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            const date = new Date().toISOString().slice(0, 10);
            link.download = `bala-store-backup-${date}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            alert('Data exported successfully!');
        } catch (error) {
            console.error("Failed to export data:", error);
            alert("An error occurred while exporting data. Check the console for details.");
        }
    };

    const handleImportClick = () => {
        importInputRef.current?.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            if (!window.confirm(translateUI('importConfirm'))) {
                e.target.value = ''; // Reset file input
                return;
            }

            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target?.result as string);
                    
                    // Basic validation
                    if (importedData && importedData.products && importedData.categories && importedData.users && importedData.orders && importedData.settings) {
                        localStorage.setItem('products', JSON.stringify(importedData.products));
                        localStorage.setItem('categories', JSON.stringify(importedData.categories));
                        localStorage.setItem('orders', JSON.stringify(importedData.orders));
                        localStorage.setItem('app_users', JSON.stringify(importedData.users));
                        localStorage.setItem('storeSettings', JSON.stringify(importedData.settings));
                        
                        alert('Data imported successfully! The application will now reload.');
                        window.location.reload();
                    } else {
                        throw new Error("Invalid or incomplete backup file.");
                    }
                } catch (error) {
                     console.error("Failed to import data:", error);
                    alert(`Failed to import data. Please ensure you are uploading a valid backup file. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                } finally {
                     e.target.value = ''; // Reset file input
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto space-y-10">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{translateUI('upiSettings')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">{translateUI('upiId')}</label>
                        <input
                            id="upiId"
                            type="text"
                            value={upiId}
                            onChange={e => setUpiId(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            placeholder="your-name@upi"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{translateUI('qrCodeImage')}</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {qrCode ? (
                                    <img src={qrCode} alt="QR Code Preview" className="mx-auto h-32 w-32 object-contain rounded-md" />
                                ) : (
                                    <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label htmlFor="qr-code-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                                        <span>{translateUI('uploadQrCode')}</span>
                                        <input id="qr-code-upload" name="qr-code-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                            {translateUI('saveChanges')}
                        </button>
                    </div>
                </form>
            </div>

            <div className="border-t pt-8">
                 <h2 className="text-2xl font-bold text-gray-800 mb-6">{translateUI('dataManagement')}</h2>
                 <div className="space-y-6">
                    <div className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-700">{translateUI('exportData')}</h3>
                            <p className="text-sm text-gray-500 mt-1">{translateUI('exportDescription')}</p>
                        </div>
                        <button onClick={handleExport} className="mt-3 sm:mt-0 sm:ml-4 w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                            <DownloadIcon className="w-5 h-5" />
                            <span>{translateUI('exportData')}</span>
                        </button>
                    </div>
                     <div className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-700">{translateUI('importData')}</h3>
                            <p className="text-sm text-gray-500 mt-1">{translateUI('importDescription')}</p>
                        </div>
                        <input type="file" ref={importInputRef} onChange={handleImport} accept=".json" className="hidden" />
                        <button onClick={handleImportClick} className="mt-3 sm:mt-0 sm:ml-4 w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                            <UploadIcon className="w-5 h-5" />
                            <span>{translateUI('importData')}</span>
                        </button>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default StoreSettings;
