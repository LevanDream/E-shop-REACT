import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductType } from "../../products/types";
import type { CartItemType } from "../types";

type CartState = {
  items: CartItemType[];
  add: (product: ProductType) => void;
  setQuantity: (id: number, quantity: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      add: (product) =>
        set((state) => {
          const exists = state.items.some((i) => i.product.id === product.id);

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }

          return { items: [...state.items, { product, quantity: 1 }] };
        }),

      setQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== id)
              : state.items.map((i) =>
                  i.product.id === id ? { ...i, quantity } : i,
                ),
        })),

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== id),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: "cart" },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectCartTotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
