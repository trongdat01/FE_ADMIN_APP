import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/api';
import type { User, AuthContextType } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('accessToken');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (e) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (identifier: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.login({ identifier, password });

            if (response.success) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                return response.data.user;
            } else {
                setError(response.message);
                return null;
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                logout,
                error
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
