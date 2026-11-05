import { Property } from "@/types";
import { formatPrice } from "@/utils/format";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { cardShadow } from "./shadows";

export const FEATURED_CARD_HEIGHT = 280;

type Props = {
  property: Property;
  index: number;
  /** Horizontal scroll offset of the carousel, drives the scale/fade effect. */
  scrollX: SharedValue<number>;
  /** Card width + gap: the distance between two snap points. */
  snap: number;
  width: number;
  onPress?: (property: Property) => void;
  onFavoritePress?: (property: Property) => void;
};

export default function FeaturedCard({
  property,
  index,
  scrollX,
  snap,
  width,
  onPress,
  onFavoritePress,
}: Props) {
  // Cards shrink and fade slightly as they move away from the centre/start
  const animatedStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * snap, index * snap, (index + 1) * snap];
    return {
      opacity: interpolate(scrollX.value, input, [0.75, 1, 0.75], "clamp"),
      transform: [
        { scale: interpolate(scrollX.value, input, [0.92, 1, 0.92], "clamp") },
      ],
    };
  });

  return (
    <Animated.View
      style={[{ width, height: FEATURED_CARD_HEIGHT }, animatedStyle]}
    >
      <Pressable
        onPress={() => onPress?.(property)}
        className="flex-1 rounded-3xl overflow-hidden bg-gray-200 active:opacity-90"
        style={cardShadow}
      >
        <Image
          source={{ uri: property.images?.[0] }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Top row */}
        <View className="flex-row items-center justify-between p-3">
          <View className="flex-row items-center bg-amber-400 px-3 py-1.5 rounded-full">
            <MaterialIcons name="star" size={14} color="#78350F" />
            <Text className="text-amber-900 text-xs font-bold ml-1">
              Featured
            </Text>
          </View>

          <Pressable
            onPress={() => onFavoritePress?.(property)}
            className="w-10 h-10 rounded-full bg-white/90 items-center justify-center"
          >
            <MaterialIcons name="favorite-border" size={22} color="#EF4444" />
          </Pressable>
        </View>

        {/* Sold overlay */}
        {property.is_sold && (
          <View
            pointerEvents="none"
            style={StyleSheet.absoluteFill}
            className="bg-black/50 items-center justify-center"
          >
            <View className="bg-red-500 px-5 py-2 rounded-full">
              <Text className="text-white font-bold tracking-widest">SOLD</Text>
            </View>
          </View>
        )}

        {/* Info panel */}
        <View className="absolute bottom-3 left-3 right-3 rounded-2xl p-3 bg-black/55">
          <Text className="text-white text-lg font-bold" numberOfLines={1}>
            {property.title}
          </Text>

          <View className="flex-row items-center mt-0.5">
            <MaterialIcons name="location-on" size={14} color="#CBD5E1" />
            <Text
              className="flex-1 text-slate-300 text-xs ml-1"
              numberOfLines={1}
            >
              {property.address}, {property.city}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-white text-base font-bold">
              {formatPrice(property.price)}
            </Text>

            <View className="flex-row items-center">
              <MaterialIcons name="bed" size={16} color="#E2E8F0" />
              <Text className="text-slate-200 text-xs font-medium ml-1 mr-3">
                {property.bedrooms}
              </Text>
              <MaterialIcons name="bathtub" size={16} color="#E2E8F0" />
              <Text className="text-slate-200 text-xs font-medium ml-1">
                {property.bathrooms}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
