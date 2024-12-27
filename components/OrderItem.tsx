import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { TextInput } from "react-native-gesture-handler";
// import { TextInput } from "react-native";
import { CartItem } from "@/types";
import { useCartStore } from "@/store";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function OrderItem({ item }: { item: CartItem }) {
  const [localNote, setLocalNote] = useState(item.note);
  const increaseItemQuantity = useCartStore(
    (state) => state.increaseItemQuantity
  );
  const decreaseItemQuantity = useCartStore(
    (state) => state.decreaseItemQuantity
  );
  const removeItem = useCartStore((state) => state.removeItem);
  const orderStatus = useCartStore((state) => state.cartStatus);
  const increaseAddMoreItemQuantity = useCartStore(
    (state) => state.increaseAddMoreItemQuantity
  );
  const decreaseAddMoreItemQuantity = useCartStore(
    (state) => state.decreaseAddMoreItemQuantity
  );
  const changeNote = useCartStore((state) => state.changeNote);
  const removeAddMoreItem = useCartStore((state) => state.removeAddMoreItem);
  const isOrdering = useCartStore((state) => state.isOrdering);
  const listItems = useCartStore((state) => state.items);

  const handleNoteChange = useCallback((text: string) => {
    setLocalNote(text);
  }, []);

  const handleNoteEndEditing = useCallback(
    (e: { nativeEvent: { text: string } }) => {
      changeNote(e.nativeEvent.text, item.id);
    },
    [localNote, item.id, changeNote]
  );

  return (
    <View className="flex flex-row items-center justify-start p-4 bg-white rounded-lg shadow-md">
      <View className="mr-4 relative">
        <Image
          source={{
            uri: item.image,
          }}
          placeholder={blurhash}
          contentFit="cover"
          transition={1000}
          className="w-24 h-24 rounded-lg bg-gray-200"
          accessibilityLabel={`Ảnh món ${item.name}`}
        />
        <View className="absolute top-2 right-2 bg-yellow-400 rounded-full px-2 py-1">
          <Text className="text-xs font-bold text-gray-800">
            {item.category}
          </Text>
        </View>

        <View
          className={`absolute bottom-2 right-2 rounded-full px-1 py-1 ${
            item.isRefundDish ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <MaterialIcons
            name={item.isRefundDish ? "assignment-return" : "block"}
            size={16}
            color={item.isRefundDish ? "green" : "red"}
          />
        </View>
      </View>

      <View className="flex-1">
        <View className="flex flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
            <Text className="text-base text-green-600 font-semibold">
              {(+item.price * item.cartQuantity).toLocaleString("vi-VN")} ₫
            </Text>
          </View>
          {item.itemStatus === "pending" ? (
            <View className="flex flex-row items-center space-x-4 ">
              <Text className="text-base">Số lượng: {item.cartQuantity}</Text>
              <Text>Đang chờ duyệt</Text>
            </View>
          ) : item.itemStatus === "cook" ? (
            <View className="flex flex-row items-center space-x-4 ">
              <Text className="text-base">Số lượng: {item.cartQuantity}</Text>

              {item.isRefundDish ? (
                <Text>Đang lấy</Text>
              ) : (
                <Text>Đang nấu</Text>
              )}
            </View>
          ) : item.itemStatus === "serve" ? (
            <View className="flex flex-row items-center space-x-4 ">
              <Text className="text-base">Số lượng: {item.cartQuantity}</Text>
              <Text className="text-base">Phục vụ</Text>
            </View>
          ) : (
            <View className="flex flex-row items-center space-x-4 ">
              <View className="flex flex-row gap-2 items-center">
                <TouchableOpacity
                  className={`bg-gray-100 rounded-full p-2 active:bg-gray-200 ${
                    isOrdering ? "opacity-50" : ""
                  }`}
                  onPress={() => {
                    if (orderStatus === "addMore") {
                      const addMoreItem = listItems
                        .filter((i) => i.itemStatus === "idle")
                        .find((i) => i.id === item.id);
                      if (addMoreItem?.cartQuantity === 1) {
                        removeAddMoreItem(item.id);
                        return;
                      }
                      decreaseAddMoreItemQuantity(item.id);
                      return;
                    }
                    if (item.cartQuantity === 1) {
                      removeItem(item.id);
                      return;
                    }
                    decreaseItemQuantity(item.id);
                  }}
                  disabled={isOrdering}
                >
                  <AntDesign name="minus" size={20} color="#4B5563" />
                </TouchableOpacity>
                <Text className="text-lg text-gray-800">
                  {item.cartQuantity}
                </Text>
                <TouchableOpacity
                  className={`bg-gray-100 rounded-full p-2 active:bg-gray-200 ${
                    isOrdering ? "opacity-50" : ""
                  }`}
                  onPress={() => {
                    if (orderStatus === "addMore") {
                      increaseAddMoreItemQuantity(item.id);
                      return;
                    }
                    increaseItemQuantity(item.id);
                  }}
                  disabled={isOrdering}
                >
                  <AntDesign name="plus" size={20} color="#4B5563" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                className={`bg-red-100 rounded-full p-2 ml-2 active:bg-red-200 ${
                  isOrdering ? "opacity-50" : ""
                }`}
                onPress={() => {
                  if (orderStatus === "addMore") {
                    removeAddMoreItem(item.id);
                    return;
                  }
                  removeItem(item.id);
                }}
                disabled={isOrdering}
              >
                <AntDesign name="close" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View>
          <TextInput
            placeholder="Thêm lời nhắn cho đầu bếp"
            className="border border-gray-300 rounded-md px-2 py-1"
            readOnly={item.itemStatus !== "idle" || isOrdering}
            // editable={true}
            onChangeText={handleNoteChange}
            onEndEditing={(e) => handleNoteEndEditing(e)}
            value={localNote}
          />
        </View>
      </View>
    </View>
  );
}
