import { API_URL } from '@/services'
import useSWR from 'swr'
import { fetcher } from '../fetcher'

export const getBestSeller = () => {
  const outletID = process.env.NEXT_PUBLIC_OUTLET_ID || ''
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(`${API_URL}/menus/main/list/best/${outletID}`, fetcher)

  return {
    bestSeller: data?.data ?? {},
    errorBestSeller: error,
    isLoadingBestSeller: isLoading
  }
}