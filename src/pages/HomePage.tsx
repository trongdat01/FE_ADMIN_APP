import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import ConnectionStatus from '../components/common/ConnectionStatus';

const HomePage: React.FC = () => {
    return (
        <MainLayout>
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        🚀 Frontend-Backend Connection Test
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Kiểm tra kết nối giữa Frontend và Backend.
                        Đảm bảo backend đang chạy tại <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8888</code>
                    </p>
                </div>

                <ConnectionStatus />

                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        🛠️ Quick Backend Commands
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div>
                            <strong>Start Backend:</strong>
                            <code className="ml-2 bg-gray-200 px-2 py-1 rounded">npm run dev</code>
                        </div>
                        <div>
                            <strong>Check Port:</strong>
                            <code className="ml-2 bg-gray-200 px-2 py-1 rounded">netstat -ano | findstr :8888</code>
                        </div>
                        <div>
                            <strong>Test with cURL:</strong>
                            <code className="ml-2 bg-gray-200 px-2 py-1 rounded">curl http://localhost:8888/api/health</code>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default HomePage;
