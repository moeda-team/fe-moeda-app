import { API_URL, OUTLET_ID } from "@/services";
import useSWR from "swr";
import { fetcher } from "../fetcher";

interface MenuResponse {
  data: any;
}

interface UseMenuProps {
  search?: string;
  category?: string;
  best?: string;
}

export const useMenu = ({ search, category, best }: UseMenuProps = {}) => {
  const { data, error, isLoading, mutate } = useSWR<MenuResponse>(
    `${API_URL}/menus/main/${OUTLET_ID}?search=${search || ""}&category=${category || ""}&best=${best || ""}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    menu: data?.data ?? {},
    errorMenu: error,
    isLoadingMenu: isLoading,
    mutate,
  };
};
