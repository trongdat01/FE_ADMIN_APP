export interface AdminUser {
    id: string;
    username: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    role: "admin" | "staff";
    isActive: boolean;
    isSuperAdmin?: boolean;
}

export interface AdminUserListResponse {
    success: boolean;
    data: {
        count: number;
        data: AdminUser[];
    };
}

export interface AdminUserDetailResponse {
    success: boolean;
    data: {
        data: AdminUser;
    };
}

export interface CreateAdminUserRequest {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    role: "admin" | "staff";
}

export interface UpdateAdminUserRequest {
    username?: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
}

export interface CreateAdminUserResponse {
    success: boolean;
    message: string;
    data: {
        user: AdminUser;
    };
}

export interface StatusUpdateRequest {
    isActive: boolean;
}

export interface RoleUpdateRequest {
    role: "admin" | "staff";
}

export interface PasswordResetRequest {
    newPassword: string;
}

export interface GenericResponse {
    success: boolean;
    message: string;
}

export interface SuperAdminCheckResponse {
    success: boolean;
    message: string;
    data?: {
        isSuperAdmin: boolean;
    };
}
