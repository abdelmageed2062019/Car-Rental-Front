import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
     fetchUserRentals, 
     fetchAllRentals, 
     fetchRentalById,
     updateRentalStatus,
     activateRental,
     completeRental,
     cancelRental,
     deleteRental,
     getRentalStats,
     AdminRentalsParams
} from "@/lib/crud/rentals";

export const useUserRentals = (page: number = 1, limit: number = 10) => {
     return useQuery({
          queryKey: ["userRentals", page, limit],
          queryFn: () => fetchUserRentals(page, limit),
          staleTime: 5 * 60 * 1000,
          enabled: page > 0 && limit > 0,
     });
};

// Admin hooks for rental management
export const useAllRentals = (params: AdminRentalsParams = {}) => {
     return useQuery({
          queryKey: ["adminRentals", params],
          queryFn: () => fetchAllRentals(params),
          staleTime: 2 * 60 * 1000,
          enabled: true,
     });
};

export const useRentalById = (rentalId: string) => {
     return useQuery({
          queryKey: ["rental", rentalId],
          queryFn: () => fetchRentalById(rentalId),
          staleTime: 5 * 60 * 1000,
          enabled: !!rentalId,
     });
};

export const useRentalStats = () => {
     return useQuery({
          queryKey: ["rentalStats"],
          queryFn: getRentalStats,
          staleTime: 5 * 60 * 1000,
          refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
     });
};

// Mutations for admin actions
export const useUpdateRentalStatus = () => {
     const queryClient = useQueryClient();
     
     return useMutation({
          mutationFn: ({ rentalId, status, adminNotes }: { 
               rentalId: string; 
               status: string; 
               adminNotes?: string 
          }) => updateRentalStatus(rentalId, status, adminNotes),
          onSuccess: (data, variables) => {
               // Invalidate and refetch related queries
               queryClient.invalidateQueries({ queryKey: ["adminRentals"] });
               queryClient.invalidateQueries({ queryKey: ["rental", variables.rentalId] });
               queryClient.invalidateQueries({ queryKey: ["rentalStats"] });
               queryClient.invalidateQueries({ queryKey: ["userRentals"] });
          },
     });
};

export const useActivateRental = () => {
     const queryClient = useQueryClient();
     
     return useMutation({
          mutationFn: (rentalId: string) => activateRental(rentalId),
          onSuccess: (data, rentalId) => {
               queryClient.invalidateQueries({ queryKey: ["adminRentals"] });
               queryClient.invalidateQueries({ queryKey: ["rental", rentalId] });
               queryClient.invalidateQueries({ queryKey: ["rentalStats"] });
               queryClient.invalidateQueries({ queryKey: ["userRentals"] });
          },
     });
};

export const useCompleteRental = () => {
     const queryClient = useQueryClient();
     
     return useMutation({
          mutationFn: ({ rentalId, returnData }: { 
               rentalId: string; 
               returnData?: unknown 
          }) => completeRental(rentalId, returnData),
          onSuccess: (data, variables) => {
               queryClient.invalidateQueries({ queryKey: ["adminRentals"] });
               queryClient.invalidateQueries({ queryKey: ["rental", variables.rentalId] });
               queryClient.invalidateQueries({ queryKey: ["rentalStats"] });
               queryClient.invalidateQueries({ queryKey: ["userRentals"] });
          },
     });
};

export const useCancelRental = () => {
     const queryClient = useQueryClient();
     
     return useMutation({
          mutationFn: ({ rentalId, reason }: { 
               rentalId: string; 
               reason?: string 
          }) => cancelRental(rentalId, reason),
          onSuccess: (data, variables) => {
               queryClient.invalidateQueries({ queryKey: ["adminRentals"] });
               queryClient.invalidateQueries({ queryKey: ["rental", variables.rentalId] });
               queryClient.invalidateQueries({ queryKey: ["rentalStats"] });
               queryClient.invalidateQueries({ queryKey: ["userRentals"] });
          },
     });
};

export const useDeleteRental = () => {
     const queryClient = useQueryClient();
     
     return useMutation({
          mutationFn: (rentalId: string) => deleteRental(rentalId),
          onSuccess: (data, rentalId) => {
               queryClient.invalidateQueries({ queryKey: ["adminRentals"] });
               queryClient.removeQueries({ queryKey: ["rental", rentalId] });
               queryClient.invalidateQueries({ queryKey: ["rentalStats"] });
               queryClient.invalidateQueries({ queryKey: ["userRentals"] });
          },
     });
};
