import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import * as AdminTypes from '../../types/adminUser.types';
import { useAuth } from '../../context/AuthContext';

interface AdminUserFormProps {
    isEdit?: boolean;
}

const AdminUserForm: React.FC<AdminUserFormProps> = ({ isEdit = false }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [formData, setFormData] = useState<AdminTypes.CreateAdminUserRequest>({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        role: 'staff',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [originalUser, setOriginalUser] = useState<AdminTypes.AdminUser | null>(null);

    useEffect(() => {
        // Check if the current user is SuperAdmin
        const checkSuperAdminStatus = async () => {
            try {
                const response = await adminService.checkSuperAdmin();
                setIsSuperAdmin(response.success && response.data?.isSuperAdmin || false);
            } catch (err) {
                setIsSuperAdmin(false);
            }
        };

        checkSuperAdminStatus();

        // If editing, load user data
        if (isEdit && id) {
            const fetchUserData = async () => {
                try {
                    setLoading(true);
                    const response = await adminService.getAdminUserById(id);
                    const userData = response.data.data;
                    setOriginalUser(userData);

                    setFormData({
                        username: userData.username,
                        email: userData.email,
                        password: '', // Password is not returned from API
                        fullName: userData.fullName,
                        phoneNumber: userData.phoneNumber || '',
                        role: userData.role,
                    });

                } catch (err: any) {
                    setError(err.response?.data?.message || 'Không thể tải thông tin người dùng');
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        }
    }, [isEdit, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEdit && id) {
                // For edit, we only send fields that can be updated
                const updateData: AdminTypes.UpdateAdminUserRequest = {
                    username: formData.username,
                    email: formData.email,
                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber || undefined,
                };

                await adminService.updateAdminUser(id, updateData);
                setSuccess('Cập nhật thông tin thành công');

            } else {
                // For create, we send all fields
                await adminService.createAdminUser(formData);
                setSuccess('Tạo tài khoản thành công');

                // Clear form after successful creation
                if (!isEdit) {
                    setFormData({
                        username: '',
                        email: '',
                        password: '',
                        fullName: '',
                        phoneNumber: '',
                        role: 'staff',
                    });
                }
            }

            // Navigate back after short delay
            setTimeout(() => {
                navigate('/admin/users');
            }, 1500);

        } catch (err: any) {
            setError(err.response?.data?.message || (isEdit ? 'Không thể cập nhật thông tin' : 'Không thể tạo tài khoản mới'));
        } finally {
            setLoading(false);
        }
    };

    const canEditRole = () => {
        // Only SuperAdmin can set user as Admin
        return isSuperAdmin;
    };

    const canCreateAdminUser = () => {
        // Only SuperAdmin can create Admin users
        if (formData.role === 'admin') {
            return isSuperAdmin;
        }
        // Regular admins can create staff
        return true;
    };

    if (loading && isEdit) {
        return <div className="text-center p-4">Đang tải...</div>;
    }

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                    {isEdit ? 'Chỉnh sửa thông tin người dùng' : 'Tạo tài khoản Admin/Staff mới'}
                </h3>

                {error && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Tên đăng nhập *
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email *
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        {!isEdit && (
                            <div className="sm:col-span-3">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mật khẩu *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="sm:col-span-3">
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Họ tên *
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="fullName"
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Số điện thoại
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Vai trò *
                            </label>
                            <div className="mt-1">
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    disabled={isEdit || !canEditRole()}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option value="staff">Staff</option>
                                    {(isSuperAdmin || formData.role === 'admin') && (
                                        <option value="admin">Admin</option>
                                    )}
                                </select>
                                {!canEditRole() && formData.role !== 'admin' && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        Chỉ Super Admin mới có thể tạo tài khoản Admin mới
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/users')}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (formData.role === 'admin' && !canCreateAdminUser())}
                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading || (formData.role === 'admin' && !canCreateAdminUser())
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                                }`}
                        >
                            {loading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Tạo tài khoản'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminUserForm;
