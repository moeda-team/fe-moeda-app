import { getAccessToken } from "@/helpers/getAccessToken";
import { API_URL } from "@/services";
import axios, { AxiosRequestConfig } from "axios";
import useSWR from "swr";

export const fetcher = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const accessToken = getAccessToken();
  const bearerAuth = `Bearer ${accessToken}`;

  const response = await axios.get<T>(url, {
    ...config,
    headers: {
      ...(config?.headers || {}),
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
  });

  return response.data;
};

interface BaristaOrderResponse {
  data: any;
}

export const useBaristaOrder = () => {
  const { data, error, isLoading, mutate } = useSWR<BaristaOrderResponse>(
    `${API_URL}/transactions/main/view/table`,
    fetcher
  );

  return {
    baristaOrder: data?.data ?? {},
    errorBaristaOrder: error,
    isLoadingBaristaOrder: isLoading,
    mutate,
  };
};
