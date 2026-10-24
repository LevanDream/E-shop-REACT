export type ProductType = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
};

export type CategoryType = {
  slug: string;
  name: string;
  url: string;
};

export type SortType = "default" | "price-asc" | "price-desc" | "rating";

export type ProductsFilters = {
  search: string;
  category: string | null;
  sort: SortType;
};

export type GetProductsParams = ProductsFilters & {
  skip: number;
  limit: number;
};

export type ProductsResponse = {
  products: ProductType[];
  total: number;
  nextSkip: number | null;
};
