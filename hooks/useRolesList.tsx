"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { Role } from "@/types";

interface RolesListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    roles: Role[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      pageSize: number;
    };
  };
  timestamp: string;
}

interface UseRolesListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UseRolesListReturn {
  roles: Role[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
  isLoading: boolean;
  isError: boolean;
  error: any;
  refetch: () => void;
}

const useRolesList = (params: UseRolesListParams = {}): UseRolesListReturn => {
  const axiosAuth = useAxiosAuth();
  
  const {
    page = 1,
    pageSize = 10,
    search = '',
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = params;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['roles-list', page, pageSize, search, sortBy, sortOrder],
    queryFn: async (): Promise<RolesListResponse> => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortOrder,
        ...(search && { search })
      });

      const response = await axiosAuth.get<RolesListResponse>(`/roles?${queryParams}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    roles: data?.data?.roles || [],
    pagination: data?.data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      pageSize: 10
    },
    isLoading,
    isError,
    error,
    refetch
  };
};

export default useRolesList;
