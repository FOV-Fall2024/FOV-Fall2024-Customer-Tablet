import { CartItem, Food } from "@/types";
import { create } from "zustand";

type CartStore = {
  items: CartItem[];
  cartStatus: "idle" | "pending" | "cook" | "serve" | "addMore" | "payment";

  addItem: (item: Food) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  increaseItemQuantity: (itemId: string) => void;
  decreaseItemQuantity: (itemId: string) => void;
  changeCartStatus: (
    status:
      | "idle"
      | "pending"
      | "cook"
      | "serve"
      | "cancel"
      | "addMore"
      | "cancelAddMore"
      | "payment",
    type?: string
  ) => void;
  changeItemStatusToServe: (itemId: string) => void;
  refundItem: (itemId: string, quantity: number) => void;
  removeAddMoreItem: (itemId: string) => void;
  increaseAddMoreItemQuantity: (itemId: string) => void;
  decreaseAddMoreItemQuantity: (itemId: string) => void;
  changeStatusAddMoreItemToServe: (itemId: string) => void;
  findItemNameToServe: (itemId: string) => string;
  getTotalMoney: () => number;

  isOrdering: boolean;
  changeOrderingStatus: (status: boolean) => void;

  changeNote: (note: string, id: string) => void;

  discountMoney: number;
  setDiscountMoney: (discount: number) => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  cartStatus: "idle",
  addItem: (item) =>
    set((state) => {
      const newItem = {
        ...item,
        cartQuantity: 1,
        itemStatus: "idle",
        note: "",
      };
      return { items: [...state.items, newItem] };
    }),
  removeItem: (itemId) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== itemId) })),
  clearCart: () => set({ items: [], cartStatus: "idle" }),
  increaseItemQuantity: (itemId) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === itemId ? { ...i, cartQuantity: i.cartQuantity + 1 } : i
      );
      return { items: newItems };
    }),
  decreaseItemQuantity: (itemId) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === itemId ? { ...i, cartQuantity: i.cartQuantity - 1 } : i
      );
      return { items: newItems };
    }),
  changeCartStatus: (status, type) =>
    set((state) => {
      if (type == "addMore") {
        if (status == "pending") {
          const newAddMoreItems = state.items
            .filter((i) => i.itemStatus === "idle")
            .map((i) => ({ ...i, itemStatus: "pending" }));
          const alreadyOrderItems = state.items.filter(
            (i) => i.itemStatus === "serve"
          );
          return {
            cartStatus: "pending",
            items: [...alreadyOrderItems, ...newAddMoreItems],
          };
        }
        if (status === "cook") {
          const newAddMoreItems = state.items
            .filter((i) => i.itemStatus === "pending")
            .map((i) => ({ ...i, itemStatus: "cook" }));
          const alreadyOrderItems = state.items.filter(
            (i) => i.itemStatus === "serve"
          );
          return {
            cartStatus: "cook",
            items: [...alreadyOrderItems, ...newAddMoreItems],
          };
        }
        if (status === "cancel") {
          const newAddMoreItems = state.items
            .filter((i) => i.itemStatus === "pending")
            .map((i) => ({ ...i, itemStatus: "idle" }));
          const alreadyOrderItems = state.items.filter(
            (i) => i.itemStatus === "serve"
          );
          return {
            cartStatus: "addMore",
            items: [...alreadyOrderItems, ...newAddMoreItems],
          };
        }
      }
      // when cart status is pending all items status will be pending
      if (status === "pending") {
        const newItems = state.items.map((i) => ({
          ...i,
          itemStatus: "pending",
        }));
        return { cartStatus: status, items: newItems };
      }
      if (status === "cook") {
        // if (state.cartStatus === "cook")
        //   return { cartStatus: "cook", items: state.items };
        // console.log("Item in cart store: ", state.items);

        const newItems = state.items
          .filter((i) => i.itemStatus === "pending")
          .map((i) => ({ ...i, itemStatus: "cook" }));
        const alreadyOrderItems = state.items.filter(
          (i) => i.itemStatus === "serve"
        );
        // console.log("New items: ", newItems);
        // console.log("Already order items: ", alreadyOrderItems);

        // console.log("total items: ", [...alreadyOrderItems, ...newItems]);

        return {
          cartStatus: status,
          items: [...alreadyOrderItems, ...newItems],
        };
      }

      if (status === "cancel") {
        const newItems = state.items.map((i) => ({
          ...i,
          itemStatus: "idle",
        }));
        return { cartStatus: "idle", items: newItems };
      }

      if (status === "addMore") {
        const newItems = state.items.filter((i) => i.itemStatus === "serve");
        return { cartStatus: "addMore", items: newItems };
      }

      // chưa submit pending
      if (status === "cancelAddMore") {
        const newItems = state.items.filter((i) => i.itemStatus !== "idle");
        return { cartStatus: "serve", items: newItems };
      }

      if (status === "payment") {
        return { cartStatus: "payment" };
      }
      return { cartStatus: status };
    }),
  changeItemStatusToServe: (itemId) =>
    set((state) => {
      const newItems = state.items
        .filter((i) => i.itemStatus === "cook")
        .map((i) => (i.id === itemId ? { ...i, itemStatus: "serve" } : i));

      const alreadyOrderItems = state.items.filter(
        (i) => i.itemStatus === "serve"
      );

      const allItem = [...alreadyOrderItems, ...newItems];

      const allItemsServed = allItem.every((i) => i.itemStatus === "serve");

      if (allItemsServed) {
        return { cartStatus: "serve", items: allItem };
      }
      return { items: allItem };
    }),
  refundItem: (itemId, quantity) =>
    set((state) => {
      const newItems = [];
      let isUpdated = false;
      // !isUpdated &&
      for (let i of state.items) {
        if (!isUpdated && i.id === itemId && quantity <= i.cartQuantity) {
          newItems.push({ ...i, cartQuantity: i.cartQuantity - quantity });
          isUpdated = true;
        } else if (i.cartQuantity >= 0) {
          newItems.push(i);
        }
      }

      return { items: newItems };
    }),
  removeAddMoreItem: (itemId) =>
    set((state) => {
      // loại bỏ item add more khỏi giỏ hàng
      const newAddMoreItem = state.items
        .filter((i) => i.itemStatus === "idle")
        .filter((i) => i.id !== itemId);
      // giữ lại item đã order
      const alreadyOrrderItems = state.items.filter(
        (i) => i.itemStatus === "serve"
      );

      return { items: [...alreadyOrrderItems, ...newAddMoreItem] };
    }),
  increaseAddMoreItemQuantity: (itemId) =>
    set((state) => {
      const newAddMoreItem = state.items
        .filter((i) => i.itemStatus === "idle")
        .map((i) =>
          i.id === itemId ? { ...i, cartQuantity: i.cartQuantity + 1 } : i
        );
      const alreadyOrderItems = state.items.filter(
        (i) => i.itemStatus === "serve"
      );
      return { items: [...alreadyOrderItems, ...newAddMoreItem] };
    }),
  decreaseAddMoreItemQuantity: (itemId) =>
    set((state) => {
      const newAddMoreItem = state.items
        .filter((i) => i.itemStatus === "idle")
        .map((i) =>
          i.id === itemId ? { ...i, cartQuantity: i.cartQuantity - 1 } : i
        );
      const alreadyOrderItems = state.items.filter(
        (i) => i.itemStatus === "serve"
      );
      return { items: [...alreadyOrderItems, ...newAddMoreItem] };
    }),
  changeStatusAddMoreItemToServe: (itemId) =>
    set((state) => {
      const newAddMoreItem = state.items
        .filter((i) => i.itemStatus === "cook")
        .map((i) => (i.id === itemId ? { ...i, itemStatus: "serve" } : i));
      const alreadyOrderItems = state.items.filter(
        (i) => i.itemStatus === "serve"
      );
      const allAddMoreItemsServed = newAddMoreItem.every(
        (i) => i.itemStatus === "serve"
      );
      if (allAddMoreItemsServed) {
        return {
          cartStatus: "serve",
          items: [...alreadyOrderItems, ...newAddMoreItem],
        };
      }

      return { items: [...alreadyOrderItems, ...newAddMoreItem] };
    }),

  findItemNameToServe: (itemId) => {
    const state = get();
    const item = state.items
      .filter((i) => i.itemStatus === "cook")
      .find((i) => i.id === itemId);
    return item?.name || "";
  },

  getTotalMoney: () => {
    const state = get();
    return state.items.reduce(
      (total, item) => total + item.price * item.cartQuantity,
      0
    );
  },

  isOrdering: false,
  changeOrderingStatus: (status) => set({ isOrdering: status }),

  changeNote: (note, id) =>
    set((state) => {
      const newItems = state.items
        .filter((i) => i.itemStatus === "idle")
        .map((i) => (i.id === id ? { ...i, note } : i));

      const alreadyOrderItems = state.items.filter(
        (i) => i.itemStatus === "serve"
      );
      return { items: [...alreadyOrderItems, ...newItems] };
    }),

  discountMoney: 0,
  setDiscountMoney: (discount) => set({ discountMoney: discount }),
}));
