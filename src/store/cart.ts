"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string, version: string) => void;
  setQty: (productId: string, version: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

const key = (id: string, v: string) => `${id}__${v}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const idx = state.items.findIndex(
            (i) => key(i.productId, i.version) === key(item.productId, item.version)
          );
          if (idx >= 0) {
            const items = [...state.items];
            items[idx] = {
              ...items[idx],
              quantity: items[idx].quantity + item.quantity,
            };
            return { items };
          }
          return { items: [...state.items, item] };
        }),
      remove: (productId, version) =>
        set((state) => ({
          items: state.items.filter(
            (i) => key(i.productId, i.version) !== key(productId, version)
          ),
        })),
      setQty: (productId, version, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            key(i.productId, i.version) === key(productId, version)
              ? { ...i, quantity: Math.max(1, qty) }
              : i
          ),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((n, i) => n + i.salePrice * i.quantity, 0),
    }),
    { name: "kpg-cart" }
  )
);
