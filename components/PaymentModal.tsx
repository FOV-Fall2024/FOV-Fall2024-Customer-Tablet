import { router } from "expo-router";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LeaveInfoModal from "./LeaveInfoModal";
import { useMutation } from "@tanstack/react-query";
import { cashPayment, getPoint, getVnpayUrl } from "@/apis";
import Toast from "react-native-toast-message";
import { toastConfig } from "./ToastConfig";
import { useCartStore } from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PaymentModalProps = {
  isOpenPaymentModal: boolean;
  setOpenPaymentModal: Dispatch<SetStateAction<boolean>>;
};
function PaymentModal({
  isOpenPaymentModal,
  setOpenPaymentModal,
}: PaymentModalProps) {
  const getTotalMoney = useCartStore((state) => state.getTotalMoney);
  const changeCartStatus = useCartStore((state) => state.changeCartStatus);
  const setDiscountMoney = useCartStore((state) => state.setDiscountMoney);
  const [openLeaveInfoModal, setOpenLeaveInfoModal] = useState(false);

  const [totalMoneyDiscount, setTotalMoneyDiscount] = useState<
    number | undefined
  >(undefined);

  const [moneyDiscount, setMoneyDiscount] = useState<number | undefined>();
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
      setTotalMoneyDiscount(data.metadata);
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
    const orderId = (await AsyncStorage.getItem("orderId")) as string;
    const data = await muatateVnPayUrl({
      orderId,
      phoneNumber: phone,
      usePoint: !!moneyDiscount,
      pointToApply: moneyDiscount as number,
      feedback,
    });

    const vnPayUrl = data.paymentUrl;
    setPhone("");
    setFeedback("");
    setMoneyDiscount(undefined);
    setTotalMoneyDiscount(undefined);
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
    const orderId = (await AsyncStorage.getItem("orderId")) as string;
    const data = await mutateCash({
      orderId,
      phoneNumber: phone,
      usePoint: !!moneyDiscount,
      pointToApply: moneyDiscount as number,
      feedback,
    });

    if (data.statusCode === 200) {
      changeCartStatus("payment");
      if (moneyDiscount) {
        setDiscountMoney(moneyDiscount);
      }
      Toast.show({
        type: "success",
        text1: "Đợi nhân viên xác nhận thanh toán",
      });
      setPhone("");
      setFeedback("");
      setMoneyDiscount(undefined);
      setTotalMoneyDiscount(undefined);
      setOpenPaymentModal(false);
    } else {
      Toast.show({
        type: "error",
        text1: data.message,
      });
    }
  };
  const isProcessing =
    isGettingPoint || isGettingVnPayUrl || isCashPaymentRequest;

  return (
    <Modal
      visible={isOpenPaymentModal}
      // visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setOpenPaymentModal(false)}
    >
      <ScrollView className="p-4 bg-white rounded-lg flex-1">
        <Text className="text-3xl font-bold mb-8 text-center">Thanh toán</Text>

        <View className="mb-4">
          <Text className="text-xl mb-3 font-semibold">Kiểm tra giảm giá</Text>
          <Text className="text-base text-gray-600 mb-3">
            Vui lòng nhập số điện thoại để kiểm tra giảm giá (không bắt buộc)
          </Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 mr-3 border border-gray-300 rounded-md px-4 py-2 text-lg"
              placeholder="Số điện thoại"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (moneyDiscount !== undefined) {
                  setTotalMoneyDiscount(undefined);
                }
              }}
              editable={!isProcessing}
            />
            <TouchableOpacity
              className={`bg-blue-500 px-6 py-3 rounded-md ${
                isProcessing ? "opacity-50" : ""
              }`}
              onPress={handleGetPoint}
              disabled={isProcessing}
            >
              <Text className="text-white font-bold text-lg">Kiểm tra</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-xl mb-3 font-semibold">Góp ý</Text>
          <Text className="text-base text-gray-600 mb-3">
            Vui lòng để lại góp ý cho nhà hàng (không bắt buộc)
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md px-4 py-2 h-32 text-lg"
            placeholder="Góp ý"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={feedback}
            onChangeText={setFeedback}
            editable={!isProcessing}
          />
        </View>

        {totalMoneyDiscount !== undefined && (
          <View className="mb-4 p-4 bg-blue-50 rounded-lg">
            {totalMoneyDiscount > 0 ? (
              <View className="items-center flex-row gap-4">
                <TextInput
                  placeholder="Nhập số tiền muốn giảm"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-base"
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");

                    // Loại bỏ các số 0 ở đầu
                    const formattedValue = numericValue.replace(/^0+/, "");
                    if (formattedValue === "") {
                      setMoneyDiscount(undefined);
                      return;
                    }

                    setMoneyDiscount(Number(formattedValue));
                  }}
                  value={moneyDiscount ? moneyDiscount.toString() : "0"}
                  editable={!isProcessing}
                />
                <Text className="text-blue-600 text-lg">
                  Bạn được giảm giá tối đa{" "}
                  {totalMoneyDiscount.toLocaleString("vi-VN")} đ
                </Text>
              </View>
            ) : (
              <Text className="text-gray-600 text-lg">
                Bạn không có điểm tích lũy để giảm giá
              </Text>
            )}
          </View>
        )}

        {totalMoneyDiscount === undefined && (
          <TouchableOpacity
            onPress={() => setOpenLeaveInfoModal(true)}
            disabled={isProcessing}
            className="mb-4"
          >
            <Text className="text-blue-500 underline text-lg">
              Chưa có thông tin thành viên? Nhấn vào đây để đăng ký
            </Text>
          </TouchableOpacity>
        )}

        <View className="mb-8">
          {moneyDiscount && moneyDiscount > getTotalMoney() ? (
            <Text className="text-red-600 text-lg">
              Số tiền giảm không được lớn hơn tổng tiền của đơn hàng
            </Text>
          ) : moneyDiscount !== undefined &&
            totalMoneyDiscount !== undefined &&
            moneyDiscount > totalMoneyDiscount ? (
            <Text className="text-red-600 text-lg">
              Số tiền giảm không được lớn hơn số tiền giảm tối đa
            </Text>
          ) : moneyDiscount !== undefined && moneyDiscount < 0 ? (
            <Text className="text-red-600 text-lg">
              Số tiền giảm không hợp lệ
            </Text>
          ) : (
            <Text className="text-2xl font-bold">
              Tổng cộng:{" "}
              {(getTotalMoney() - (moneyDiscount ?? 0)).toLocaleString("vi-VN")}{" "}
              đ
            </Text>
          )}
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity
            className={`bg-gray-500 py-3 px-6 rounded-md ${
              isProcessing ? "opacity-50" : ""
            }`}
            onPress={() => setOpenPaymentModal(false)}
            disabled={isProcessing}
          >
            <Text className="text-white font-bold text-lg">Quay lại</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`bg-blue-500 py-3 px-6 rounded-md ${
              isProcessing ? "opacity-50" : ""
            }
            ${
              moneyDiscount !== undefined && moneyDiscount > getTotalMoney()
                ? "opacity-50"
                : ""
            } 
            ${
              moneyDiscount !== undefined &&
              totalMoneyDiscount !== undefined &&
              moneyDiscount > totalMoneyDiscount
                ? "opacity-50"
                : ""
            }
            ${
              moneyDiscount !== undefined &&
              getTotalMoney() - moneyDiscount < 5000
                ? "opacity-50"
                : ""
            }
            ${
              moneyDiscount !== undefined && moneyDiscount < 0
                ? "opacity-50"
                : ""
            }
            `}
            onPress={handleVnPay}
            disabled={
              isProcessing ||
              (moneyDiscount !== undefined &&
                moneyDiscount > getTotalMoney()) ||
              (moneyDiscount !== undefined &&
                getTotalMoney() - moneyDiscount < 5000) ||
              (moneyDiscount !== undefined &&
                totalMoneyDiscount !== undefined &&
                moneyDiscount > totalMoneyDiscount) ||
              (moneyDiscount !== undefined && moneyDiscount < 0)
            }
          >
            <Text className="text-white font-bold text-lg">
              Thanh toán VNPay
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`bg-green-500 py-3 px-6 rounded-md ${
              isProcessing ? "opacity-50" : ""
            } 
            ${
              moneyDiscount !== undefined && moneyDiscount > getTotalMoney()
                ? "opacity-50"
                : ""
            }
            ${
              moneyDiscount !== undefined &&
              totalMoneyDiscount !== undefined &&
              moneyDiscount > totalMoneyDiscount
                ? "opacity-50"
                : ""
            }
            ${
              moneyDiscount !== undefined && moneyDiscount < 0
                ? "opacity-50"
                : ""
            }
            `}
            onPress={handleCashPayment}
            disabled={
              isProcessing ||
              (moneyDiscount !== undefined &&
                moneyDiscount > getTotalMoney()) ||
              (moneyDiscount !== undefined &&
                totalMoneyDiscount !== undefined &&
                moneyDiscount > totalMoneyDiscount) ||
              (moneyDiscount !== undefined && moneyDiscount < 0)
            }
          >
            <Text className="text-white font-bold text-lg">Tiền mặt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LeaveInfoModal
        openLeaveInfoModal={openLeaveInfoModal}
        setOpenLeaveInfoModal={setOpenLeaveInfoModal}
        setPhone={setPhone}
        setMoneyDiscount={setTotalMoneyDiscount}
      />
      <Toast position="top" config={toastConfig} />
    </Modal>
  );
}

export default PaymentModal;
