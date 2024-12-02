export type Food = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  type: "Dish" | "Combo";
  isRefundDish?: boolean;
};
