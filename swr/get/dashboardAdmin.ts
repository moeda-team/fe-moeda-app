import { getAccessToken } from "@/helpers/getAccessToken";
import { API_URL, OUTLET_ID } from "@/services";
import axios, { AxiosRequestConfig } from "axios";
import useSWR from "swr";

interface SummaryResponse {
  data: any;
}

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

export const useSummaryDashboard = () => {
  const { data, error, isLoading, mutate } = useSWR<SummaryResponse>(
    `${API_URL}/transactions/sales/today/summary`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    summaryDashboard: data?.data ?? {},
    errorSummaryDashboard: error,
    isLoadingSummaryDashboard: isLoading,
    mutate,
  };
};

export const useSummaryRevenue = (year?:string, month?:string) => {
  const { data, error, isLoading, mutate } = useSWR<SummaryResponse>(
    `${API_URL}/transactions/sales/revenue/summary?year=${year}&month=${month}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    summaryRevenue: data?.data ?? {},
    errorSummaryRevenue: error,
    isLoadingSummaryRevenue: isLoading,
    mutate,
  };
};