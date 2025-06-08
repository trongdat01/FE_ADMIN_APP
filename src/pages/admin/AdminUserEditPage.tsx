import React from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import AdminUserForm from '../../components/admin/AdminUserForm';
import { Link, useParams } from 'react-router-dom';

const AdminUserEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <MainLayout>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa người dùng</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Cập nhật thông tin tài khoản người dùng
                    </p>
                </div>

                <Link
                    to="/admin/users"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại
                </Link>
            </div>

            <AdminUserForm isEdit={true} />
        </MainLayout>
    );
};

export default AdminUserEditPage;
