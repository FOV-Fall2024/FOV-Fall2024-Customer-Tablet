import React, { Dispatch, SetStateAction, useContext } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SignalrContext } from "@/context";

const HandleConnectionModal = ({
  connectionState,
  setConnectionState,
}: {
  connectionState: string;
  setConnectionState: Dispatch<SetStateAction<string>>;
}) => {
  const { connection } = useContext(SignalrContext);
  const isVisible =
    connectionState === "Reconnecting" || connectionState === "Disconnected";

  const handleHardConnect = async () => {
    const orderId = await AsyncStorage.getItem("orderId");
    if (orderId) {
      setConnectionState("Reconnecting");
      connection
        ?.start()
        .then(() => {
          connection.invoke("SendOrder", orderId).then(() => {
            setConnectionState("");
          });
        })
        .catch(() => {
          setConnectionState("Disconnected");
        });
    } else {
      setConnectionState("Reconnecting");
      connection
        ?.start()
        .then(() => {
          setConnectionState("");
        })
        .catch(() => {
          setConnectionState("Disconnected");
        });
    }
  };
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View
        className="flex-1 bg-black items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      >
        <View className="bg-white rounded-lg p-6 w-4/5 max-w-sm items-center">
          {connectionState === "Reconnecting" ? (
            <>
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="mb-4"
              />
              <Text className="text-lg font-semibold text-center mb-2">
                Đang kết nối lại...
              </Text>
              <Text className="text-sm text-gray-600 text-center">
                Vui lòng đợi trong giây lát
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="close-circle"
                size={48}
                color="#ff0000"
                style={{ marginBottom: 16 }}
              />
              <Text className="text-lg font-semibold text-center mb-2">
                Mất kết nối
              </Text>
              <Text className="text-sm text-gray-600 text-center mb-4">
                Không thể kết nối đến máy chủ
              </Text>
              <TouchableOpacity
                onPress={handleHardConnect}
                className="bg-blue-500 rounded-full py-2 px-6 flex-row items-center"
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color="#ffffff"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white font-semibold">Thử lại</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default HandleConnectionModal;
