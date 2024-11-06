import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  BaseToast,
  ErrorToast,
  BaseToastProps,
} from "react-native-toast-message";
import { CheckCircle, XCircle, Info } from "lucide-react-native";

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={styles.success}
      contentContainerStyle={styles.contentContainer}
      text1NumberOfLines={0}
      text1Style={styles.title}
      text2Style={styles.message}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <CheckCircle color="#ffffff" size={24} />
        </View>
      )}
    />
  ),
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={styles.error}
      contentContainerStyle={styles.contentContainer}
      text1NumberOfLines={0}
      text1Style={styles.title}
      text2Style={styles.message}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <XCircle color="#ffffff" size={24} />
        </View>
      )}
    />
  ),
  info: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={styles.info}
      contentContainerStyle={styles.contentContainer}
      text1NumberOfLines={0}
      text1Style={styles.title}
      text2Style={styles.message}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Info color="#ffffff" size={24} />
        </View>
      )}
    />
  ),
};
const styles = StyleSheet.create({
  success: {
    backgroundColor: "#4CAF50",
    borderLeftColor: "#45a049",
  },
  error: {
    backgroundColor: "#F44336",
    borderLeftColor: "#d32f2f",
  },
  info: {
    backgroundColor: "#2196F3",
    borderLeftColor: "#1976D2",
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  message: {
    fontSize: 14,
    color: "#ffffff",
  },
  iconContainer: {
    paddingLeft: 15,
    justifyContent: "center",
  },
});