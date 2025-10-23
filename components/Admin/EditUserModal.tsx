
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface User {
  id: string;
  email: string;
  mobile?: string;
  role: 'admin' | 'user';
}

interface EditUserModalProps {
    user: User;
    onClose: () => void;
    onSave: (userId: string, updates: { email?: string; mobile?: string; pass?: string }) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
    const { translateUI } = useLanguage();
    const [email, setEmail] = useState(user.email);
    const [mobile, setMobile] = useState(user.mobile || '');
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const updates: { email?: string; mobile?: string; pass?: string } = {};

        if (email !== user.email) updates.email = email;
        if (mobile !== (user.mobile || '')) updates.mobile = mobile;
        if (password) updates.pass = password;
        
        if (Object.keys(updates).length > 0) {
            await onSave(user.id, updates);
        }
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b">
                    <h3 className="text-2xl font-bold text-gray-800">{translateUI('editUser')}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{translateUI('email')}</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{translateUI('mobile')}</label>
                            <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{translateUI('newPassword')}</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500" placeholder="Leave blank to keep current password" />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} disabled={isSaving} className="bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                            {translateUI('cancel')}
                        </button>
                        <button type="submit" disabled={isSaving} className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:bg-orange-300">
                            {isSaving ? 'Saving...' : translateUI('saveChanges')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
