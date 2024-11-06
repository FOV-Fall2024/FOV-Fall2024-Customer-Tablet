import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRestaurants, getTables, tableLogin } from "@/apis";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Table } from "@/types";

export default function Login() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
    null
  );
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showTables, setShowTables] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const loginData = await AsyncStorage.getItem("loginData");
      if (loginData) {
        router.replace("/home");
      } else {
        return;
      }
    };
    checkLogin();
  }, []);

  const { data: restaurants, isLoading: restaurantsLoading } = useQuery({
    queryKey: ["getRestaurants"],
    queryFn: getRestaurants,
  });

  const { data: tables, isPending: tablesLoading } = useQuery({
    queryKey: ["getTables", selectedRestaurant],
    queryFn: () => getTables(selectedRestaurant!),
    enabled: !!selectedRestaurant,
    staleTime: 0,
    gcTime: 0,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: tableLogin,
  });

  useEffect(() => {
    if (tables && tables.results.length > 0 && !selectedTable) {
      setSelectedTable(tables.results[0]);
    }
  }, [tables]);

  // useEffect(() => {
  //   setShowTables(!!selectedRestaurant);
  // }, [selectedRestaurant]);

  if (restaurantsLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const handleRestaurantChange = (itemValue: string | null) => {
    if (itemValue === "placeholder") {
      setSelectedRestaurant(null);
      setSelectedTable(null);
      setShowTables(false);
    } else {
      setSelectedRestaurant(itemValue);
      setSelectedTable(null);
      setShowTables(true);
    }
  };

  const handleLogin = async () => {
    const loginData = {
      restaurantId: selectedRestaurant,
      tableNumber: selectedTable?.tableNumber,
      tableId: selectedTable?.id,
    };
    if (selectedTable?.id) {
      await mutateAsync(selectedTable.id);
    }
    await AsyncStorage.setItem("loginData", JSON.stringify(loginData));
    router.replace("/home");
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center p-6 bg-gray-100">
      <Text className="text-xl font-bold mb-4">Đăng nhập</Text>
      <View className="flex flex-col items-start gap-2 justify-center mb-4">
        <Text>Chọn Chi nhánh</Text>
        <View className="border border-gray-300 rounded-md bg-white w-96">
          <Picker
            selectedValue={selectedRestaurant || "placeholder"}
            onValueChange={handleRestaurantChange}
          >
            <Picker.Item label="Chọn chi nhánh" value="placeholder" />
            {restaurants?.results.map((restaurant: any) => (
              <Picker.Item
                key={restaurant.id}
                label={restaurant.restaurantName}
                value={restaurant.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      {showTables && (
        <>
          {tablesLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View className="flex flex-col items-start gap-2 justify-center mb-8">
              <Text>Chọn Số bàn</Text>
              <View className="border border-gray-300 rounded-md bg-white w-96">
                <Picker
                  selectedValue={selectedTable}
                  onValueChange={(itemValue) => setSelectedTable(itemValue)}
                >
                  {tables?.results.map((table) => (
                    <Picker.Item
                      key={table.id}
                      label={`Bàn số ${table.tableNumber}`}
                      value={table}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
        </>
      )}
      <Button
        title={isPending ? "Đang xử lý" : "Đăng nhập"}
        onPress={handleLogin}
        disabled={!selectedRestaurant || !selectedTable || isPending}
      />
    </SafeAreaView>
  );
}
