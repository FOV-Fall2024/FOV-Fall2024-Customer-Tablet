import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
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
  isRefundDish,
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
  const isOrdering = useCartStore((state) => state.isOrdering);

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
        <Text
          className="text-xl font-bold text-gray-800 mb-2"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </Text>

        <View className="flex-row items-center mb-8">
          <MaterialIcons
            name={isRefundDish ? "assignment-return" : "block"}
            size={16}
            color={isRefundDish ? "green" : "red"}
          />
          <Text className="ml-1 text-sm text-gray-600">
            {isRefundDish
              ? "Có thể trả lại khi thanh toán"
              : "Không thể trả lại khi thanh toán"}
          </Text>
        </View>

        <View className="flex-row items-center justify-between ">
          <View>
            <Text className="text-lg font-semibold text-green-600">
              {price.toLocaleString("vi-VN")} ₫
            </Text>
          </View>

          <TouchableOpacity
            className={`rounded-full p-3 absolute right-0 bg-blue-500 ${
              (cartStatus !== "idle" && cartStatus !== "addMore") || isOrdering
                ? "opacity-50"
                : "bg-blue-500"
            }`}
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
                addItems({
                  category,
                  image,
                  name,
                  price,
                  id,
                  type,
                  isRefundDish,
                });
                return;
              }

              if ((item?.cartQuantity ?? 0) > 0) {
                increaseItemQuantity(id);
                return;
              } else {
                addItems({
                  category,
                  image,
                  name,
                  price,
                  id,
                  type,
                  isRefundDish,
                });
              }
            }}
            disabled={
              (cartStatus !== "idle" && cartStatus !== "addMore") || isOrdering
            }
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
