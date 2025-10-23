
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { EditIcon } from '../icons';
import EditUserModal from './EditUserModal';

interface User {
  id: string;
  email: string;
  mobile?: string;
  role: 'admin' | 'user';
}

const ManageUsers: React.FC = () => {
    const { getUsers, updateUserCredentials } = useAuth();
    const { translateUI } = useLanguage();
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const allUsers = getUsers();

    const handleSaveUser = async (userId: string, updates: { email?: string; mobile?: string; pass?: string; }) => {
        await updateUserCredentials(userId, updates);
        setEditingUser(null);
    };

    return (
        <>
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSaveUser}
                />
            )}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{translateUI('userManagement')}</h2>
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {allUsers.map(user => (
                        <div key={user.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800">{user.email}</p>
                                    <p className="text-sm text-gray-500">{user.mobile || 'No mobile'}</p>
                                </div>
                                <button onClick={() => setEditingUser(user)} className="text-blue-600 hover:text-blue-900 p-1" title={translateUI('edit')}>
                                    <EditIcon className="w-5 h-5"/>
                                </button>
                            </div>
                            <div className="border-t mt-2 pt-2">
                                 <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-gray-600">{translateUI('role')}:</span>
                                    <span className="capitalize px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{user.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translateUI('email')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translateUI('mobile')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translateUI('role')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translateUI('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.mobile || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="capitalize px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => setEditingUser(user)} className="text-blue-600 hover:text-blue-900 flex items-center space-x-1" title={translateUI('edit')}>
                                            <EditIcon className="w-5 h-5"/>
                                            <span>{translateUI('edit')}</span>
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

export default ManageUsers;
