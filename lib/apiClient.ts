import { AxiosRequestConfig } from "axios";
import api from "./api";

export const apiClient = {
  post: async (url: string, data: any, config?: AxiosRequestConfig) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error: any) {
      throw error?.response?.data || error;
    }
  },
  put: async (url: string, data: any, config?: AxiosRequestConfig) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error: any) {
      throw error?.response.data;
    }
  },
  patch: async (url: string, data: any, config?: AxiosRequestConfig) => {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error: any) {
      throw error?.response.data;
    }
  },
  get: async (url: string, config?: AxiosRequestConfig) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error: any) {
      throw error?.response.data;
    }
  },
  delete: async (url: string, config?: AxiosRequestConfig) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error: any) {
      throw error?.response.data;
    }
  },
};
