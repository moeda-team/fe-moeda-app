import { API_URL, OUTLET_ID } from '@/services'
import useSWR from 'swr'
import { fetcher } from '../fetcher'
import getProfile from '@/helpers/getProfile'


export const getMenu = ({search, category, best}: {search?: string, category?: string, best?: string}) => {
  const { data, error, isLoading, mutate } = useSWR<{data: any}>(`${API_URL}/menus/main/${OUTLET_ID}?search=${search||''}&category=${category||""}&best=${best}`, fetcher)

  return {
    menu: data?.data ?? {},
    errorMenu: error,
    isLoadingMenu: isLoading,
    mutate
  }
}
