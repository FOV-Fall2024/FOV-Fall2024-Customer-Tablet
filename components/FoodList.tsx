import { View, Text, Pressable } from "react-native";
import React from "react";
import FoodCard from "./FoodCard";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Link } from "expo-router";

export default function FoodList() {
  const products = [
    {
      id: "1",
      name: "Sản phẩm 1",
      price: "50.000đ",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      name: "Sản phẩm 2",
      price: "75.000đ",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "3",
      name: "Sản phẩm 3",
      price: "100.000đ",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "4",
      name: "Sản phẩm 4",
      price: "120.000đ",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "5",
      name: "Sản phẩm 5",
      price: "80.000đ",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "6",
      name: "Sản phẩm 6",
      price: "90.000đ",
      image: "/placeholder.svg?height=100&width=100",
    },
  ];
  return (
    <View className="w-[60%]">
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/food/[id]",
              params: { id: "2", title: "Bún chả giò chay" },
            }}
            asChild
          >
            <Pressable className="w-1/3 p-4">
              <FoodCard />
            </Pressable>
          </Link>
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "flex-start", gap: 8 }}
      />
    </View>
  );
}
