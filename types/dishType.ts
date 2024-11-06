export type Dish = {
  id: string;
  dishName: string;
  quantity: number;
  price: string;
  percentagePriceDifference: number;
  dishDescription: string;
  createdDate: string;
  images: {
    dishGeneralImageId: string;
    url: string;
  }[];
  categoryName: string;
  type: string;
  status: number;
};
