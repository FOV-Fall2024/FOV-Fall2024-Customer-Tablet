import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { getDetail } from "@/apis";
import { ComboDetail, DishDetail } from "@/types";

export default function FoodDetail() {
  const { id, title, type } = useLocalSearchParams();

  const { data, isPending } = useQuery({
    queryKey: ["food", id],
    queryFn: () => getDetail(id as string, type as string),
  });

  const windowWidth = Dimensions.get("window").width;

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: title as string,
        }}
      />
      {type === "Dish" ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}
        >
          <View className="mb-4 items-center">
            <Carousel
              loop
              width={windowWidth * 0.4}
              height={windowWidth * 0.4}
              autoPlay={true}
              data={(data as DishDetail).images}
              scrollAnimationDuration={1000}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  className="w-full h-full rounded-lg"
                  contentFit="cover"
                />
              )}
            />
          </View>

          <View className="px-6">
            <View className="mb-4">
              <View className="flex flex-row items-center gap-2">
                <Text className="text-2xl font-bold text-gray-800">
                  {(data as DishDetail).dishName}
                </Text>
                <Text className="text-sm bg-yellow-400 text-gray-800 px-2 py-1 rounded-full">
                  {(data as DishDetail).categoryName}
                </Text>
              </View>
              <Text className="text-xl text-green-600 font-semibold">
                {(+(data as DishDetail).price).toLocaleString("vi-VN")} đ
              </Text>
            </View>
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-2">
                Mô tả
              </Text>
              <Text className="text-base text-gray-600 leading-relaxed">
                {(data as DishDetail).dishDescription}
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-2">
                Thành phần món ăn
              </Text>
              <View className="flex-col">
                {(data as DishDetail).ingredients.map((ingredient, index) => (
                  <Text key={index} className="text-base text-gray-600">
                    - {ingredient.ingredientName}{" "}
                    {ingredient.ingredientQuantity}{" "}
                    {ingredient.ingredientMeasureName}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}
        >
          <View className="mb-4 items-center">
            <Carousel
              loop
              width={windowWidth * 0.4}
              height={windowWidth * 0.4}
              autoPlay={true}
              data={[
                (data as ComboDetail).comboThumbnail,
                ...(data as ComboDetail).dishComboResponses.flatMap(
                  (dish) => dish.dishImages
                ),
              ]}
              scrollAnimationDuration={1000}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  className="w-full h-full rounded-lg"
                  contentFit="cover"
                />
              )}
            />
          </View>

          <View className="px-6">
            <View className="mb-4">
              <View className="flex flex-row items-center gap-2">
                <Text className="text-2xl font-bold text-gray-800">
                  {(data as ComboDetail).comboName}
                </Text>
                <Text className="text-sm bg-yellow-400 text-gray-800 px-2 py-1 rounded-full">
                  Combo
                </Text>
              </View>
              <Text className="text-xl text-green-600 font-semibold">
                {(+(data as ComboDetail).price).toLocaleString("vi-VN")} đ
              </Text>
            </View>
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-2">
                Mô tả
              </Text>
              <Text className="text-base text-gray-600 leading-relaxed">
                {(data as ComboDetail).comboDescription}
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-4">
                Thành phần combo
              </Text>
              <View className="space-y-2">
                {(data as ComboDetail).dishComboResponses.map((dish) => (
                  <View key={dish.dishId} className="bg-gray-50 rounded-lg p-3">
                    <Text className="text-base font-semibold text-gray-800 mb-2">
                      + {dish.dishName}
                    </Text>
                    <View className="pl-4">
                      {dish.getIngredients.map((ingredient) => (
                        <Text
                          key={ingredient.ingredientId}
                          className="text-sm text-gray-600"
                        >
                          - {ingredient.ingredientName}{" "}
                          {ingredient.ingredientQuantity}{" "}
                          {ingredient.ingredientMeasureName}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
