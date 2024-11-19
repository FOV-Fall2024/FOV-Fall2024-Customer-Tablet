export type Combo = {
  id: string;
  restaurantId: string;
  comboName: string;
  comboPrice: number;
  comboThumbnail: string;
  createdDate: string;
  status: number;
};

export type ComboDetail = {
  id: string;
  comboName: string;
  price: number;
  comboThumbnail: string;
  comboDescription: string;
  dishComboResponses: Array<{
    dishId: string;
    status: number;
    dishName: string;
    dishDescription: string;
    dishQuantity: number;
    price: number;
    dishImages: string[];
    getIngredients: Array<{
      ingredientId: string;
      ingredientName: string;
      ingredientQuantity: number;
      ingredientMeasureName: string;
      ingredientType: string;
    }>;
  }>;
};
