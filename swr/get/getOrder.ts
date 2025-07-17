import { API_URL } from "@/services";
import useSWR from "swr";
import { fetcher } from "../fetcher";

interface OrderDetailResponse {
  data: any;
}

export const useDetailOrder = (orderId: string | undefined) => {
  const shouldFetch = Boolean(orderId);
  const url = shouldFetch ? `${API_URL}/transactions/main/${orderId}` : null;

  const { data, error, isLoading } = useSWR<OrderDetailResponse>(url, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    orderDetail: data?.data ?? {},
    errorOrderDetail: error,
    isLoadingOrderDetail: isLoading,
  };
};
