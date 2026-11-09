import type { ProfilePhoto } from "@/hooks/useProfilePhoto";
import { Images, Trash2, type LucideIcon } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type OptionProps = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

function Option({ icon: Icon, label, onPress, destructive }: OptionProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-3 active:opacity-70"
      accessibilityRole="button"
    >
      <View
        className={`w-11 h-11 rounded-2xl items-center justify-center ${
          destructive ? "bg-red-50" : "bg-blue-50"
        }`}
      >
        <Icon size={20} color={destructive ? "#DC2626" : "#2563EB"} />
      </View>
      <Text
        className={`ml-4 text-base font-semibold ${
          destructive ? "text-red-600" : "text-gray-900"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type Props = { photo: ProfilePhoto };

export default function PhotoActionSheet({ photo }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={photo.menuVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={photo.closeMenu}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <Animated.View
          entering={FadeIn.duration(200)}
          style={StyleSheet.absoluteFill}
          className="bg-black/40"
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={photo.closeMenu}
          />
        </Animated.View>

        {/* Sheet */}
        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          className="bg-white rounded-t-3xl px-5 pt-3"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View className="self-center w-10 h-1.5 rounded-full bg-gray-200 mb-4" />

          <Text className="text-gray-900 text-lg font-bold mb-2">
            Profile photo
          </Text>

          <Option
            icon={Images}
            label="Choose from library"
            onPress={photo.choosePhoto}
          />

          {photo.canRemove && (
            <Option
              icon={Trash2}
              label="Remove current photo"
              destructive
              onPress={photo.deletePhoto}
            />
          )}

          <Pressable
            onPress={photo.closeMenu}
            className="mt-3 h-14 rounded-2xl bg-gray-100 items-center justify-center active:opacity-80"
          >
            <Text className="text-gray-700 font-semibold text-base">
              Cancel
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}
