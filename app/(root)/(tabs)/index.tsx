import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);

    const { data: featuredData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    const { data: recommendedData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", false)
      .order("created_at", { ascending: false });

    setFeatured(featuredData as Property[]);
    setRecommended(recommendedData as Property[]);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
              <View className="flex-row items-center flex-1">
                <Image
                  source={{ uri: user?.imageUrl }}
                  className="w-12 h-12 rounded-full bg-gray-200"
                />
                <View className="ml-3 flex-1">
                  <Text className="text-gray-500 text-sm">
                    {getGreeting()} 👋
                  </Text>
                  <Text
                    className="text-gray-900 text-lg font-bold"
                    numberOfLines={1}
                  >
                    {user?.firstName ?? "Guest"}
                  </Text>
                </View>
              </View>

              <Image
                source={require("@/assets/images/kribb.png")}
                style={{ width: 80, height: 32 }}
                resizeMode="contain"
              />
            </View>

            {/* Search bar */}
            <View className="flex-row items-center px-5 mt-4">
              <Pressable
                onPress={() => router.push("/(root)/(tabs)/search")}
                className="flex-1 flex-row items-center bg-white h-14 px-4 rounded-2xl border border-gray-100 active:opacity-80"
                style={{
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                }}
              >
                <MaterialIcons name="search" size={24} color="#94A3B8" />
                <Text className="flex-1 ml-3 text-gray-400 text-base">
                  Search city, area or property
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/(root)/(tabs)/search")}
                className="w-14 h-14 ml-3 rounded-2xl bg-blue-600 items-center justify-center active:opacity-80"
                style={{
                  elevation: 4,
                  shadowColor: "#2563EB",
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                }}
              >
                <MaterialIcons name="tune" size={24} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Featured properties */}

            {/* Recommended header */}
            <View className="flex-row items-center justify-between px-5 mt-8 mb-4">
              <View>
                <Text className="text-gray-900 text-xl font-bold">
                  Recommended
                </Text>
                <Text className="text-gray-500 text-sm mt-0.5">
                  Picked just for you
                </Text>
              </View>

              <Pressable
                onPress={() => router.push("/(root)/(tabs)/search")}
                className="flex-row items-center active:opacity-60"
              >
                <Text className="text-blue-600 font-semibold">See all</Text>
                <MaterialIcons name="chevron-right" size={20} color="#2563EB" />
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 80)
              .springify()
              .damping(16)}
            className="px-5 mb-4"
          >
            <Pressable
              className="bg-white rounded-3xl overflow-hidden active:opacity-90"
              style={{
                elevation: 3,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 3 },
              }}
            >
              {/* Image */}
              <View>
                <Image
                  source={{ uri: item.images?.[0] }}
                  className="w-full h-52 bg-gray-200"
                  resizeMode="cover"
                />

                {/* Type badge */}
                <View className="absolute top-3 left-3 bg-white/90 px-3 py-1.5 rounded-full">
                  <Text className="text-gray-900 text-xs font-semibold capitalize">
                    {item.type}
                  </Text>
                </View>

                {/* Favorite */}
                <Pressable className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 items-center justify-center">
                  <MaterialIcons
                    name="favorite-border"
                    size={22}
                    color="#EF4444"
                  />
                </Pressable>

                {/* Sold overlay */}
                {item.is_sold && (
                  <View className="absolute inset-0 bg-black/50 items-center justify-center">
                    <View className="bg-red-500 px-5 py-2 rounded-full">
                      <Text className="text-white font-bold tracking-widest">
                        SOLD
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Details */}
              <View className="p-4">
                <View className="flex-row items-start justify-between">
                  <Text
                    className="flex-1 text-gray-900 text-lg font-bold mr-3"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text className="text-blue-600 text-lg font-bold">
                    Rs {Number(item.price).toLocaleString()}
                  </Text>
                </View>

                <View className="flex-row items-center mt-1">
                  <MaterialIcons name="location-on" size={16} color="#94A3B8" />
                  <Text
                    className="flex-1 text-gray-500 text-sm ml-1"
                    numberOfLines={1}
                  >
                    {item.address}, {item.city}
                  </Text>
                </View>

                {/* Divider */}
                <View className="h-px bg-gray-100 my-3" />

                {/* Specs */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <MaterialIcons name="bed" size={18} color="#64748B" />
                    <Text className="text-gray-700 text-sm font-medium ml-1.5">
                      {item.bedrooms} Beds
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <MaterialIcons name="bathtub" size={18} color="#64748B" />
                    <Text className="text-gray-700 text-sm font-medium ml-1.5">
                      {item.bathrooms} Baths
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <MaterialIcons
                      name="square-foot"
                      size={18}
                      color="#64748B"
                    />
                    <Text className="text-gray-700 text-sm font-medium ml-1.5">
                      {Number(item.area_sqft).toLocaleString()} sqft
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        )}
        ListEmptyComponent={
          !loading ? (
            <Animated.View
              entering={FadeInDown.duration(500).springify().damping(16)}
              className="items-center justify-center px-8 mt-16"
            >
              {/* Icon with layered circles */}
              <View className="w-40 h-40 rounded-full bg-blue-50 items-center justify-center">
                <View className="w-28 h-28 rounded-full bg-blue-100 items-center justify-center">
                  <View className="w-16 h-16 rounded-full bg-blue-600 items-center justify-center shadow-lg">
                    <MaterialIcons name="home-work" size={32} color="#FFFFFF" />
                  </View>
                </View>
              </View>

              {/* Text */}
              <Text className="text-gray-900 text-xl font-bold mt-8 text-center">
                No properties found
              </Text>
              <Text className="text-gray-500 text-base text-center mt-2 leading-6">
                There are no listings available right now. Pull down to refresh
                or check back a little later.
              </Text>

              {/* Refresh button */}
              <Pressable
                onPress={fetchProperties}
                className="flex-row items-center bg-blue-600 px-6 py-3 rounded-full mt-6 active:opacity-80"
              >
                <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
                <Text className="text-white font-semibold ml-2">Refresh</Text>
              </Pressable>
            </Animated.View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
