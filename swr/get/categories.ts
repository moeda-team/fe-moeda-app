import { API_URL, OUTLET_ID } from '@/services'
import useSWR from 'swr'
import { fetcher } from '../fetcher'

export const getCategories = () => {
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(`${API_URL}/menus/categories/${OUTLET_ID}`, fetcher)

  return {
    categories: data?.data ?? {},
    errorCategories: error,
    isLoadingCategories: isLoading
  }
}