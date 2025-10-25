
import React, { useRef } from 'react';
import { PRODUCTS, INITIAL_CATEGORIES, DUMMY_USERS, UI_STRINGS } from '../constants';
import { DownloadIcon, UploadIcon } from './icons';

// This is a special component that does not use the full context suite, so we need to get translations manually
const getTranslateUI = () => {
    const lang = 'en'; // Default to english for setup screen
    return (key: string) => UI_STRINGS[key]?.[lang] ?? key;
}

const SetupGuide: React.FC = () => {
    const importInputRef = useRef<HTMLInputElement>(null);
    const translateUI = getTranslateUI();

    const initializeWithSampleData = () => {
        if (window.confirm("This will load sample products, categories, and users. Any existing data will be overwritten. Continue?")) {
            try {
                localStorage.setItem('products', JSON.stringify(PRODUCTS));
                localStorage.setItem('categories', JSON.stringify(INITIAL_CATEGORIES));
                localStorage.setItem('orders', JSON.stringify([]));
                localStorage.setItem('app_users', JSON.stringify(DUMMY_USERS));
                localStorage.setItem('storeSettings', JSON.stringify({ upiId: '', qrCode: '' }));
                localStorage.setItem('cart', JSON.stringify([]));
                localStorage.setItem('is_initialized', 'true');
                alert("Sample data loaded successfully! The app will now reload.");
                window.location.reload();
            } catch (error) {
                console.error("Failed to initialize with sample data:", error);
                alert("An error occurred while loading sample data.");
            }
        }
    };
    
    const handleImportClick = () => {
        importInputRef.current?.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            if (!window.confirm(translateUI('importConfirm'))) {
                if (importInputRef.current) {
                    importInputRef.current.value = '';
                }
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
                        localStorage.setItem('cart', JSON.stringify([])); // Always clear cart on import
                        localStorage.setItem('is_initialized', 'true');
                        
                        alert('Data imported successfully! The application will now reload.');
                        window.location.reload();
                    } else {
                        throw new Error("Invalid or incomplete backup file.");
                    }
                } catch (error) {
                     console.error("Failed to import data:", error);
                    alert(`Failed to import data. Please ensure you are uploading a valid backup file. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                } finally {
                     if (importInputRef.current) {
                        importInputRef.current.value = '';
                    }
                }
            };
            reader.readAsText(file);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="max-w-2xl w-full bg-white p-8 sm:p-12 rounded-2xl shadow-lg text-center">
                <h1 className="text-4xl font-bold text-orange-600">{translateUI('storeName')}</h1>
                <h2 className="mt-4 text-2xl font-semibold text-gray-700">Application Setup</h2>
                <p className="mt-4 text-gray-600">
                    Welcome! Because the app is running in a development environment, its data is cleared whenever the code is updated.
                    To preserve your data (products, users, orders, etc.), you should **export it before requesting an update** and import it after.
                </p>
                <p className="mt-2 text-gray-600">
                    How would you like to proceed?
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center">
                         <DownloadIcon className="w-12 h-12 text-blue-500 mb-4" />
                         <h3 className="text-xl font-semibold text-gray-800">Start with Sample Data</h3>
                         <p className="text-gray-500 mt-2 mb-4 text-sm">
                            Perfect for first-time use or testing. This will load a default set of products, categories, and user accounts.
                         </p>
                         <button 
                            onClick={initializeWithSampleData} 
                            className="w-full mt-auto bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Load Sample Data
                        </button>
                    </div>
                     <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center">
                         <UploadIcon className="w-12 h-12 text-green-500 mb-4" />
                         <h3 className="text-xl font-semibold text-gray-800">Import from Backup</h3>
                         <p className="text-gray-500 mt-2 mb-4 text-sm">
                            Restore all your application data from a previously exported <code className="text-xs bg-gray-200 p-1 rounded">.json</code> backup file.
                         </p>
                          <input type="file" ref={importInputRef} onChange={handleImport} accept=".json" className="hidden" />
                         <button 
                            onClick={handleImportClick}
                            className="w-full mt-auto bg-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Import Backup File
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupGuide;
