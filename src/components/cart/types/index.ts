import type { ProductType } from "../../products/types";

export type CartItemType = {
  product: ProductType;
  quantity: number;
};
