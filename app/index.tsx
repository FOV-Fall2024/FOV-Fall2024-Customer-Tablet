import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants, getTables } from "@/apis";
import { Link } from "expo-router";

export default function Login() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
    null
  );
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showTables, setShowTables] = useState(false);

  const { data: restaurants, isLoading: restaurantsLoading } = useQuery({
    queryKey: ["getRestaurants"],
    queryFn: getRestaurants,
  });

  const { data: tables, isPending: tablesLoading } = useQuery({
    queryKey: ["getTables", selectedRestaurant],
    queryFn: () => getTables("1"),
    enabled: !!selectedRestaurant,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (tables && tables.length > 0 && !selectedTable) {
      setSelectedTable(tables[0]?.id);
    }
  }, [tables]);

  useEffect(() => {
    setShowTables(!!selectedRestaurant);
  }, [selectedRestaurant]);

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
      setShowTables(true);
    }
  };

  const handleLogin = () => {
    // Implement login logic here
    console.log(
      "Logging in with restaurant:",
      selectedRestaurant,
      "and table:",
      selectedTable
    );
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
            {restaurants?.map((restaurant: any) => (
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
                  {tables?.map((table: any) => (
                    <Picker.Item
                      key={table.id}
                      label={`Bàn số ${table.tableNumber}`}
                      value={table.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
        </>
      )}
      <Button
        title="Đăng nhập"
        onPress={handleLogin}
        disabled={!selectedRestaurant || !selectedTable}
      />
      <Link href="/home" className="mt-4 text-blue-500">
        Đến trang chủ
      </Link>
      <Link href="/food/1" className="mt-4 text-blue-500">
        detail
      </Link>
    </SafeAreaView>
  );
}
