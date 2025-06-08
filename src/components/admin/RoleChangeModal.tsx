import React, { useState, useEffect } from 'react';
import * as AdminTypes from '../../types/adminUser.types';

interface RoleChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (newRole: "admin" | "staff") => void;
    user: AdminTypes.AdminUser | null;
}

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    user,
}) => {
    const [selectedRole, setSelectedRole] = useState<"admin" | "staff">("staff");

    useEffect(() => {
        // Set the opposite role of the current user's role when modal opens
        if (user) {
            setSelectedRole(user.role === 'admin' ? 'staff' : 'admin');
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const isPromoting = selectedRole === 'admin';
    const currentRole = user.role;
    const actionText = isPromoting ? 'nâng cấp' : 'hạ cấp';

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Thay đổi vai trò
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Bạn đang thay đổi vai trò của "{user.username}" từ <strong>{currentRole}</strong> sang <strong>{selectedRole}</strong>.
                                    {currentRole === 'admin' && selectedRole === 'staff' && (
                                        <span className="block mt-2 text-yellow-600">
                                            Lưu ý: Việc hạ cấp từ Admin xuống Staff sẽ giới hạn quyền truy cập của người dùng này.
                                        </span>
                                    )}
                                </p>

                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-700">
                                        Chọn vai trò mới:
                                    </label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value as "admin" | "staff")}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => {
                                onConfirm(selectedRole);
                            }}
                        >
                            Thay đổi vai trò
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleChangeModal;
