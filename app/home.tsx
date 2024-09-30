import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FoodList, Header, Order } from "@/components";

const categories = ["Tất cả", "Khai vị", "Món chính", "Tráng miệng", "Đồ uống"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <GestureHandlerRootView className="flex-1">
        <Header />

        <View className="bg-white border-b border-gray-200">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              flexGrow: 1,
              justifyContent: "center",
              gap: 20,
            }}
            className="py-4"
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className={`px-4 py-2 mx-1 rounded-full ${
                  selectedCategory === category ? "bg-blue-500" : "bg-gray-200"
                }`}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedCategory === category
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="flex-1 flex-row">
          <FoodList />
          <Order />
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
