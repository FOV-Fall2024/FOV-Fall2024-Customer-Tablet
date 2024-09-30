import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import OrderItem from "./OrderItem";

export default function Order() {
  return (
    <View className="flex-1 bg-white m-4 p-2 rounded-lg shadow">
      <View className=" border-b border-gray-300">
        <Text className="text-xl font-bold text-center pb-2">
          Đơn hàng của bạn
        </Text>
      </View>
      <ScrollView>
        <OrderItem />
        <OrderItem />
        <OrderItem />
        <OrderItem />
        <OrderItem />
      </ScrollView>
      <View className="mt-4 border-t border-gray-200 pt-4">
        <Text className="text-lg font-bold">Tổng cộng: 0đ</Text>
        {/* {totalPrice.toLocaleString("vi-VN")} */}
        <TouchableOpacity className="mt-4 bg-blue-500 py-2 px-4 rounded-full">
          <Text className="text-white text-center text-base font-bold">
            Thanh toán
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
