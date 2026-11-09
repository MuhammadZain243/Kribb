import { ChevronRight, type LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Tone = "blue" | "violet" | "red";

const TONES: Record<Tone, { tile: string; color: string }> = {
  blue: { tile: "bg-blue-50", color: "#2563EB" },
  violet: { tile: "bg-violet-50", color: "#7C3AED" },
  red: { tile: "bg-red-50", color: "#DC2626" },
};

type Props = {
  icon: LucideIcon;
  label: string;
  description?: string;
  onPress: () => void;
  tone?: Tone;
  destructive?: boolean;
  showChevron?: boolean;
};

export default function MenuRow({
  icon: Icon,
  label,
  description,
  onPress,
  tone = "blue",
  destructive = false,
  showChevron = true,
}: Props) {
  const { tile, color } = TONES[destructive ? "red" : tone];

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-4 active:bg-gray-50"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        className={`w-11 h-11 rounded-2xl items-center justify-center ${tile}`}
      >
        <Icon size={20} color={color} />
      </View>

      <View className="flex-1 ml-4">
        <Text
          className={`font-semibold text-base ${
            destructive ? "text-red-600" : "text-gray-900"
          }`}
        >
          {label}
        </Text>
        {description ? (
          <Text className="text-gray-500 text-sm mt-0.5">{description}</Text>
        ) : null}
      </View>

      {showChevron ? <ChevronRight size={20} color="#9CA3AF" /> : null}
    </Pressable>
  );
}
