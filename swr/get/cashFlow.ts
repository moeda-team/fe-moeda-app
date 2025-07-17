import { API_URL } from "@/services";
import useSWR from "swr";
import axios, { AxiosRequestConfig } from "axios";
import { getAccessToken } from "@/helpers/getAccessToken";

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

interface CashFlowResponse {
  data: any;
}

export const useCashFlow = (method: string, startDate: string, endDate: string, type: string) => {
  const { data, error, isLoading } = useSWR<CashFlowResponse>(
    `${API_URL}/transactions/sales/${type}?method=${method}&start=${startDate}&end=${endDate}`,
    fetcher
  );

  return {
    cashFlow: data?.data ?? {},
    errorCashFlow: error,
    isLoadingCashFlow: isLoading,
  };
};
