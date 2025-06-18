import { API_URL, OUTLET_ID } from '@/services'
import useSWR from 'swr'
import { fetcher } from '../fetcher'
import getProfile from '@/helpers/getProfile'


export const getMenu = () => {
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(`${API_URL}/menus/main/${OUTLET_ID}`, fetcher)

  return {
    menu: data?.data ?? {},
    errorMenu: error,
    isLoadingMenu: isLoading
  }
}

export const getMenuByCategory = (categoryId?: string) => {
  const shouldFetch = Boolean(categoryId && categoryId.trim() && OUTLET_ID);
  const url = shouldFetch ? `${API_URL}/menus/main/list/category/${OUTLET_ID}/${categoryId}` : null;
  
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(url, fetcher)

  return {
    menusByCategory: data?.data ?? {},
    errorMenusByCategory: error,
    isLoadingMenusByCategory: isLoading
  }
}