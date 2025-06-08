import React from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import AdminUserList from '../../components/admin/AdminUserList';

const AdminUserListPage: React.FC = () => {
    return (
        <MainLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng Admin/Staff</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Quản lý tất cả người dùng có quyền truy cập vào hệ thống quản trị
                </p>
            </div>

            <AdminUserList />
        </MainLayout>
    );
};

export default AdminUserListPage;
