import React, { useContext, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { SignalrContext } from "@/context";
import { useCartStore } from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Payment() {
  const { connection } = useContext(SignalrContext);
  const clearCart = useCartStore((state) => state.clearCart);
  const { vnPayUrl } = useLocalSearchParams<{
    vnPayUrl: string;
  }>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  if (!vnPayUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Không tìm thấy URL thanh toán</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: vnPayUrl }}
        style={styles.webview}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView error: ", nativeEvent);
        }}
        onNavigationStateChange={async (navState) => {
          // Kiểm tra URL để xác định khi nào thanh toán hoàn tất
          if (
            navState.url.includes(
              "http://vktrng.ddns.net:8080/api/Payment/payment-confirm"
            )
          ) {
            const url = new URL(navState.url);
            const paymentStatus = url.searchParams.get("vnp_TransactionStatus");
            if (paymentStatus === "00") {
              // Xóa giỏ hàng
              clearCart();
              await AsyncStorage.removeItem("orderId");
              connection?.off("ReceiveOrderDetailsStatus");
              connection?.off("ReceiveOrderStatus");
              connection?.off("ReceiveRefundOrderDetails");
              connection?.off("ReceiveCancelAddMoreOrder");
              connection?.off("ReceiveMessage");
              connection?.off("ReceiveOrder");

              Toast.show({
                type: "success",
                text1: "Thanh toán thành công",
              });
            } else {
              Toast.show({
                type: "error",
                text1: "Thanh toán thất bại",
              });
            }

            // Thanh toán đã hoàn tất, chuyển hướng về trang xác nhận đơn hàng
            // router.replace('/order-confirmation');
            router.replace("/home");
          }
        }}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
