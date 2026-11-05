import { Property } from "@/types";
import React, { useCallback } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
  FadeInDown,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import FeaturedCard from "./FeaturedCard";
import SectionHeader from "./SectionHeader";

const GAP = 16;
const SIDE_PADDING = 20;
const CARD_WIDTH_RATIO = 0.78;

type Props = {
  properties: Property[];
  onSeeAll?: () => void;
  onPropertyPress?: (property: Property) => void;
};

function PaginationDot({
  index,
  scrollX,
  snap,
}: {
  index: number;
  scrollX: SharedValue<number>;
  snap: number;
}) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * snap, index * snap, (index + 1) * snap];
    return {
      width: interpolate(scrollX.value, input, [8, 22, 8], "clamp"),
      opacity: interpolate(scrollX.value, input, [0.35, 1, 0.35], "clamp"),
    };
  });

  return (
    <Animated.View
      style={[
        { height: 8, borderRadius: 4, backgroundColor: "#2563EB" },
        style,
      ]}
    />
  );
}

export default function FeaturedSection({
  properties,
  onSeeAll,
  onPropertyPress,
}: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.round(width * CARD_WIDTH_RATIO);
  const snap = cardWidth + GAP;

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const renderItem = useCallback(
    ({ item, index }: { item: Property; index: number }) => (
      <FeaturedCard
        property={item}
        index={index}
        scrollX={scrollX}
        snap={snap}
        width={cardWidth}
        onPress={onPropertyPress}
      />
    ),
    [scrollX, snap, cardWidth, onPropertyPress],
  );

  // Nothing featured yet: render nothing instead of an empty section
  if (properties.length === 0) return null;

  return (
    <Animated.View entering={FadeInDown.duration(500)}>
      <SectionHeader
        title="Featured"
        subtitle="Handpicked homes for you"
        actionLabel="See all"
        onActionPress={onSeeAll}
      />

      <Animated.FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snap}
        decelerationRate="fast"
        disableIntervalMomentum
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
      />

      {/* Pagination dots */}
      {properties.length > 1 && (
        <View className="flex-row items-center justify-center gap-1.5 mt-4">
          {properties.map((property, index) => (
            <PaginationDot
              key={property.id}
              index={index}
              scrollX={scrollX}
              snap={snap}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
}
