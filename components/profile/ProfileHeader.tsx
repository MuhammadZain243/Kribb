import { ShieldCheck } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import ProfileAvatar from "./ProfileAvatar";

type Props = {
  imageUrl?: string;
  name: string;
  email?: string;
  isAdmin?: boolean;
  uploading?: boolean;
  onChangePhoto: () => void;
};

export default function ProfileHeader({
  imageUrl,
  name,
  email,
  isAdmin,
  uploading,
  onChangePhoto,
}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify().damping(16)}
      className="items-center px-6 pt-6"
    >
      <ProfileAvatar
        imageUrl={imageUrl}
        loading={uploading}
        onPress={onChangePhoto}
      />

      <Text className="text-gray-900 text-2xl font-bold mt-4" numberOfLines={1}>
        {name}
      </Text>

      {email ? (
        <Text className="text-gray-500 text-base mt-1" numberOfLines={1}>
          {email}
        </Text>
      ) : null}

      {isAdmin ? (
        <View className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full mt-3">
          <ShieldCheck size={14} color="#2563EB" />
          <Text className="text-blue-700 text-xs font-semibold ml-1.5">
            Admin
          </Text>
        </View>
      ) : null}
    </Animated.View>
  );
}
