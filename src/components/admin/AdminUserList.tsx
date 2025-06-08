import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import * as AdminTypes from '../../types/adminUser.types';
import { useAuth } from '../../context/AuthContext';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import StatusToggleModal from './StatusToggleModal';
import RoleChangeModal from './RoleChangeModal';

const AdminUserList: React.FC = () => {
    const [users, setUsers] = useState<AdminTypes.AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
    const { user } = useAuth();
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    // Modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        const checkSuperAdminStatus = async () => {
            try {
                const response = await adminService.checkSuperAdmin();
                setIsSuperAdmin(response.success && response.data?.isSuperAdmin || false);
            } catch (err) {
                setIsSuperAdmin(false);
            }
        };

        checkSuperAdminStatus();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const result = await adminService.getAdminUsers(roleFilter || undefined);

                // Apply status filter if needed
                let filteredUsers = result.data.data;
                if (statusFilter !== null) {
                    filteredUsers = filteredUsers.filter(u => u.isActive === statusFilter);
                }

                setUsers(filteredUsers);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Không thể tải danh sách người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [roleFilter, statusFilter]);

    const handleDeleteClick = (user: AdminUser) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const handleStatusToggleClick = (user: AdminUser) => {
        setSelectedUser(user);
        setStatusModalOpen(true);
    };

    const handleRoleChangeClick = (user: AdminUser) => {
        setSelectedUser(user);
        setRoleModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        try {
            await adminService.deleteAdminUser(selectedUser.id);
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setDeleteModalOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể xóa người dùng');
        }
    };

    const handleStatusToggle = async (newStatus: boolean) => {
        if (!selectedUser) return;

        try {
            await adminService.updateUserStatus(selectedUser.id, { isActive: newStatus });
            setUsers(users.map(u =>
                u.id === selectedUser.id ? { ...u, isActive: newStatus } : u
            ));
            setStatusModalOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể cập nhật trạng thái');
        }
    };

    const handleRoleChange = async (newRole: "admin" | "staff") => {
        if (!selectedUser) return;

        try {
            await adminService.updateUserRole(selectedUser.id, { role: newRole });
            setUsers(users.map(u =>
                u.id === selectedUser.id ? { ...u, role: newRole } : u
            ));
            setRoleModalOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể cập nhật vai trò');
        }
    };

    const canManageAdmin = (targetUser: AdminUser) => {
        if (!user) return false;

        // SuperAdmin can manage everyone except themselves
        if (isSuperAdmin) {
            return targetUser.id !== user.id;
        }

        // Regular admin can only manage staff
        if (user.role === 'admin') {
            return targetUser.role === 'staff';
        }

        // Staff can't manage anyone
        return false;
    };

    const canChangeRole = (targetUser: AdminUser) => {
        // Only SuperAdmin can change roles
        return isSuperAdmin && targetUser.id !== user?.id && !targetUser.isSuperAdmin;
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Quản lý người dùng Admin/Staff</h3>

                {(isSuperAdmin || user?.role === 'admin') && (
                    <Link
                        to="/admin/users/create"
                        className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Thêm mới
                    </Link>
                )}
            </div>

            {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
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

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={() => { setRoleFilter(null); setStatusFilter(null); }}
                    className={`px-3 py-1 rounded-full text-sm ${!roleFilter && statusFilter === null ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
                >
                    Tất cả
                </button>
                <button
                    onClick={() => setRoleFilter('admin')}
                    className={`px-3 py-1 rounded-full text-sm ${roleFilter === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
                >
                    Admin
                </button>
                <button
                    onClick={() => setRoleFilter('staff')}
                    className={`px-3 py-1 rounded-full text-sm ${roleFilter === 'staff' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
                >
                    Staff
                </button>
                <button
                    onClick={() => setStatusFilter(true)}
                    className={`px-3 py-1 rounded-full text-sm ${statusFilter === true ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                    Hoạt động
                </button>
                <button
                    onClick={() => setStatusFilter(false)}
                    className={`px-3 py-1 rounded-full text-sm ${statusFilter === false ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                >
                    Vô hiệu hóa
                </button>
            </div>

            {/* User list table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên đăng nhập
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Họ tên
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vai trò
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Không có dữ liệu người dùng
                                </td>
                            </tr>
                        ) : (
                            users.map((adminUser) => (
                                <tr key={adminUser.id} className={!adminUser.isActive ? 'bg-gray-50' : undefined}>
                                    <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500">
                                        {adminUser.id.substring(adminUser.id.length - 6)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {adminUser.username}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {adminUser.email}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {adminUser.fullName}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${adminUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {adminUser.role}
                                            </span>
                                            {adminUser.isSuperAdmin && (
                                                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Super Admin
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${adminUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {adminUser.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            <Link
                                                to={`/admin/users/${adminUser.id}`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Xem
                                            </Link>

                                            {canManageAdmin(adminUser) && (
                                                <>
                                                    <Link
                                                        to={`/admin/users/${adminUser.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Sửa
                                                    </Link>

                                                    <button
                                                        onClick={() => handleStatusToggleClick(adminUser)}
                                                        className={adminUser.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}
                                                        disabled={adminUser.id === user?.id || adminUser.isSuperAdmin}
                                                    >
                                                        {adminUser.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                                    </button>

                                                    {canChangeRole(adminUser) && (
                                                        <button
                                                            onClick={() => handleRoleChangeClick(adminUser)}
                                                            className="text-purple-600 hover:text-purple-900"
                                                        >
                                                            Đổi vai trò
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleDeleteClick(adminUser)}
                                                        className="text-red-600 hover:text-red-900"
                                                        disabled={adminUser.id === user?.id || adminUser.isSuperAdmin}
                                                    >
                                                        Xóa
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modals */}
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Xóa tài khoản"
                message={`Bạn có chắc chắn muốn xóa tài khoản "${selectedUser?.username}" không? Hành động này không thể hoàn tác.`}
            />

            <StatusToggleModal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                onConfirm={handleStatusToggle}
                user={selectedUser}
            />

            <RoleChangeModal
                isOpen={roleModalOpen}
                onClose={() => setRoleModalOpen(false)}
                onConfirm={handleRoleChange}
                user={selectedUser}
            />
        </div>
    );
};

export default AdminUserList;
