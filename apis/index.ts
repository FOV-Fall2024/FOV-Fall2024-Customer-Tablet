import type {
  Category,
  Combo,
  Dish,
  GetResponse,
  Restaurant,
  Table,
} from "@/types";
import axioClient from "./axios.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getRestaurants(): Promise<GetResponse<Restaurant>> {
  const response = await axioClient.get(
    "/Restaurant?PagingRequest.Page=1&PagingRequest.PageSize=8683&RestaurantStatus=1"
  );
  return response.data;
}

export const getTables = async (
  restaurantId: string
): Promise<GetResponse<Table>> => {
  const response = await axioClient.get(
    `/Table?PagingRequest.Page=1&PagingRequest.PageSize=8683&RestaurantId=${restaurantId}&IsLogin=false`
  );
  return response.data;
};

export async function getCategory(): Promise<
  GetResponse<Category> | undefined
> {
  // try {
  const response = await axioClient.get(
    "/v1/Category?PagingRequest.Page=1&PagingRequest.PageSize=8683"
  );
  return response.data;
  // } catch (error) {
  //   console.log("error123", error);
  //   return undefined;
  // }
}

export async function getProducts(
  page: number,
  category: string,
  seacrh: string
): Promise<GetResponse<Dish | Combo>> {
  const loginData = await AsyncStorage.getItem("loginData");
  const restaurantId = JSON.parse(loginData!).restaurantId;

  if (category === "all") {
    const response = await axioClient.get(
      `/v1/Dish/dish?PagingRequest.Page=${page}&PagingRequest.PageSize=10&RestaurantId=${restaurantId}&DishName=${seacrh}`
    );

    return response.data;
  } else if (category === "combo") {
    const response = await axioClient.get(
      `/v1/Combo?PagingRequest.Page=${page}&PagingRequest.PageSize=10&RestaurantId=${restaurantId}&ComboName=${seacrh}`
    );
    return response.data;
  } else {
    const response = await axioClient.get(
      `/v1/Dish/dish?CategoryName=${category}&PagingRequest.Page=${page}&PagingRequest.PageSize=10&RestaurantId=${restaurantId}&DishName=${seacrh}`
    );
    return response.data;
  }
}

export async function orderFood(
  orderDetails: {
    comboId?: string;
    productId?: string;
    quantity: number;
    note: string;
  }[]
) {
  try {
    const loginData = await AsyncStorage.getItem("loginData");
    const tableId = JSON.parse(loginData!).tableId;

    const response = await axioClient.post(`/Order/${tableId}/table`, {
      orderDetails,
    });

    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
}

export async function tableLogin(id: string) {
  try {
    const response = await axioClient.patch(`/Table/${id}/TableLogin`);

    return response.data;
  } catch (error) {
    console.log("error", error);
  }
}

export async function tableLogout(logoutData: {
  id: string;
  employeeCode: string;
}) {
  try {
    const response = await axioClient.patch(
      `/Table/${logoutData.id}/TableLogout?employeeCode=${logoutData.employeeCode}`
    );
    return response.data;
  } catch (error: any) {
    console.log(error.response.data);
  }
}

export async function getVnpayUrl(data: {
  orderId: string;
  phoneNumber: string;
  usePoint: boolean;
  pointToApply: number;
  feedback: string;
}) {
  try {
    if (data.phoneNumber === "") {
      const response = await axioClient.post(
        `/Payment/${data.orderId}/vn-pay`,
        { feedback: data.feedback }
      );
      return response.data;
    }
    if (data.usePoint) {
      const response = await axioClient.post(
        `/Payment/${data.orderId}/vn-pay?PhoneNumber=${data.phoneNumber}&UsePoints=true&PointsToApply=${data.pointToApply}`,
        {
          feedback: data.feedback,
        }
      );
      return response.data;
    } else {
      const response = await axioClient.post(
        `/Payment/${data.orderId}/vn-pay?PhoneNumber=${data.phoneNumber}$UsePoint=false`,
        {
          feedback: data.feedback,
        }
      );
      return response.data;
    }
  } catch (error: any) {
    return error.response.data;
  }
}

export async function cashPayment(data: {
  orderId: string;
  phoneNumber: string;
  usePoint: boolean;
  pointToApply: number;
  feedback: string;
}) {
  try {
    if (data.phoneNumber === "") {
      const response = await axioClient.post(`/Payment/${data.orderId}/cash`, {
        feedback: data.feedback,
      });
      return response.data;
    }
    if (data.usePoint) {
      const response = await axioClient.post(
        `/Payment/${data.orderId}/cash?PhoneNumber=${data.phoneNumber}&UsePoints=true&PointsToApply=${data.pointToApply}`,
        {
          feedback: data.feedback,
        }
      );
      return response.data;
    } else {
      const response = await axioClient.post(
        `/Payment/${data.orderId}/cash?PhoneNumber=${data.phoneNumber}$UsePoint=false`,
        {
          feedback: data.feedback,
        }
      );
      return response.data;
    }
  } catch (error: any) {
    return error.response.data;
  }
}

export async function orderMoreFood(data: {
  orderId: string;
  newOrderDetails: {
    comboId?: string;
    productId?: string;
    quantity: number;
    note: string;
  }[];
}) {
  try {
    const response = await axioClient.post(
      `/Order/${data.orderId}/add-products`,
      {
        additionalOrderDetails: data.newOrderDetails,
      }
    );
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
}

export async function getPoint(phone: string) {
  try {
    const response = await axioClient.get(`/Point?PhoneNumber=${phone}`);
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
}
