import { API_URL } from '@/services'
import useSWR from 'swr'
import { fetcher } from '../fetcher'
import getProfile from '@/helpers/getProfile'


export const getMenu = () => {
  const outletID = process.env.NEXT_PUBLIC_OUTLET_ID || ''
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(`${API_URL}/menus/main/${outletID}`, fetcher)

  return {
    menu: data?.data ?? {},
    errorMenu: error,
    isLoadingMenu: isLoading
  }
}

export const getMenuByCategory = (categoryId?: string) => {
  const outletID = process.env.NEXT_PUBLIC_OUTLET_ID || ''

  const shouldFetch = Boolean(categoryId && categoryId.trim() && outletID);
  const url = shouldFetch ? `${API_URL}/menus/main/list/category/${outletID}/${categoryId}` : null;
  
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(url, fetcher)

  return {
    menusByCategory: data?.data ?? {},
    errorMenusByCategory: error,
    isLoadingMenusByCategory: isLoading
  }
}