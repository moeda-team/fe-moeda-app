import { getAccessToken } from '@/helpers/getAccessToken';
import { API_URL } from '@/services'
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

export const getBaristaOrder = (
) => {
  const { data, error, isLoading, mutate }: { data: any, error: any, isLoading: boolean, mutate: any } = useSWR(`${API_URL}/transactions/main/view/table`, fetcher)

  return {
    baristaOrder: data?.data ?? {},
    errorBaristaOrder: error,
    isLoadingBaristaOrder: isLoading,
    mutate,
  }
}