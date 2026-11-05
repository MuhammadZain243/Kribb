import EmptyState from "@/components/home/EmptyState";
import HomeHeader from "@/components/home/HomeHeader";
import HomeSearchBar from "@/components/home/HomeSearchBar";
import PropertyCard from "@/components/home/PropertyCard";
import SectionHeader from "@/components/home/SectionHeader";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { recommended, loading, refreshing, refresh } = useProperties();

  const goToSearch = useCallback(
    () => router.push("/(root)/(tabs)/search"),
    [router],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Property; index: number }) => (
      <PropertyCard property={item} index={index} />
    ),
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={refresh}
        ListHeaderComponent={
          <>
            {/* Home Header */}
            <HomeHeader firstName={user?.firstName} imageUrl={user?.imageUrl} />

            {/* Home Search Bar */}
            <HomeSearchBar onPress={goToSearch} />

            {/* Featured properties */}

            {/* Recommended properties */}
            <SectionHeader
              title="Recommended"
              subtitle="Picked just for you"
              actionLabel="See all"
              onActionPress={goToSearch}
            />
          </>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator className="mt-16" size="large" color="#2563EB" />
          ) : (
            <EmptyState onAction={refresh} />
          )
        }
      />
    </SafeAreaView>
  );
}
