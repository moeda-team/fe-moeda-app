import { getAccessToken } from '@/helpers/getAccessToken';
import { API_URL, OUTLET_ID } from '@/services'
import axios, { AxiosRequestConfig } from 'axios';
import useSWR from 'swr'

export const fetcher = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const accessToken = getAccessToken();
  const bearerAuth = `Bearer ${accessToken}`; // ✅ Fixed: "Bearer" bukan "Barear"

  const response = await axios.get<T>(url, {
    ...config,
    headers: {
      ...(config?.headers || {}),
      'Content-Type': 'application/json',
      Authorization: bearerAuth // ✅ Fixed: menggunakan bearerAuth yang sudah diperbaiki
    },
  });

  return response.data;
};

export const getActiveOrder = (
  page?: number | string,
  limit?: number | string,
  search?: string,
  status?: boolean
) => {
  const active = status ? '&active=true' : ''
  const { data, error, isLoading, mutate }: { data: any, error: any, isLoading: boolean, mutate: any } = useSWR(`${API_URL}/transactions/main?page=${page}&limit=${limit}&search=${search}${active}`, fetcher)

  return {
    activeOrder: data?.data ?? {},
    errorActiveOrder: error,
    isLoadingActiveOrder: isLoading,
    mutate,
  }
}