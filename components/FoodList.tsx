import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React from "react";
import FoodCard from "./FoodCard";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";

import { Combo, Dish } from "@/types";

type FoodListProps = {
  products: (Dish | Combo)[] | undefined;
  isFetching: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};
export default function FoodList({
  isFetching,
  products,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: FoodListProps) {
  if (isFetching) {
    return (
      <View className="w-[60%] justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="w-[60%]">
      <FlashList
        data={products}
        renderItem={({ item }) => {
          if ("comboName" in item) {
            return (
              <Link
                href={{
                  pathname: "/food/[id]",
                  params: { id: "2", title: "Bún chả giò chay" },
                }}
                asChild
              >
                <Pressable className="w-full p-4">
                  <FoodCard
                    name={item.comboName}
                    category={"Combo"}
                    image={item.comboThumbnail}
                    price={+item.comboPrice}
                    id={item.id}
                    type={"Combo"}
                  />
                </Pressable>
              </Link>
            );
          }
          return (
            <Link
              href={{
                pathname: "/food/[id]",
                params: { id: "2", title: "Bún chả giò chay" },
              }}
              asChild
            >
              <Pressable className="w-full p-4">
                <FoodCard
                  name={item.dishName}
                  category={item.categoryName}
                  image={item.images[0].url}
                  price={+item.price}
                  id={item.id}
                  type={"Dish"}
                />
              </Pressable>
            </Link>
          );
        }}
        estimatedItemSize={50}
        keyExtractor={(item) => item.id}
        numColumns={3}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500">không tìm thấy món ăn</Text>
          </View>
        )}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null
        }
      />
    </View>
  );
}
