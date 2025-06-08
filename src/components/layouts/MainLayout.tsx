import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/admin.service';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        // Check if current user is SuperAdmin
        const checkSuperAdmin = async () => {
            try {
                const response = await adminService.checkSuperAdmin();
                setIsSuperAdmin(response.success && response.data?.isSuperAdmin || false);
            } catch (err) {
                setIsSuperAdmin(false);
            }
        };

        if (user?.role === 'admin') {
            checkSuperAdmin();
        }
    }, [user]);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: 'dashboard' },
        { name: 'Người dùng', href: '/users', icon: 'users' },
        { name: 'Sản phẩm', href: '/products', icon: 'products' },
        { name: 'Đơn hàng', href: '/orders', icon: 'orders' },
        { name: 'Marketing', href: '/marketing', icon: 'marketing' },
        {
            name: 'Hệ thống',
            href: '/system',
            icon: 'settings',
            submenu: [
                { name: 'Cài đặt', href: '/system/settings' },
                { name: 'Kiểm tra kết nối', href: '/system/connection' },
                ...(user?.role === 'admin' ? [{ name: 'Quản lý Admin/Staff', href: '/admin/users' }] : []),
                { name: 'Logs', href: '/system/logs' },
            ]
        },
    ];

    const renderIcon = (icon: string) => {
        switch (icon) {
            case 'dashboard':
                return (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                );
            case 'users':
                return (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                );
            case 'products':
                return (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                );
            case 'orders':
                return (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                );
            case 'marketing':
                return (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                );
            case 'settings':
                return (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                );
        }
    };

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 flex z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
                </div>
            )}

            {/* Sidebar */}
            <div className={`md:flex md:flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                <div className="flex flex-col w-64 bg-indigo-800 text-white">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-4 bg-indigo-900">
                        <div className="flex items-center">
                            <span className="text-white font-bold text-xl">Admin Dashboard</span>
                        </div>
                    </div>

                    {/* User info */}
                    <div className="px-4 py-4 border-b border-indigo-700 mb-2">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                {user?.fullName?.charAt(0) || 'A'}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">{user?.fullName || 'Admin User'}</p>
                                <p className="text-xs text-indigo-200">{user?.role || 'admin'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto">
                        <div className="px-2 py-2 space-y-1">
                            {navigation.map((item) => {
                                const isCurrentPath = location.pathname === item.href ||
                                    (item.submenu?.some(subItem => location.pathname === subItem.href));

                                return (
                                    <div key={item.name}>
                                        <Link
                                            to={item.href}
                                            className={`${isCurrentPath
                                                ? 'bg-indigo-900 text-white'
                                                : 'text-indigo-100 hover:bg-indigo-700'
                                                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                                        >
                                            <div className="mr-3 text-indigo-300">{renderIcon(item.icon)}</div>
                                            {item.name}
                                        </Link>

                                        {/* Submenu if exists */}
                                        {item.submenu && (
                                            <div className="pl-10 mt-1 space-y-1">
                                                {item.submenu.map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        to={subItem.href}
                                                        className={`${location.pathname === subItem.href
                                                            ? 'bg-indigo-900 text-white'
                                                            : 'text-indigo-200 hover:bg-indigo-700'
                                                            } group flex items-center px-2 py-1.5 text-sm rounded-md`}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
                    <button
                        className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex-1 px-4 flex justify-end">
                        <div className="ml-4 flex items-center md:ml-6">
                            {/* Notifications */}
                            <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none">
                                <span className="sr-only">View notifications</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            {/* Profile dropdown */}
                            <div className="ml-3 relative">
                                <button className="flex text-sm rounded-full text-gray-500 hover:text-gray-700">
                                    <span className="sr-only">Open user menu</span>
                                    <div className="flex items-center">
                                        <span className="mr-2">{user?.fullName || 'Admin'}</span>
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Logout button */}
                                <button
                                    className="ml-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded text-sm"
                                    onClick={logout}
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6 px-4 sm:px-6 md:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;