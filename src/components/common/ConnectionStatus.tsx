import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConnectionStatus: React.FC = () => {
    const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
    const [responseTime, setResponseTime] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const testConnection = async () => {
        setStatus('loading');
        setErrorMessage(null);

        const startTime = performance.now();

        try {
            // Use /api/health endpoint or whatever health check endpoint you have
            await axios.get('http://localhost:8888/api/health', { timeout: 5000 });

            const endTime = performance.now();
            setResponseTime(Math.round(endTime - startTime));
            setStatus('connected');
        } catch (error) {
            setStatus('error');
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    setErrorMessage('Connection timeout. Backend server is not responding.');
                } else if (!error.response) {
                    setErrorMessage('Cannot connect to the backend server. Is it running?');
                } else {
                    setErrorMessage(`Error: ${error.response.status} - ${error.response.statusText}`);
                }
            } else {
                setErrorMessage('An unexpected error occurred');
            }
        }
    };

    useEffect(() => {
        testConnection();
    }, []);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Backend Connection Status</h3>
                <button
                    onClick={testConnection}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Test Again
                </button>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    {status === 'loading' && (
                        <div className="h-8 w-8 rounded-full border-2 border-t-indigo-600 animate-spin"></div>
                    )}
                    {status === 'connected' && (
                        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                </div>

                <div>
                    {status === 'loading' && <p className="text-gray-500">Checking connection...</p>}

                    {status === 'connected' && (
                        <div>
                            <p className="text-green-600 font-medium">Connected to backend successfully</p>
                            {responseTime !== null && (
                                <p className="text-sm text-gray-500">Response time: {responseTime} ms</p>
                            )}
                        </div>
                    )}

                    {status === 'error' && (
                        <div>
                            <p className="text-red-600 font-medium">Connection failed</p>
                            {errorMessage && <p className="text-sm text-gray-700">{errorMessage}</p>}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 text-sm">
                <p className="text-gray-600">
                    Connection URL:{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8888/api</code>
                </p>
            </div>
        </div>
    );
};

export default ConnectionStatus;
