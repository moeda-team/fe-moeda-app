import { getAccessToken } from "@/helpers/getAccessToken";
import { API_URL, OUTLET_ID } from "@/services";
import axios, { AxiosRequestConfig } from "axios";
import useSWR from "swr";

interface VoucherResponse {
  data: any;
}

interface UseVoucherProps {
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

export const useVoucher = ({ search }: UseVoucherProps = {}) => {
  const { data, error, isLoading, mutate } = useSWR<VoucherResponse>(
    `${API_URL}/vouchers?search=${search || ""}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    vouchers: data?.data ?? {},
    errorVoucher: error,
    isLoadingVoucher: isLoading,
    mutate,
  };
};

export const useVoucherToday = () => {
  const { data, error, isLoading, mutate } = useSWR<VoucherResponse>(
    `${API_URL}/vouchers/today/used`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    vouchersUsed: data?.data ?? {},
    errorVoucher: error,
    isLoadingVoucher: isLoading,
    mutate,
  };
};
