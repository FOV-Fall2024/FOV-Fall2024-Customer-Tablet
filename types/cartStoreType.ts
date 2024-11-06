import { Food } from "./foodType";

export type CartItem = Food & {
  cartQuantity: number;
  itemStatus: string;
  note: string;
};
