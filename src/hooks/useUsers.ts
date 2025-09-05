import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchAllUsers, 
  searchUsers,
  fetchUserById,
  updateUser,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getUserStats,
  getUserProfile,
  updateUserProfile,
  changePassword,
  AdminUsersParams,
  ProfileUpdateData,
  ChangePasswordData
} from "@/lib/api/users";

export const useAllUsers = (params: AdminUsersParams = {}) => {
  return useQuery({
    queryKey: ["adminUsers", params],
    queryFn: () => fetchAllUsers(params),
    staleTime: 2 * 60 * 1000, 
    enabled: true,
  });
};

export const useSearchUsers = (searchParams: {
  name?: string;
  email?: string;
  role?: "user" | "admin" | "manager";
  isActive?: boolean;
}) => {
  return useQuery({
    queryKey: ["searchUsers", searchParams],
    queryFn: () => searchUsers(searchParams),
    staleTime: 2 * 60 * 1000,
    enabled: !!(searchParams.name || searchParams.email || searchParams.role || searchParams.isActive !== undefined),
  });
};

export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    staleTime: 5 * 60 * 1000, 
    enabled: !!userId,
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: getUserStats,
    staleTime: 5 * 60 * 1000, 
    enabled: true,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) => 
      updateUserStatus(userId, isActive),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, updateData }: { 
      userId: string; 
      updateData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        role?: "user" | "admin" | "manager";
        isActive?: boolean;
        isEmailVerified?: boolean;
      }
    }) => updateUser(userId, updateData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["searchUsers"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "user" | "admin" | "manager" }) => 
      updateUserRole(userId, role),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["searchUsers"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};


export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.removeQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

// Profile management hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profileData: ProfileUpdateData) => updateUserProfile(profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData: ChangePasswordData) => changePassword(passwordData),
  });
};
