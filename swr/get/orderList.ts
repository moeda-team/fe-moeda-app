import { API_URL, OUTLET_ID } from '@/services'
import useSWR from 'swr'
import { fetcher } from '../fetcher'

export const getBestSeller = () => {
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(`${API_URL}/transactions/order/status/${OUTLET_ID}`, fetcher)

  return {
    orderList: data?.data ?? {},
    errorOrderList: error,
    isLoadingOrderList: isLoading
  }
}