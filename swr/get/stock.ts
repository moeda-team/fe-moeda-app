import { getAccessToken } from "@/helpers/getAccessToken";
import { API_URL, OUTLET_ID } from "@/services";
import axios, { AxiosRequestConfig } from "axios";
import useSWR from "swr";

interface Response {
  data: any;
}

interface UseStockProps {
  search?: string;
  category?: string;
  best?: string;
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

export const useStockList = () => {
  const { data, error, isLoading, mutate } = useSWR<Response>(
    `${API_URL}/stocks/main`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    stockList: data?.data ?? {},
    errorVoucher: error,
    isLoadingVoucher: isLoading,
    mutateStockList : mutate,
  };
};

export const useStockRecent = ({ search }: UseStockProps = {}) => {
  const { data, error, isLoading, mutate } = useSWR<Response>(
    `${API_URL}/stocks/log?search=${search || ""}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    recentStocks: data?.data ?? {},
    errorVoucher: error,
    isLoadingVoucher: isLoading,
    mutate,
  };
};

export const useNeedToBuy = () => {
  const { data, error, isLoading, mutate } = useSWR<Response>(
    `${API_URL}/stocks/main/status/alert`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    needToBuy: data?.data ?? {},
    errorVoucher: error,
    isLoadingVoucher: isLoading,
    mutateDataNeed : mutate,
  };
};

