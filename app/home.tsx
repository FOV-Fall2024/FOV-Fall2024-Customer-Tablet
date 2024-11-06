import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FoodList, Header, Order } from "@/components";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getCategory, getProducts } from "@/apis";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const {
    data: category,
    isPending,
    // error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
    refetchOnWindowFocus: false,
  });
  // console.log("error", error);

  useEffect(() => {
    refetch();
  }, [search]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["products", selectedCategory, search],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await getProducts(pageParam, selectedCategory, search);
      return {
        pageNumber: data?.pageNumber,
        totalNumberOfPages: data?.totalNumberOfPages,
        data: data?.results,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pageNumber;
      const totalPages = lastPage?.totalNumberOfPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });
  const products = data?.pages.flatMap((page) => page.data);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <GestureHandlerRootView className="flex-1">
        <Header search={search} setSearch={setSearch} reFetch={refetch} />

        {isPending ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View className="bg-white border-b border-gray-200">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                flexGrow: 1,
                justifyContent: "center",
                gap: 20,
              }}
              className="py-4"
            >
              <TouchableOpacity
                className={`px-4 py-2 mx-1 rounded-full ${
                  selectedCategory === "all" ? "bg-blue-500" : "bg-gray-200"
                }`}
                onPress={() => {
                  setSelectedCategory("all");
                  setSearch("");
                }}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedCategory === "all" ? "text-white" : "text-gray-800"
                  }`}
                >
                  Tất cả
                </Text>
              </TouchableOpacity>
              {category?.results.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`px-4 py-2 mx-1 rounded-full ${
                    selectedCategory === category.categoryName
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  }`}
                  onPress={() => {
                    setSelectedCategory(category.categoryName);
                    setSearch("");
                  }}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedCategory === category.categoryName
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {category.categoryName}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                className={`px-4 py-2 mx-1 rounded-full ${
                  selectedCategory === "combo" ? "bg-blue-500" : "bg-gray-200"
                }`}
                onPress={() => {
                  setSelectedCategory("combo");
                  setSearch("");
                }}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedCategory === "combo"
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  Combo
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        <View className="flex-1 flex-row">
          <FoodList
            isFetching={isFetching}
            products={products}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
          <Order />
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
