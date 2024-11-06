import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { Food } from "@/types";
import { useCartStore } from "@/store";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function FoodCard({
  category,
  image,
  name,
  price,
  id,
  type,
}: Food) {
  const cartStatus = useCartStore((state) => state.cartStatus);
  const addItems = useCartStore((state) => state.addItem);
  const increaseItemQuantity = useCartStore(
    (state) => state.increaseItemQuantity
  );
  const increaseAddMoreItemQuantity = useCartStore(
    (state) => state.increaseAddMoreItemQuantity
  );
  const decreaseItemQuantity = useCartStore(
    (state) => state.decreaseItemQuantity
  );
  const removeItem = useCartStore((state) => state.removeItem);
  const listItems = useCartStore((state) => state.items);
  const item = listItems.find((item) => item.id === id);

  return (
    <View className="bg-white rounded-2xl shadow-lg w-full">
      <Image
        source={image}
        placeholder={blurhash}
        contentFit="cover"
        transition={1000}
        className="w-full h-56 bg-gray-900"
        accessibilityLabel={`Ảnh món ${name}`}
      />
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800 mb-8">{name}</Text>
        <View className="flex-row items-center justify-between ">
          <View>
            <Text className="text-lg font-semibold text-green-600">
              {price.toLocaleString("vi-VN")} ₫
            </Text>
          </View>

          {/* <View className="justify-center">
            {(item?.cartQuantity ?? 0) > 0 ? (
              <View className="flex-row items-center bg-blue-100 rounded-full absolute right-0">
                <TouchableOpacity
                  className="p-2"
                  onPress={() => {
                    if (item?.cartQuantity === 1) {
                      removeItem(item?.id as string);
                      return;
                    }
                    decreaseItemQuantity(item?.id as string);
                  }}
                  accessibilityLabel="Giảm số lượng"
                  disabled={item?.itemStatus !== "idle"}
                >
                  <AntDesign name="minus" size={20} color="blue" />
                </TouchableOpacity>
                <Text className="px-3 font-bold text-blue-500">
                  {item?.cartQuantity}
                </Text>
                <TouchableOpacity
                  className="p-2"
                  onPress={() => {
                    increaseItemQuantity(item?.id as string);
                  }}
                  accessibilityLabel="Tăng số lượng"
                  disabled={item?.itemStatus !== "idle"}
                >
                  <AntDesign name="plus" size={20} color="blue" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="bg-blue-500 rounded-full p-3 active:bg-blue-600 absolute right-0"
                accessibilityLabel="Thêm vào giỏ hàng"
                onPress={() => {
                  addItems({ category, image, name, price, id, type });
                }}
                disabled={cartStatus !== "idle"}
              >
                <AntDesign name="plus" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View> */}
          <TouchableOpacity
            className="bg-blue-500 rounded-full p-3 active:bg-blue-600 absolute right-0"
            accessibilityLabel="Thêm vào giỏ hàng"
            onPress={() => {
              if (cartStatus === "addMore") {
                const addMoreItem = listItems.filter(
                  (i) => i.itemStatus === "idle"
                );
                const item = addMoreItem.find((i) => i.id === id);
                if (item) {
                  increaseAddMoreItemQuantity(id);
                  return;
                }
                addItems({ category, image, name, price, id, type });
                return;
              }

              if ((item?.cartQuantity ?? 0) > 0) {
                increaseItemQuantity(id);
                return;
              } else {
                addItems({ category, image, name, price, id, type });
              }
            }}
            disabled={cartStatus !== "idle" && cartStatus !== "addMore"}
          >
            <AntDesign name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="absolute top-2 right-2 bg-yellow-400 rounded-full px-2 py-1">
        <Text className="text-xs font-bold text-gray-800">{category}</Text>
      </View>
    </View>
  );
}
