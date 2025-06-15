import { API_URL } from '@/services'
import useSWR from 'swr'
import { fetcher } from '../fetcher'
import getProfile from '@/helpers/getProfile'

export const getBestSeller = () => {
  const {outletId } = getProfile();
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(`${API_URL}/menus/main/list/best/${outletId}`, fetcher)

  return {
    bestSeller: data?.data ?? {},
    errorBestSeller: error,
    isLoadingBestSeller: isLoading
  }
}