import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({ title, subtitle }: Props) {
  const router = useRouter();

  return (
    <View className="flex-row items-center px-5 pt-3 pb-3">
      <Pressable
        onPress={() => router.back()}
        hitSlop={8}
        className="w-11 h-11 rounded-full bg-white items-center justify-center active:opacity-70"
        style={{
          elevation: 2,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ChevronLeft size={22} color="#111827" />
      </Pressable>

      <View className="ml-4 flex-1">
        <Text className="text-gray-900 text-xl font-bold" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-gray-500 text-sm" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
