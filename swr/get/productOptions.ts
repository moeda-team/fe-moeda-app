import { API_URL } from '@/services'
import useSWR from 'swr'
import { fetcher } from '../fetcher'

export const getAllProductOptions = () => {
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(`${API_URL}/menus/options`, fetcher)

  return {
    productOptions: data?.data ?? {},
    errorProductOptions: error,
    isLoadingProductOptions: isLoading
  }
}