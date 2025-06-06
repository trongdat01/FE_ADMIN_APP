import React, { useEffect, useState } from 'react';
import { checkConnection } from '../../api';

interface BackendInfo {
    origin?: string;
    timestamp?: string;
    [key: string]: any;
}

interface ConnectionResult {
    connected: boolean;
    status?: number;
    data?: BackendInfo;
    message: string;
    error?: any;
}

const ConnectionStatus: React.FC = () => {
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
    const [backendInfo, setBackendInfo] = useState<BackendInfo | null>(null);
    const [connectionResult, setConnectionResult] = useState<ConnectionResult | null>(null);

    const testConnection = async () => {
        setConnectionStatus('connecting');
        try {
            const result = await checkConnection();
            setConnectionResult(result);

            if (result.connected) {
                setConnectionStatus('connected');
                setBackendInfo(result.data || null);
            } else {
                setConnectionStatus('error');
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            setConnectionStatus('error');
        }
    };

    useEffect(() => {
        testConnection();
    }, []);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">🔌 Backend Connection Status</h2>
                <button
                    onClick={testConnection}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    🔄 Test Again
                </button>
            </div>

            {connectionStatus === 'connecting' && (
                <div className="flex items-center text-orange-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-3"></div>
                    <p>🔄 Đang kết nối Backend...</p>
                </div>
            )}

            {connectionStatus === 'connected' && backendInfo && (
                <div className="text-green-600 space-y-3">
                    <p className="font-medium">✅ Kết nối Backend thành công!</p>
                    <div className="text-sm space-y-1">
                        <p><span className="font-medium">📡 Origin:</span> {backendInfo.origin || 'N/A'}</p>
                        <p><span className="font-medium">⏰ Timestamp:</span> {backendInfo.timestamp || 'N/A'}</p>
                        <p><span className="font-medium">🔢 Status:</span> {connectionResult?.status}</p>
                    </div>
                    <details className="mt-4">
                        <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                            📊 Backend Info (Click to expand)
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 overflow-auto">
                            {JSON.stringify(backendInfo, null, 2)}
                        </pre>
                    </details>
                </div>
            )}

            {connectionStatus === 'error' && (
                <div className="text-red-600 space-y-3">
                    <p className="font-medium">❌ Lỗi kết nối Backend!</p>
                    <div className="text-sm">
                        <p><span className="font-medium">Lỗi:</span> {connectionResult?.message}</p>
                        <p className="text-gray-600 mt-2">
                            💡 <strong>Troubleshooting:</strong>
                        </p>
                        <ul className="list-disc list-inside text-gray-600 text-xs mt-1 space-y-1">
                            <li>Đảm bảo backend đang chạy tại <code className="bg-gray-100 px-1 rounded">http://localhost:8888</code></li>
                            <li>Kiểm tra CORS configuration</li>
                            <li>Xem browser console và backend terminal logs</li>
                        </ul>
                    </div>
                    {connectionResult?.error && (
                        <details className="mt-4">
                            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                                🔍 Error Details
                            </summary>
                            <pre className="mt-2 p-3 bg-red-50 rounded text-xs text-red-600 overflow-auto">
                                {JSON.stringify(connectionResult.error, null, 2)}
                            </pre>
                        </details>
                    )}
                </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
                <p><strong>📋 Backend Info:</strong></p>
                <p>• URL: <code>http://localhost:8888/api</code></p>
                <p>• Health Endpoint: <code>/health</code></p>
                <p>• CORS: Enabled</p>
            </div>
        </div>
    );
};

export default ConnectionStatus;
