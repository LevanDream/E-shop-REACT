import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { productsApi } from "../api";
import type { ProductsFilters } from "../types";

const PRODUCTS_KEY = ["products"];
const CATEGORIES_KEY = ["categories"];

export const PRODUCTS_LIMIT = 12;

export const useGetProducts = (filters: ProductsFilters) => {
  return useInfiniteQuery({
    queryKey: [...PRODUCTS_KEY, filters],
    queryFn: ({ pageParam, signal }) =>
      productsApi.get(
        {
          ...filters,
          skip: pageParam,
          limit: PRODUCTS_LIMIT,
        },
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip ?? undefined,
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: productsApi.getCategories,
    staleTime: Infinity,
  });
};
