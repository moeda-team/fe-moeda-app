import { API_URL } from '@/services'
import useSWR from 'swr'
import { fetcher } from '../fetcher'
import getProfile from '@/helpers/getProfile'

export const getCategories = () => {
  const {outletId } = getProfile();
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(`${API_URL}/menus/categories/${outletId}`, fetcher)

  return {
    categories: data?.data ?? {},
    errorCategories: error,
    isLoadingCategories: isLoading
  }
}