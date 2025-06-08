import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import StatCard from '../components/dashboard/StatCard';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/admin.service';

const HomePage: React.FC = () => {
    const { user } = useAuth();
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        const checkSuperAdmin = async () => {
            if (user?.role === 'admin') {
                try {
                    const response = await adminService.checkSuperAdmin();
                    setIsSuperAdmin(response.success && response.data?.isSuperAdmin || false);
                } catch (err) {
                    setIsSuperAdmin(false);
                }
            }
        };

        checkSuperAdmin();
    }, [user]);

    return (
        <MainLayout>
            {/* Page Heading */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Chào mừng bạn đến với hệ thống quản trị
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Tổng đơn hàng"
                    value="1,285"
                    change={12.5}
                    icon={
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Người dùng mới"
                    value="342"
                    change={8.1}
                    color="green"
                    icon={
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Doanh thu"
                    value="$24,500"
                    change={-3.2}
                    color="purple"
                    icon={
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Số lượng sản phẩm"
                    value="542"
                    color="yellow"
                    icon={
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    }
                />
            </div>

            {/* Quick Actions and System Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Quick Actions */}
                <div className="col-span-2 bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Link to="/products/create" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="mt-2 text-sm font-medium text-gray-900">Thêm sản phẩm</span>
                        </Link>
                        <Link to="/orders" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="mt-2 text-sm font-medium text-gray-900">Đơn hàng mới</span>
                        </Link>
                        <Link to="/users" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <span className="mt-2 text-sm font-medium text-gray-900">Thêm người dùng</span>
                        </Link>
                        <Link to="/marketing" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                            <span className="mt-2 text-sm font-medium text-gray-900">Tạo khuyến mãi</span>
                        </Link>
                        <Link to="/reports" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="mt-2 text-sm font-medium text-gray-900">Xem báo cáo</span>
                        </Link>
                        <Link to="/system/connection" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a1 1 0 01-1-1V5a1 1 0 011-1h14a1 1 0 011 1v6a1 1 0 01-1 1M5 12a1 1 0 00-1 1v6a1 1 0 001 1h14a1 1 0 001-1v-6a1 1 0 00-1-1H5z" />
                            </svg>
                            <span className="mt-2 text-sm font-medium text-gray-900">Kiểm tra kết nối</span>
                        </Link>
                        {/* Add Admin User Management link if user is admin */}
                        {user?.role === 'admin' && (
                            <Link to="/admin/users" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span className="mt-2 text-sm font-medium text-gray-900">Quản lý Admin/Staff</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Hoạt động gần đây</h2>
                    <div className="flow-root">
                        <ul className="-my-5 divide-y divide-gray-200">
                            <li className="py-3">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">JD</div>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-900">John Doe đã đăng nhập</p>
                                        <p className="text-xs text-gray-500">5 phút trước</p>
                                    </div>
                                </div>
                            </li>
                            <li className="py-3">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">TS</div>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-900">Đơn hàng #1234 đã được thanh toán</p>
                                        <p className="text-xs text-gray-500">30 phút trước</p>
                                    </div>
                                </div>
                            </li>
                            <li className="py-3">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">AL</div>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-900">Alice Liu đã thêm sản phẩm mới</p>
                                        <p className="text-xs text-gray-500">2 giờ trước</p>
                                    </div>
                                </div>
                            </li>
                            <li className="py-3">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">RJ</div>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-900">Khuyến mãi mùa hè đã được tạo</p>
                                        <p className="text-xs text-gray-500">4 giờ trước</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-6">
                        <Link to="/activity" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                            Xem tất cả
                        </Link>
                    </div>
                </div>
            </div>

            {/* Backend Connection Status Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Trạng thái hệ thống</h2>
                    <Link
                        to="/system/connection"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                        Xem chi tiết
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Backend Connection</h3>
                    <div className="flex items-center">
                        <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm text-gray-700">Backend API đang hoạt động</span>
                        <span className="text-xs text-gray-500 ml-2">(http://localhost:8888)</span>
                    </div>
                    <div className="mt-4">
                        <Link
                            to="/system/connection"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                        >
                            <span>Test connection</span>
                            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default HomePage;
