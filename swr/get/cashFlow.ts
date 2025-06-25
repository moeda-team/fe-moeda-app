import { API_URL } from '@/services'
import useSWR from 'swr'
import axios, { AxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/helpers/getAccessToken';

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

export const getCashFlow = (
  method: string,
  startDate: string,
  endDate: string,
  type: string,
) => {
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(
    `${API_URL}/transactions/sales/${type}?method=${method}&start=${startDate}&end=${endDate}`, 
    fetcher
  )

  return {
    cashFlow: data?.data ?? {},
    errorCashFlow: error,
    isLoadingCashFlow: isLoading
  }
}