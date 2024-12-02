import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
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
  refetch: () => any;
};
export default function FoodList({
  isFetching,
  products,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
}: FoodListProps) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);
  if (isFetching && !refreshing) {
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
                  params: {
                    id: `${item.id}`,
                    title: `${item.comboName}`,
                    type: "Combo",
                  },
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
                    isRefundDish={false}
                  />
                </Pressable>
              </Link>
            );
          }
          return (
            <Link
              href={{
                pathname: "/food/[id]",
                params: {
                  id: `${item.id}`,
                  title: `${item.dishName}`,
                  type: "Dish",
                },
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
                  isRefundDish={item.isRefundDish}
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
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
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
