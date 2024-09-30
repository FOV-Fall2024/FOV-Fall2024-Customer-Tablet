import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { usePathname } from "expo-router";
import LogoutButton from "./LogoutButton";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <View className="w-[12%] h-full p-4 border-r border-gray-300 justify-between flex">
      <View>
        <Text className="text-lg font-bold mb-4">Logo</Text>
        <Link
          href="/khaivi"
          className={`p-2 my-2 rounded ${
            isActive("/khaivi") ? "bg-blue-500 text-white" : "bg-transparent"
          }`}
        >
          Khai vị
        </Link>
        <Link
          href="/monchinh"
          className={`p-2 my-2 rounded ${
            isActive("/monchinh") ? "bg-blue-500 text-white" : "bg-transparent"
          }`}
        >
          Món chính
        </Link>
        <Link
          href="/trangmieng"
          className={`p-2 my-2 rounded ${
            isActive("/trangmieng")
              ? "bg-blue-500 text-white"
              : "bg-transparent"
          }`}
        >
          Tráng miệng
        </Link>
        <Link
          href="/douong"
          className={`p-2 my-2 rounded ${
            isActive("/douong") ? "bg-blue-500 text-white" : "bg-transparent"
          }`}
        >
          Đồ uống
        </Link>
      </View>
      <LogoutButton />
    </View>
  );
}
