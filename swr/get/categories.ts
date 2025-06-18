import { API_URL } from '@/services'
import useSWR from 'swr'
import { fetcher } from '../fetcher'

export const getCategories = () => {
  const outletID = process.env.NEXT_PUBLIC_OUTLET_ID || ''
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(`${API_URL}/menus/categories/${outletID}`, fetcher)

  return {
    categories: data?.data ?? {},
    errorCategories: error,
    isLoadingCategories: isLoading
  }
}