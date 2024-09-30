import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View className="flex-row items-center p-4 bg-white border-b border-gray-200 gap-4">
      <Image
        source={{ uri: "/placeholder.svg?height=50&width=100" }}
        className="w-24 h-12 mr-4"
      />
      <View className="flex-row items-center flex-1 bg-gray-100 rounded-full px-4 py-2">
        <FontAwesome name="search" size={20} color="#000" />
        <TextInput
          className="flex-1 ml-2 text-base"
          placeholder="Tìm kiếm..."
        />
      </View>
      <View className="flex-row items-center mr-4">
        <FontAwesome name="clock-o" size={24} color="#000" />
        <Text className="ml-2 text-base">
          {currentTime.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      </View>
      <Text className="text-base font-bold mr-4">Bàn số: 1</Text>

      <LogoutButton />
    </View>
  );
}
