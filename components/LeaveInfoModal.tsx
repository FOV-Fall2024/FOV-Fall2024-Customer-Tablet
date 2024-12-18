import { leaveInfo } from "@/apis";
import { useMutation } from "@tanstack/react-query";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "./ToastConfig";

type LeaveInfoModalProps = {
  openLeaveInfoModal: boolean;
  setOpenLeaveInfoModal: Dispatch<SetStateAction<boolean>>;
  setPhone: Dispatch<SetStateAction<string>>;
  setMoneyDiscount: Dispatch<SetStateAction<number | undefined>>;
};
function LeaveInfoModal({
  openLeaveInfoModal,
  setOpenLeaveInfoModal,
  setMoneyDiscount,
  setPhone,
}: LeaveInfoModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const { isPending, mutateAsync } = useMutation({
    mutationFn: leaveInfo,
  });
  const handleLeaveInfo = async () => {
    const vietnamesePhoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!vietnamesePhoneRegex.test(phoneNumber)) {
      Toast.show({
        type: "error",
        text1: "Số điện thoại không hợp lệ",
      });
      return;
    }
    const data = await mutateAsync({ phoneNumber, fullName });
    if (data.statusCode === 200) {
      Toast.show({
        type: "success",
        text1: "Thông tin đã được ghi nhận",
      });
      setPhone(phoneNumber);
      setMoneyDiscount(0);
      setOpenLeaveInfoModal(false);
    } else {
      Toast.show({
        type: "error",
        text1: data.message,
      });
    }
  };
  return (
    <Modal
      visible={openLeaveInfoModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setOpenLeaveInfoModal(false)}
    >
      <View className="flex-1 bg-white bg-opacity-50 justify-center items-center">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full max-w-xl"
        >
          <View className="bg-white rounded-lg shadow-lg m-6 p-8">
            <Text className="text-3xl font-bold mb-8 text-center">
              Thông tin thành viên
            </Text>

            <View className="mb-6">
              <Text className="text-lg font-medium text-gray-700 mb-2">
                Số điện thoại
              </Text>
              <TextInput
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-xl"
                placeholder="Nhập số điện thoại"
                editable={!isPending}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            <View className="mb-8">
              <Text className="text-lg font-medium text-gray-700 mb-2">
                Họ và tên
              </Text>
              <TextInput
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-xl"
                placeholder="Nhập họ và tên"
                editable={!isPending}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View className="flex-row justify-between">
              <TouchableOpacity
                className={`bg-gray-500 py-4 px-6 rounded-lg flex-1 mr-4 ${
                  isPending ? "opacity-50" : ""
                }`}
                onPress={() => setOpenLeaveInfoModal(false)}
                disabled={isPending}
              >
                <Text className="text-center text-xl font-bold text-white">
                  Quay lại
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`bg-blue-500 py-4 px-6 rounded-lg flex-1 ${
                  isPending ? "opacity-50" : ""
                }`}
                onPress={handleLeaveInfo}
                disabled={isPending}
              >
                <Text className="text-center text-xl font-bold text-white">
                  {isPending ? "Đang xử lý..." : "Xác nhận"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
      <Toast position="top" config={toastConfig} />
    </Modal>
  );
}

export default LeaveInfoModal;
