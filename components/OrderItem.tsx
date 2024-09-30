import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { TextInput } from "react-native-gesture-handler";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function OrderItem() {
  return (
    // <View className="flex-row items-center justify-between p-4 bg-white rounded-lg shadow-md mb-2">
    //   <View className="flex-row items-center space-x-4 flex-1">
    //     <Image
    //       source="https://dukaan.b-cdn.net/700x700/webp/upload_file_service/6a0df908-a609-43ba-a1bd-8cf07c019ff0/bun-cha-gio-chay-jpg"
    //       placeholder={blurhash}
    //       contentFit="cover"
    //       transition={1000}
    //       className="w-24 h-24 rounded-lg bg-gray-200"
    //       accessibilityLabel="Hình ảnh Bún chả giò chay"
    //     />
    //     <View className="flex-1">
    //       <Text className="font-bold text-lg text-gray-800 mb-1">
    //         Bún chả giò chay
    //       </Text>
    //       <Text className="text-green-600 font-semibold">20.000 ₫</Text>
    //     </View>
    //   </View>
    //   <View className="flex-row items-center space-x-2">
    //     <TouchableOpacity
    //       className="bg-gray-100 rounded-full p-2 active:bg-gray-200"
    //       accessibilityLabel="Giảm số lượng"
    //     >
    //       <AntDesign name="minus" size={20} color="#4B5563" />
    //     </TouchableOpacity>
    //     <Text className="text-lg font-bold text-gray-800 min-w-[30px] text-center">
    //       10
    //     </Text>
    //     <TouchableOpacity
    //       className="bg-gray-100 rounded-full p-2 active:bg-gray-200"
    //       accessibilityLabel="Tăng số lượng"
    //     >
    //       <AntDesign name="plus" size={20} color="#4B5563" />
    //     </TouchableOpacity>
    //     <TouchableOpacity
    //       className="bg-red-100 rounded-full p-2 ml-2 active:bg-red-200"
    //       accessibilityLabel="Xóa khỏi đơn hàng"
    //     >
    //       <AntDesign name="close" size={20} color="#EF4444" />
    //     </TouchableOpacity>
    //   </View>
    // </View>
    <View className="flex flex-row items-center justify-start p-4 bg-white rounded-lg shadow-md">
      {/* Food Image */}
      <View className="mr-4">
        <Image
          source={{
            uri: "https://dukaan.b-cdn.net/700x700/webp/upload_file_service/6a0df908-a609-43ba-a1bd-8cf07c019ff0/bun-cha-gio-chay-jpg",
          }}
          placeholder={blurhash}
          contentFit="cover"
          transition={1000}
          className="w-24 h-24 rounded-lg bg-gray-200"
          accessibilityLabel="Hình ảnh Bún chả giò chay"
        />
      </View>

      {/* Food Info and Controls */}
      <View className="flex-1">
        <View className="flex flex-row justify-between items-center mb-2">
          {/* Food Details */}
          <View>
            <Text className="text-lg font-bold text-gray-800">
              Bún chả giò chay
            </Text>
            <Text className="text-base text-green-600 font-semibold">
              20.000 ₫
            </Text>
          </View>

          {/* Quantity Controls */}
          <View className="flex flex-row items-center space-x-4 ">
            <View className="flex flex-row gap-2 items-center">
              <TouchableOpacity className="bg-gray-100 rounded-full p-2 active:bg-gray-200">
                <AntDesign name="minus" size={20} color="#4B5563" />
              </TouchableOpacity>
              <Text className="text-lg text-gray-800">10</Text>
              <TouchableOpacity className="bg-gray-100 rounded-full p-2 active:bg-gray-200">
                <AntDesign name="plus" size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>
            {/* bg-red-100 rounded-full p-2 ml-2 active:bg-red-200 */}
            <TouchableOpacity className="bg-red-100 rounded-full p-2 ml-2 active:bg-red-200">
              <AntDesign name="close" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Note Input */}
        <View>
          <TextInput
            placeholder="Thêm lời nhắn cho đầu bếp"
            className="border border-gray-300 rounded-md px-2 py-1"
          />
        </View>
      </View>
    </View>
  );
}
