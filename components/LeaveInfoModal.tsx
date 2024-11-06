import React, { Dispatch, SetStateAction } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

type LeaveInfoModalProps = {
  openLeaveInfoModal: boolean;
  setOpenLeaveInfoModal: Dispatch<SetStateAction<boolean>>;
  setPhone: Dispatch<SetStateAction<string>>;
  setMoneyDiscount: Dispatch<SetStateAction<number | undefined>>;
};
function LeaveInfoModal({
  openLeaveInfoModal,
  setOpenLeaveInfoModal,
}: LeaveInfoModalProps) {
  return (
    <Modal
      visible={openLeaveInfoModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setOpenLeaveInfoModal(false)}
    >
      <View className="bg-white flex-1 p-4">
        <View>
          <Text>Nhập số điện thoại</Text>
          <TextInput
            placeholder="Số điện thoại"
            className="border border-gray-300 rounded-md px-2 py-1 mt-2"
          />
        </View>
        <View className="mt-2">
          <Text>Nhập họ và tên</Text>
          <TextInput
            placeholder="Vui lòng nhập họ"
            className="border border-gray-300 rounded-md px-2 py-1 mt-2"
          />
        </View>
        <View className="mt-2 flex flex-row">
          <TouchableOpacity
            className="bg-blue-500 py-2 px-4 rounded-full mr-2 flex-1"
            onPress={() => setOpenLeaveInfoModal(false)}
          >
            <Text className="text-center text-base font-bold text-white">
              Quay lại
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-blue-500 py-2 px-4 rounded-full flex-1"
            // onPress={() => setOpenModal2(false)}
          >
            <Text className="text-center text-base font-bold text-white">
              Xác nhận
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default LeaveInfoModal;
