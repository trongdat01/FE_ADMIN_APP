import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon?: React.ReactNode;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon,
    color = 'blue'
}) => {
    const getColorClasses = () => {
        switch (color) {
            case 'green':
                return 'bg-green-100 text-green-800';
            case 'yellow':
                return 'bg-yellow-100 text-yellow-800';
            case 'red':
                return 'bg-red-100 text-red-800';
            case 'purple':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const getIconBgColor = () => {
        switch (color) {
            case 'green':
                return 'bg-green-500';
            case 'yellow':
                return 'bg-yellow-500';
            case 'red':
                return 'bg-red-500';
            case 'purple':
                return 'bg-purple-500';
            default:
                return 'bg-indigo-500';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>

                    {change !== undefined && (
                        <div className="flex items-center mt-2">
                            {change >= 0 ? (
                                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            )}
                            <span className={`text-sm ml-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {Math.abs(change)}%
                            </span>
                        </div>
                    )}
                </div>

                {icon && (
                    <div className={`p-3 rounded-full ${getIconBgColor()}`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
