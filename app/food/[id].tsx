import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";

// Sample food item data
const foodItem = {
  id: "1",
  name: "Bún chả giò chay",
  price: "20.000 ₫",
  description:
    "Món chay ngon lành với bún chả giò giòn rụm, kết hợp với rau sống và nước mắm chua ngọt.",
  ingredients: [
    "Bún",
    "Chả giò chay",
    "Rau sống",
    "Nước mắm chua ngọt",
    "Đậu phộng",
  ],
  images: [
    "https://dukaan.b-cdn.net/700x700/webp/upload_file_service/6a0df908-a609-43ba-a1bd-8cf07c019ff0/bun-cha-gio-chay-jpg",
    "https://dukaan.b-cdn.net/700x700/webp/upload_file_service/6a0df908-a609-43ba-a1bd-8cf07c019ff0/bun-cha-gio-chay-jpg",
    "https://dukaan.b-cdn.net/700x700/webp/upload_file_service/6a0df908-a609-43ba-a1bd-8cf07c019ff0/bun-cha-gio-chay-jpg",
  ],
};

export default function FoodDetail() {
  const { id } = useLocalSearchParams(); // Get the food item ID from the URL

  const windowWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Bún chả giò chay",
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Image Carousel */}
        <View className="mb-4 items-center">
          <Carousel
            loop
            width={windowWidth * 0.4} // Larger width for better image view
            height={windowWidth * 0.4} // Same as width to maintain square shape
            autoPlay={true} // Set to true for automatic sliding
            data={foodItem.images}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                className="w-full h-full rounded-lg" // Add rounded corners
                contentFit="cover" // Maintain aspect ratio
              />
            )}
          />
        </View>

        {/* Food Details */}
        <View className="px-6">
          {/* Add padding to align content */}
          {/* Name and Price */}
          <View className="mb-4">
            <Text className="text-2xl font-bold text-gray-800">
              {foodItem.name}
            </Text>
            <Text className="text-xl text-green-600 font-semibold">
              {foodItem.price}
            </Text>
          </View>
          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-2">Mô tả</Text>
            <Text className="text-base text-gray-600 leading-relaxed">
              {foodItem.description}
            </Text>
          </View>
          {/* Ingredients */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Thành phần món ăn
            </Text>
            <View className="flex-col">
              {foodItem.ingredients.map((ingredient, index) => (
                <Text key={index} className="text-base text-gray-600">
                  - {ingredient}
                </Text>
              ))}
            </View>
          </View>
          {/* Add to Cart Button */}
          <View className="flex-row justify-center mt-6">
            <TouchableOpacity className="bg-blue-500 py-3 px-6 rounded-full">
              <Text className="text-white text-lg font-semibold">
                Thêm vào giỏ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
