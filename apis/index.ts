import axioClient from "./axios.config";

export const getRestaurants = async () => {
  const res = await axioClient.get("/restaurant");
  return res.data;
};

export const getTables = async (restaurantId: string) => {
  const res = await axioClient.get("/table");
  return res.data;
};
