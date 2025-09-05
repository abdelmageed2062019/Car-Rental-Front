import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllBranches,
  fetchBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchStats,
  BranchData,
  BranchStats
} from "@/lib/crud/branches";

// Query hooks
export const useAllBranches = () => {
  return useQuery({
    queryKey: ["adminBranches"],
    queryFn: fetchAllBranches,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBranchById = (branchId: string) => {
  return useQuery({
    queryKey: ["branch", branchId],
    queryFn: () => fetchBranchById(branchId),
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBranchStats = (branches: any[] = []) => {
  return {
    data: getBranchStats(branches),
    isLoading: false,
    error: null,
  };
};

// Mutation hooks
export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (branchData: BranchData) => createBranch(branchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBranches"] });
      queryClient.invalidateQueries({ queryKey: ["branchStats"] });
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ branchId, updateData }: { branchId: string; updateData: Partial<BranchData> }) =>
      updateBranch(branchId, updateData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminBranches"] });
      queryClient.invalidateQueries({ queryKey: ["branch", variables.branchId] });
      queryClient.invalidateQueries({ queryKey: ["branchStats"] });
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (branchId: string) => deleteBranch(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBranches"] });
      queryClient.invalidateQueries({ queryKey: ["branchStats"] });
    },
  });
};

// Legacy export for existing components
export const useBranches = () => {
  return useAllBranches();
};