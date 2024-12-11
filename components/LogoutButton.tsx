import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import React, { useContext, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { tableLogout } from "@/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCartStore } from "@/store";
import { SignalrContext } from "@/context";

export default function LogoutButton() {
  const { connection } = useContext(SignalrContext);
  const clearCart = useCartStore((state) => state.clearCart);
  const [modalVisible, setModalVisible] = useState(false);
  const [employeeCode, setEmployeeCode] = useState("");
  const orderStatus = useCartStore((state) => state.cartStatus);
  const isOrdering = useCartStore((state) => state.isOrdering);
  const { mutate, isPending } = useMutation({
    mutationFn: tableLogout,
  });
  const handleLogout = async () => {
    const loginData = await AsyncStorage.getItem("loginData");
    const tableId = JSON.parse(loginData!).tableId;

    mutate({ id: tableId, employeeCode });
    await AsyncStorage.removeItem("loginData");

    clearCart();
    connection?.off("ReceiveOrderDetailsStatus");
    connection?.off("ReceiveOrderStatus");
    connection?.off("ReceiveRefundOrderDetails");
    connection?.off("ReceiveCancelAddMoreOrder");
    connection?.off("ReceiveMessage");
    connection?.off("ReceiveOrder");

    setModalVisible(false);
    setEmployeeCode("");
    router.push("/");
  };
  return (
    <>
      <TouchableOpacity
        className={`p-2 bg-red-500 rounded-full mt-4 ${
          orderStatus !== "idle" && "opacity-50"
        } ${isOrdering && "opacity-50"}`}
        onPress={() => setModalVisible(true)}
        disabled={orderStatus !== "idle" || isOrdering}
      >
        <FontAwesome name="sign-out" size={20} color="#fff" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-zinc-900/80">
          <View className="bg-white w-80 p-4 rounded">
            <Text className="text-lg font-bold mb-4">
              Nhập mã quản lý của bạn
            </Text>
            <TextInput
              placeholder="Mã quản lý"
              value={employeeCode}
              onChangeText={setEmployeeCode}
              className="border border-gray-300 p-2 rounded mb-4"
            />
            <View className="flex flex-row justify-between">
              <TouchableOpacity
                className="rounded bg-blue-500 p-2"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded bg-blue-500 p-2"
                onPress={handleLogout}
                disabled={isPending}
              >
                <Text className="text-white">
                  {isPending ? "Đang xử lý" : "Đăng xuất"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
