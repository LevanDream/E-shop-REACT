import { shopHttp } from "../../../api/api";
import type {
  CategoryType,
  GetProductsParams,
  ProductType,
  ProductsResponse,
  SortType,
} from "../types";

type ApiProductsResponse = {
  products: ProductType[];
  total: number;
  skip: number;
  limit: number;
};

const SORT_PARAMS: Record<SortType, { sortBy?: string; order?: string }> = {
  default: {},
  "price-asc": { sortBy: "price", order: "asc" },
  "price-desc": { sortBy: "price", order: "desc" },
  rating: { sortBy: "rating", order: "desc" },
};

const FIELDS =
  "id,title,description,category,price,rating,stock,brand,thumbnail";

export const productsApi = {
  get: async (
    { search, category, sort, skip, limit }: GetProductsParams,
    signal?: AbortSignal,
  ): Promise<ProductsResponse> => {
    const url = search
      ? "/products/search"
      : category
        ? `/products/category/${category}`
        : "/products";

    const { data } = await shopHttp.get<ApiProductsResponse>(url, {
      params: {
        q: search || undefined,
        limit,
        skip,
        select: FIELDS,
        ...SORT_PARAMS[sort],
      },
      signal,
    });

    const loaded = skip + data.products.length;

    return {
      products: data.products,
      total: data.total,
      nextSkip: loaded < data.total ? loaded : null,
    };
  },

  getCategories: async (): Promise<CategoryType[]> => {
    const { data } = await shopHttp.get<CategoryType[]>("/products/categories");
    return data;
  },
};
