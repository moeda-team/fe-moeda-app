import { API_URL } from '@/services'
import useSWR from 'swr'
import { fetcher } from '../fetcher'
import getProfile from '@/helpers/getProfile'


export const getMenu = () => {
  const {outletId } = getProfile();
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(`${API_URL}/menus/main/${outletId}`, fetcher)

  return {
    menu: data?.data ?? {},
    errorMenu: error,
    isLoadingMenu: isLoading
  }
}

export const getMenuByCategory = (categoryId?: string) => {
  const { outletId } = getProfile();

  const shouldFetch = Boolean(categoryId && categoryId.trim() && outletId);
  const url = shouldFetch ? `${API_URL}/menus/main/list/category/${outletId}/${categoryId}` : null;
  
  const { data, error, isLoading }: { data: any, error: any, isLoading: boolean } = useSWR(url, fetcher)

  return {
    menusByCategory: data?.data ?? {},
    errorMenusByCategory: error,
    isLoadingMenusByCategory: isLoading
  }
}