export interface LoginRequest {
    identifier: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
    isSuperAdmin: boolean;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (identifier: string, password: string) => Promise<User | null>;
    logout: () => void;
    error: string | null;
}
