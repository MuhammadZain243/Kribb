import { softShadow } from "@/components/home/shadows";
import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  title: string;
  children: ReactNode;
  /** Entrance delay in ms, to stagger several sections. */
  delay?: number;
};

export default function SettingsSection({ title, children, delay = 0 }: Props) {
  const items = React.Children.toArray(children);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(16)}
      className="px-5 mt-7"
    >
      <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 ml-2">
        {title}
      </Text>

      <View className="bg-white rounded-3xl overflow-hidden" style={softShadow}>
        {items.map((child, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <View className="h-px bg-gray-100" style={{ marginLeft: 76 }} />
            )}
            {child}
          </React.Fragment>
        ))}
      </View>
    </Animated.View>
  );
}
