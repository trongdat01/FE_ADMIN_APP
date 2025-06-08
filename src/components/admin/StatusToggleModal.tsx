import React from 'react';
import * as AdminTypes from '../../types/adminUser.types';

interface StatusToggleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (newStatus: boolean) => void;
    user: AdminTypes.AdminUser | null;
}

const StatusToggleModal: React.FC<StatusToggleModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    user,
}) => {
    if (!isOpen || !user) return null;

    const isDeactivating = user.isActive;
    const actionText = isDeactivating ? 'vô hiệu hóa' : 'kích hoạt';
    const statusText = isDeactivating ? 'Vô hiệu hóa' : 'Kích hoạt';

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div className="sm:flex sm:items-start">
                        <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${isDeactivating ? 'bg-yellow-100' : 'bg-green-100'
                            } sm:mx-0 sm:h-10 sm:w-10`}>
                            <svg
                                className={`h-6 w-6 ${isDeactivating ? 'text-yellow-600' : 'text-green-600'}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                {isDeactivating ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                )}
                            </svg>
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {statusText} tài khoản
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Bạn có chắc chắn muốn {actionText} tài khoản "{user.username}" không?
                                    {isDeactivating && ' Tài khoản này sẽ không thể đăng nhập vào hệ thống.'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${isDeactivating
                                ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                            onClick={() => onConfirm(!user.isActive)}
                        >
                            {statusText}
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

export default StatusToggleModal;
