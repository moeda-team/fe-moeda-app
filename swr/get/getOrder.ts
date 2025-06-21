import { API_URL } from '@/services'
import useSWR from 'swr'
import { fetcher } from '../fetcher'

export const getDetailOrder = (orderId: string | undefined) => {
  
  const shouldFetch = Boolean(orderId);
  const url = shouldFetch ? `${API_URL}/transactions/order/status/${orderId}` : null;
  
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(url, fetcher)

  return {
    orderDetail: data?.data ?? {},
    errorOrderDetail: error,
    isLoadingOrderDetail: isLoading
  }
}

