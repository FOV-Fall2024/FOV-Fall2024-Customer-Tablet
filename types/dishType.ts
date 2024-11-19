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

export type DishDetail = {
  id: string;
  dishName: string;
  price: string;
  percentagePriceDifference: number;
  dishDescription: string;
  createDate: string;
  images: string[];
  ingredients: {
    ingredientId: string;
    ingredientName: string;
    ingredientQuantity: string;
    ingredientMeasureName: string;
    ingredientType: string;
  }[];
  categoryName: string;
  status: number;
};
