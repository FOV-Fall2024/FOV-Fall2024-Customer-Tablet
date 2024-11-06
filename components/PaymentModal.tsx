import { router } from "expo-router";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LeaveInfoModal from "./LeaveInfoModal";
import { useMutation } from "@tanstack/react-query";
import { cashPayment, getPoint, getVnpayUrl } from "@/apis";
import Toast from "react-native-toast-message";
import Checkbox from "expo-checkbox";
import { toastConfig } from "./ToastConfig";
import { useCartStore } from "@/store";

type PaymentModalProps = {
  isOpenPaymentModal: boolean;
  setOpenPaymentModal: Dispatch<SetStateAction<boolean>>;
  orderId: string;
};
function PaymentModal({
  isOpenPaymentModal,
  setOpenPaymentModal,
  orderId,
}: PaymentModalProps) {
  const getTotalMoney = useCartStore((state) => state.getTotalMoney);
  const [openLeaveInfoModal, setOpenLeaveInfoModal] = useState(false);
  const [isChecked, setChecked] = useState(false);

  const [moneyDiscount, setMoneyDiscount] = useState<number | undefined>(
    undefined
  );
  const [feedback, setFeedback] = useState("");

  const [phone, setPhone] = useState("");

  const { mutateAsync, isPending: isGettingPoint } = useMutation({
    mutationFn: getPoint,
  });

  const handleGetPoint = async () => {
    if (!phone) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập số điện thoại",
      });
      return;
    }

    const vietnamesePhoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!vietnamesePhoneRegex.test(phone)) {
      Toast.show({
        type: "error",
        text1: "Số điện thoại không hợp lệ",
      });
      return;
    }

    const data = await mutateAsync(phone);
    if (data.statusCode === 200) {
      setMoneyDiscount(data.metadata);
    } else {
      Toast.show({
        type: "error",
        text1: data.message,
      });
    }
  };

  const { mutateAsync: muatateVnPayUrl, isPending: isGettingVnPayUrl } =
    useMutation({
      mutationFn: getVnpayUrl,
    });
  const handleVnPay = async () => {
    const data = await muatateVnPayUrl({
      orderId,
      phoneNumber: phone,
      usePoint: isChecked,
      pointToApply: moneyDiscount as number,
      feedback,
    });
    const vnPayUrl = data.paymentUrl;
    setOpenPaymentModal(false);
    setOpenLeaveInfoModal(false);
    router.push({
      pathname: "/payment",
      params: { vnPayUrl, feedback },
    });
  };

  const { mutateAsync: mutateCash, isPending: isCashPaymentRequest } =
    useMutation({
      mutationFn: cashPayment,
    });
  const handleCashPayment = async () => {
    const data = await mutateCash({
      orderId,
      phoneNumber: phone,
      usePoint: isChecked,
      pointToApply: moneyDiscount as number,
      feedback,
    });
    if (data.statusCode === 200) {
      Toast.show({
        type: "success",
        text1: "Đợi nhân viên xác nhận thanh toán",
      });
      setOpenPaymentModal(false);
    } else {
      Toast.show({
        type: "error",
        text1: data.message,
      });
    }
  };

  return (
    <Modal
      visible={isOpenPaymentModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setOpenPaymentModal(false)}
    >
      <View className="bg-white flex-1 p-4">
        <View>
          <Text>
            Vui lòng nhập số điện thoại để thống kiểm tra giảm giá (không bắt
            buộc)
          </Text>
          <View className="flex flex-row items-center justify-center mt-2">
            <TextInput
              placeholder="Số điện thoại"
              className="border border-gray-300 rounded-md px-2 py-1 flex-1 mr-2"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (moneyDiscount !== undefined) {
                  setMoneyDiscount(undefined);
                }
              }}
              editable={
                !isGettingPoint || !isGettingVnPayUrl || !isCashPaymentRequest
              }
            />
            <Button
              title="Kiểm tra"
              onPress={handleGetPoint}
              disabled={
                isGettingPoint || isGettingVnPayUrl || isCashPaymentRequest
              }
            />
          </View>
        </View>
        <View className="mt-2">
          <Text>Vui lòng để lại góp ý cho nhà hàng (không bắt buộc)</Text>
          <TextInput
            placeholder="Góp ý"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="border border-gray-300 rounded-md px-2 py-1 mt-2"
            value={feedback}
            onChangeText={setFeedback}
            editable={
              !isGettingPoint || !isGettingVnPayUrl || !isCashPaymentRequest
            }
          />
        </View>
        {moneyDiscount !== undefined && moneyDiscount > 0 ? (
          <View className="flex flex-row items-center mt-2">
            <Checkbox
              className="mr-2"
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? "#3B82F6" : undefined}
              disabled={
                isGettingPoint || isGettingVnPayUrl || isCashPaymentRequest
              }
            />
            <Text>
              Bạn được giảm giá {moneyDiscount.toLocaleString("vi-VN")} đ
            </Text>
          </View>
        ) : moneyDiscount === 0 ? (
          <Text className="mt-2">Bạn không có điểm tích lũy để giảm giá</Text>
        ) : (
          <Text className="mt-2">
            Nếu bạn chưa có thông tin thành viên vui lòng để lại thông tin{" "}
            <TouchableOpacity
              onPress={() => setOpenLeaveInfoModal(true)}
              disabled={
                isGettingPoint || isGettingVnPayUrl || isCashPaymentRequest
              }
            >
              <Text className="text-blue-500 underline"> tại đây </Text>
            </TouchableOpacity>
            <Text> (không bắt buộc)</Text>.
          </Text>
        )}

        {isChecked ? (
          <Text className="mt-2">
            Tổng cộng:{" "}
            {(getTotalMoney() - (moneyDiscount ?? 0)).toLocaleString("vi-VN")}
          </Text>
        ) : (
          <Text className="mt-2">
            Tổng cộng: {getTotalMoney().toLocaleString("vi-VN")}
          </Text>
        )}

        <View className="flex flex-row mt-2">
          <TouchableOpacity
            className="bg-blue-500 py-2 px-4 rounded-full mr-2 flex-1"
            onPress={() => setOpenPaymentModal(false)}
            disabled={
              isGettingPoint || isGettingVnPayUrl || isCashPaymentRequest
            }
          >
            <Text className="text-center text-base font-bold text-white">
              Quay lại
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={
              isGettingPoint || isGettingVnPayUrl || isCashPaymentRequest
            }
            className="bg-blue-500 py-2 px-4 rounded-full mr-2 flex-1"
            onPress={() => {
              handleVnPay();
            }}
          >
            <Text className="text-white text-center text-base font-bold">
              Thanh toán qua vnpay
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-blue-500 py-2 px-4 rounded-full flex-1"
            disabled={
              isGettingPoint || isGettingVnPayUrl || isCashPaymentRequest
            }
            onPress={() => {
              handleCashPayment();
            }}
          >
            <Text className="text-white text-center text-base font-bold">
              Thanh toán bằng tiền mặt
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <LeaveInfoModal
        openLeaveInfoModal={openLeaveInfoModal}
        setOpenLeaveInfoModal={setOpenLeaveInfoModal}
        setPhone={setPhone}
        setMoneyDiscount={setMoneyDiscount}
      />
      <Toast position="top" config={toastConfig} />
    </Modal>
  );
}

export default PaymentModal;
