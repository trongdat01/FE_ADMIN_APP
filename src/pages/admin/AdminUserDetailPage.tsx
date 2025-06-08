import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layouts/MainLayout';
import { adminService } from '../../services/admin.service';
import * as AdminTypes from '../../types/adminUser.types';
import { useAuth } from '../../context/AuthContext';
import DeleteConfirmationModal from '../../components/admin/DeleteConfirmationModal';
import StatusToggleModal from '../../components/admin/StatusToggleModal';
import RoleChangeModal from '../../components/admin/RoleChangeModal';
import ResetPasswordModal from '../../components/admin/ResetPasswordModal';

const AdminUserDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [user, setUser] = useState<AdminTypes.AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    // Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            setLoading(true);

            try {
                // Check if superadmin
                const superAdminCheck = await adminService.checkSuperAdmin();
                setIsSuperAdmin(superAdminCheck.success && superAdminCheck.data?.isSuperAdmin || false);

                // Load user details
                const response = await adminService.getAdminUserById(id);
                setUser(response.data.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Không thể tải thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleDelete = async () => {
        if (!user) return;

        try {
            await adminService.deleteAdminUser(user.id);
            navigate('/admin/users', { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể xóa người dùng');
        }
    };

    const handleStatusToggle = async (newStatus: boolean) => {
        if (!user) return;

        try {
            await adminService.updateUserStatus(user.id, { isActive: newStatus });
            setUser(prev => prev ? { ...prev, isActive: newStatus } : null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể cập nhật trạng thái');
        }
    };

    const handleRoleChange = async (newRole: "admin" | "staff") => {
        if (!user) return;

        try {
            await adminService.updateUserRole(user.id, { role: newRole });
            setUser(prev => prev ? { ...prev, role: newRole } : null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể cập nhật vai trò');
        }
    };

    const handlePasswordReset = async (newPassword: string) => {
        if (!user) return;

        setPasswordError(null);

        try {
            await adminService.resetUserPassword(user.id, { newPassword });
            setPasswordSuccess('Đặt lại mật khẩu thành công');
            setTimeout(() => {
                setResetPasswordModalOpen(false);
                setPasswordSuccess(null);
            }, 1500);
        } catch (err: any) {
            setPasswordError(err.response?.data?.message || 'Không thể đặt lại mật khẩu');
        }
    };

    const canManageUser = (targetUser: AdminTypes.AdminUser | null) => {
        if (!targetUser || !currentUser) return false;

        // SuperAdmin can manage everyone except themselves
        if (isSuperAdmin) {
            return targetUser.id !== currentUser.id;
        }

        // Regular admin can only manage staff
        if (currentUser.role === 'admin') {
            return targetUser.role === 'staff';
        }

        // Staff can't manage anyone
        return false;
    };

    const canChangeRole = (targetUser: AdminTypes.AdminUser | null) => {
        if (!targetUser || !currentUser) return false;
        return isSuperAdmin && targetUser.id !== currentUser.id && !targetUser.isSuperAdmin;
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </MainLayout>
        );
    }

    if (error || !user) {
        return (
            <MainLayout>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-red-800">{error || "Không tìm thấy người dùng"}</h3>
                    <div className="mt-4">
                        <Link
                            to="/admin/users"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Quay lại danh sách
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chi tiết người dùng</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Xem và quản lý thông tin tài khoản
                    </p>
                </div>

                <div className="flex space-x-3">
                    <Link
                        to="/admin/users"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Quay lại
                    </Link>

                    {canManageUser(user) && (
                        <Link
                            to={`/admin/users/${user.id}/edit`}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Chỉnh sửa
                        </Link>
                    )}
                </div>
            </div>

            {/* User info card */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Thông tin người dùng
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Chi tiết thông tin tài khoản và liên hệ
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {user.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                        </span>

                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                            {user.role}
                        </span>

                        {user.isSuperAdmin && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Super Admin
                            </span>
                        )}
                    </div>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                ID
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user.id}
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Tên đăng nhập
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user.username}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Họ tên
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user.fullName}
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user.email}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Số điện thoại
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user.phoneNumber || 'Chưa cung cấp'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Actions */}
            {canManageUser(user) && (
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Thao tác quản lý tài khoản
                        </h3>
                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <button
                                    onClick={() => setResetPasswordModalOpen(true)}
                                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                    Đặt lại mật khẩu
                                </button>
                            </div>

                            <div>
                                <button
                                    onClick={() => setStatusModalOpen(true)}
                                    className={`inline-flex items-center justify-center w-full px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md ${user.isActive
                                        ? 'text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                                        : 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                    disabled={user.isSuperAdmin || user.id === currentUser?.id}
                                >
                                    {user.isActive ? (
                                        <>
                                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                            </svg>
                                            Vô hiệu hóa tài khoản
                                        </>
                                    ) : (
                                        <>
                                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Kích hoạt tài khoản
                                        </>
                                    )}
                                </button>
                            </div>

                            {canChangeRole(user) && (
                                <div>
                                    <button
                                        onClick={() => setRoleModalOpen(true)}
                                        className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                        Thay đổi vai trò
                                    </button>
                                </div>
                            )}

                            <div>
                                <button
                                    onClick={() => setDeleteModalOpen(true)}
                                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    disabled={user.isSuperAdmin || user.id === currentUser?.id}
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Xóa tài khoản
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modals */}
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Xóa tài khoản"
                message={`Bạn có chắc chắn muốn xóa tài khoản "${user.username}" không? Hành động này không thể hoàn tác.`}
            />

            <StatusToggleModal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                onConfirm={handleStatusToggle}
                user={user}
            />

            <RoleChangeModal
                isOpen={roleModalOpen}
                onClose={() => setRoleModalOpen(false)}
                onConfirm={handleRoleChange}
                user={user}
            />

            <ResetPasswordModal
                isOpen={resetPasswordModalOpen}
                onClose={() => {
                    setResetPasswordModalOpen(false);
                    setPasswordError(null);
                    setPasswordSuccess(null);
                }}
                onConfirm={handlePasswordReset}
                user={user}
                error={passwordError}
                success={passwordSuccess}
            />
        </MainLayout>
    );
};

export default AdminUserDetailPage;
