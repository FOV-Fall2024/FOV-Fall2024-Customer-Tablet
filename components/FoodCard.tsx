import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function FoodCard() {
  const [quantity, setQuantity] = useState(0);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(0, prev - 1));
  return (
    <View className="bg-white rounded-2xl shadow-lg w-full">
      <Image
        source="https://dukaan.b-cdn.net/700x700/webp/upload_file_service/6a0df908-a609-43ba-a1bd-8cf07c019ff0/bun-cha-gio-chay-jpg"
        placeholder={blurhash}
        contentFit="cover"
        transition={1000}
        className="w-full h-56 bg-gray-900"
        accessibilityLabel="Hình ảnh Bún chả giò chay"
      />
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800 mb-8">
          Bún chả giò chay
        </Text>
        <View className="flex-row items-center justify-between ">
          <View>
            <Text className="text-lg font-semibold text-green-600">
              20,000 ₫
            </Text>
          </View>
          <View className="justify-center">
            {quantity > 0 ? (
              <View className="flex-row items-center bg-blue-100 rounded-full absolute right-0">
                <TouchableOpacity
                  className="p-2"
                  onPress={decreaseQuantity}
                  accessibilityLabel="Giảm số lượng"
                >
                  <AntDesign name="minus" size={20} color="blue" />
                </TouchableOpacity>
                <Text className="px-3 font-bold text-blue-500">{quantity}</Text>
                <TouchableOpacity
                  className="p-2"
                  onPress={increaseQuantity}
                  accessibilityLabel="Tăng số lượng"
                >
                  <AntDesign name="plus" size={20} color="blue" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="bg-blue-500 rounded-full p-3 active:bg-blue-600 absolute right-0"
                accessibilityLabel="Thêm vào giỏ hàng"
                onPress={increaseQuantity}
              >
                <AntDesign name="plus" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View className="absolute top-2 right-2 bg-yellow-400 rounded-full px-2 py-1">
        <Text className="text-xs font-bold text-gray-800">Chay</Text>
      </View>
    </View>
  );
}
