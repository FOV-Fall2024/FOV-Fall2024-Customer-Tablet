import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Button } from "react-native";
import OrderItem from "./OrderItem";
import { useCartStore } from "@/store";
import { orderFood, orderMoreFood } from "@/apis";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import PaymentModal from "./PaymentModal";
import { SignalrContext } from "@/context";

export default function Order() {
  const { connection } = useContext(SignalrContext);

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const cartItem = useCartStore((state) => state.items);
  const orderStatus = useCartStore((state) => state.cartStatus);
  const changeCartStatus = useCartStore((state) => state.changeCartStatus);
  const changeItemStatusToServe = useCartStore(
    (state) => state.changeItemStatusToServe
  );
  const refundItem = useCartStore((state) => state.refundItem);
  const findItemNameToServe = useCartStore(
    (state) => state.findItemNameToServe
  );
  const totalMoney = useCartStore((state) => state.getTotalMoney);

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: orderFood,
  });

  const handleOrder = async () => {
    const orderDetails = cartItem.map((item) =>
      item.type === "Combo"
        ? { comboId: item.id, quantity: item.cartQuantity, note: item.note }
        : { productId: item.id, quantity: item.cartQuantity, note: item.note }
    );

    const data = await mutateAsync(orderDetails);
    // console.log(data);
    // console.log(error);

    if (data.statusCode === 200) {
      if (!connection) {
        Toast.show({
          type: "error",
          text1: "Không thể kết nối với máy chủ",
        });
        return;
      }

      // await connection.start();
      await connection.invoke("SendOrder", data.metadata);
      changeCartStatus("pending");
      setOrderId(data.metadata);
      // setIsOrderActive(true);
      Toast.show({
        type: "success",
        text1: "Đặt món thành công xin vui lòng chờ nhân viên đến xác nhận",
      });
    } else {
      Toast.show({
        type: "error",
        text1: data.message,
      });
    }
  };

  const { mutateAsync: OrderMore, isPending: isAddingMore } = useMutation({
    mutationFn: orderMoreFood,
  });

  const handleOrderMore = async () => {
    const newOrderDetails = cartItem
      .filter((item) => item.itemStatus === "idle")
      .map((item) =>
        item.type === "Combo"
          ? { comboId: item.id, quantity: item.cartQuantity, note: item.note }
          : { productId: item.id, quantity: item.cartQuantity, note: item.note }
      );
    const data = await OrderMore({ orderId, newOrderDetails });
    // console.log("data", data);

    if (data.statusCode === 200) {
      Toast.show({
        type: "success",
        text1: "Gọi thêm món thành công",
      });
      changeCartStatus("pending", "addMore");
    } else {
      Toast.show({
        type: "error",
        text1: data.message,
      });
    }
  };
  // || !isOrderActive
  useEffect(() => {
    if (!connection) return;
    connection.onclose(() => {
      console.log("Disconnected from SignalR");
    });
    connection.onreconnected(() => {
      if (orderStatus !== "idle") {
        connection.invoke("SendOrder", orderId);
      }
    });

    connection.on(
      "ReceiveOrderDetailsStatus",
      (productIdOrComboId: string, status: string) => {
        const name = findItemNameToServe(productIdOrComboId);
        changeItemStatusToServe(productIdOrComboId);

        Toast.show({
          type: "success",
          text1: `Món ${name} của bạn đã được phục vụ`,
        });
      }
    );

    connection.on("ReceiveOrderStatus", (orderId: string, status: string) => {
      if (status === "Cook") {
        changeCartStatus("cook");
        Toast.show({
          type: "success",
          text1: "Món ăn của bạn đang được chuẩn bị",
        });
      }
      if (status === "Canceled") {
        changeCartStatus("cancel");
        // connection.off("ReceiveOrderDetailsStatus");
        // connection.off("ReceiveOrderStatus");
        // connection.off("ReceiveRefundOrderDetails");
        // connection.off("ReceiveCancelAddMoreOrder");
        // connection.off("ReceiveMessage");
        // connection.off("ReceiveOrder");
        // connection.stop();
        // setIsOrderActive(false);
        Toast.show({
          type: "info",
          text1: "Đơn hàng của bạn đã bị hủy",
        });
      }
    });

    connection.on(
      "ReceiveRefundOrderDetails",
      (productIdOrComboId: string, quantity: number) => {
        refundItem(productIdOrComboId, quantity);
      }
    );

    connection.on("ReceiveCancelAddMoreOrder", (orderId: string) => {
      changeCartStatus("cancel", "addMore");
      Toast.show({
        type: "info",
        text1: "Đã hủy gọi thêm món",
      });
    });

    connection.on("ReceiveMessage", (message1: string, message2: string) => {
      // do nothing
    });
    connection.on("ReceiveOrder", (connectionId: string, orderId: string) => {
      // do nothing
    });

    return () => {
      connection.off("ReceiveOrderDetailsStatus");
      connection.off("ReceiveOrderStatus");
      connection.off("ReceiveRefundOrderDetails");
      connection.off("ReceiveCancelAddMoreOrder");
      connection.off("ReceiveMessage");
      connection.off("ReceiveOrder");
    };
  }, [connection]);
  // , isOrderActive

  return (
    <View className="flex-1 bg-white m-4 p-2 rounded-lg shadow">
      <View className=" border-b border-gray-300">
        <Text className="text-xl font-bold text-center pb-2">
          Đơn hàng của bạn
        </Text>
      </View>
      <ScrollView>
        {cartItem.map((item) => (
          <OrderItem item={item} key={item.id + Math.random()} />
        ))}
      </ScrollView>
      <View className="mt-4 border-t border-gray-200 pt-4">
        <Text className="text-lg font-bold">
          Tổng cộng: {totalMoney().toLocaleString("vi-VN")} đ
        </Text>
        {orderStatus === "pending" ? (
          <Text className="text-lg font-bold text-center text-blue-500">
            Đang chờ xác nhận
          </Text>
        ) : orderStatus === "cook" ? (
          <Text className="text-lg font-bold text-center text-blue-500">
            Món ăn của bạn đang được chuẩn bị
          </Text>
        ) : orderStatus === "serve" ? (
          <View className="flex flex-row items-center justify-center gap-4 mt-2">
            <TouchableOpacity
              className="bg-blue-500 py-2 px-4 rounded-full flex-1"
              onPress={() => {
                changeCartStatus("addMore");
              }}
            >
              <Text className="text-white text-center text-base font-bold">
                Gọi thêm
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-500 py-2 px-4 rounded-full flex-1"
              onPress={() => setOpenPaymentModal(true)}
              disabled={isPending}
            >
              <Text className="text-white text-center text-base font-bold">
                Thanh toán
              </Text>
            </TouchableOpacity>
          </View>
        ) : orderStatus === "addMore" ? (
          <View className="flex flex-row items-center justify-center gap-4 mt-2">
            <TouchableOpacity className="bg-blue-500 py-2 px-4 rounded-full flex-1">
              <Text
                className="text-white text-center text-base font-bold"
                onPress={handleOrderMore}
                disabled={isAddingMore}
              >
                {isAddingMore ? "Đang xử lý..." : "Xác nhận gọi thêm món"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-500 py-2 px-4 rounded-full flex-1">
              <Text
                className="text-white text-center text-base font-bold"
                onPress={() => {
                  changeCartStatus("cancelAddMore");
                }}
              >
                Hủy gọi thêm món
              </Text>
            </TouchableOpacity>
          </View>
        ) : orderStatus === "payment" ? (
          <Text className="text-lg font-bold text-center text-blue-500">
            Đang chờ nhân viên đến thanh toán
          </Text>
        ) : (
          <TouchableOpacity
            className="mt-4 bg-blue-500 py-2 px-4 rounded-full"
            onPress={handleOrder}
            disabled={isPending}
          >
            <Text className="text-white text-center text-base font-bold">
              {isPending ? "Đang xử lý..." : "Đặt món"}
            </Text>
          </TouchableOpacity>

          // <TouchableOpacity
          //   className="mt-4 bg-blue-500 py-2 px-4 rounded-full"
          //   onPress={() => setOpenPaymentModal(true)}
          //   disabled={isPending}
          // >
          //   <Text className="text-white text-center text-base font-bold">
          //     Thanh toán
          //   </Text>
          // </TouchableOpacity>
        )}
      </View>

      <PaymentModal
        isOpenPaymentModal={openPaymentModal}
        setOpenPaymentModal={setOpenPaymentModal}
        orderId={orderId}
      />
    </View>
  );
}
