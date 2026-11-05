import { Property } from "@/types";
import { formatNumber, formatPrice } from "@/utils/format";
import { MaterialIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { cardShadow } from "./shadows";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

type Props = {
  property: Property;
  index?: number;
  onPress?: (property: Property) => void;
  onFavoritePress?: (property: Property) => void;
};

function Spec({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View className="flex-row items-center">
      <MaterialIcons name={icon} size={18} color="#64748B" />
      <Text className="text-gray-700 text-sm font-medium ml-1.5">{label}</Text>
    </View>
  );
}

function PropertyCard({
  property,
  index = 0,
  onPress,
  onFavoritePress,
}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .springify()
        .damping(16)}
      className="px-5 mb-4"
    >
      <Pressable
        onPress={() => onPress?.(property)}
        className="bg-white rounded-3xl overflow-hidden active:opacity-90"
        style={cardShadow}
      >
        {/* Image */}
        <View>
          <Image
            source={{ uri: property.images?.[0] }}
            className="w-full h-52 bg-gray-200"
            resizeMode="cover"
          />

          <View className="absolute top-3 left-3 bg-white/90 px-3 py-1.5 rounded-full">
            <Text className="text-gray-900 text-xs font-semibold capitalize">
              {property.type}
            </Text>
          </View>

          <Pressable
            onPress={() => onFavoritePress?.(property)}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 items-center justify-center"
          >
            <MaterialIcons name="favorite-border" size={22} color="#EF4444" />
          </Pressable>

          {property.is_sold && (
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
              {property.title}
            </Text>
            <Text className="text-blue-600 text-lg font-bold">
              {formatPrice(property.price)}
            </Text>
          </View>

          <View className="flex-row items-center mt-1">
            <MaterialIcons name="location-on" size={16} color="#94A3B8" />
            <Text
              className="flex-1 text-gray-500 text-sm ml-1"
              numberOfLines={1}
            >
              {property.address}, {property.city}
            </Text>
          </View>

          <View className="h-px bg-gray-100 my-3" />

          <View className="flex-row items-center justify-between">
            <Spec icon="bed" label={`${property.bedrooms} Beds`} />
            <Spec icon="bathtub" label={`${property.bathrooms} Baths`} />
            <Spec
              icon="square-foot"
              label={`${formatNumber(property.area_sqft)} sqft`}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default memo(PropertyCard);
