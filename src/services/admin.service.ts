import api from './api';
import * as AdminTypes from '../types/adminUser.types';

export const adminService = {
    // Get all admin users with optional role filter
    getAdminUsers: async (role?: string): Promise<AdminTypes.AdminUserListResponse> => {
        const response = await api.get<AdminTypes.AdminUserListResponse>(
            `/auth/admin${role ? `?role=${role}` : ''}`
        );
        return response.data;
    },

    // Get specific admin user by ID
    getAdminUserById: async (id: string): Promise<AdminTypes.AdminUserDetailResponse> => {
        const response = await api.get<AdminTypes.AdminUserDetailResponse>(`/auth/admin/${id}`);
        return response.data;
    },

    // Create new admin/staff user
    createAdminUser: async (userData: AdminTypes.CreateAdminUserRequest): Promise<AdminTypes.CreateAdminUserResponse> => {
        const response = await api.post<AdminTypes.CreateAdminUserResponse>('/auth/admin', userData);
        return response.data;
    },

    // Update existing admin/staff user
    updateAdminUser: async (id: string, userData: AdminTypes.UpdateAdminUserRequest): Promise<AdminTypes.AdminUserDetailResponse> => {
        const response = await api.put<AdminTypes.AdminUserDetailResponse>(`/auth/admin/${id}`, userData);
        return response.data;
    },

    // Update user status (active/inactive)
    updateUserStatus: async (id: string, statusData: AdminTypes.StatusUpdateRequest): Promise<AdminTypes.GenericResponse> => {
        const response = await api.patch<AdminTypes.GenericResponse>(`/auth/admin/${id}/status`, statusData);
        return response.data;
    },

    // Update user role (admin/staff)
    updateUserRole: async (id: string, roleData: AdminTypes.RoleUpdateRequest): Promise<AdminTypes.GenericResponse> => {
        const response = await api.patch<AdminTypes.GenericResponse>(`/auth/admin/${id}/role`, roleData);
        return response.data;
    },

    // Reset user password
    resetUserPassword: async (id: string, passwordData: AdminTypes.PasswordResetRequest): Promise<AdminTypes.GenericResponse> => {
        const response = await api.post<AdminTypes.GenericResponse>(`/auth/admin/${id}/reset-password`, passwordData);
        return response.data;
    },

    // Delete admin/staff user
    deleteAdminUser: async (id: string): Promise<AdminTypes.GenericResponse> => {
        const response = await api.delete<AdminTypes.GenericResponse>(`/auth/admin/${id}`);
        return response.data;
    },

    // Check if current user is SuperAdmin
    checkSuperAdmin: async (): Promise<AdminTypes.SuperAdminCheckResponse> => {
        try {
            const response = await api.get<AdminTypes.SuperAdminCheckResponse>('/admin/auth/superadmin/check');
            return response.data;
        } catch (error) {
            // Return a default response structure on error
            return {
                success: false,
                message: 'Failed to check SuperAdmin status'
            };
        }
    }
};
