import { primaryShadow } from "@/components/home/shadows";
import { Calendar, ShieldCheck, User } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import ProfileAvatar from "./ProfileAvatar";

type Props = {
  imageUrl?: string;
  name: string;
  email?: string;
  isAdmin?: boolean;
  memberSince?: string;
  uploading?: boolean;
  onChangePhoto: () => void;
};

export default function ProfileHeader({
  imageUrl,
  name,
  email,
  isAdmin,
  memberSince,
  uploading,
  onChangePhoto,
}: Props) {
  const RoleIcon = isAdmin ? ShieldCheck : User;

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify().damping(16)}
      className="mx-5 mt-4 bg-blue-600 overflow-hidden items-center px-6 pt-8 pb-6"
      style={[{ borderRadius: 32 }, primaryShadow]}
    >
      {/* decorative circles */}
      <View
        pointerEvents="none"
        className="absolute -top-16 -right-12 w-48 h-48 rounded-full bg-white/10"
      />
      <View
        pointerEvents="none"
        className="absolute -bottom-20 -left-10 w-44 h-44 rounded-full bg-white/10"
      />

      <ProfileAvatar
        ring
        imageUrl={imageUrl}
        loading={uploading}
        onPress={onChangePhoto}
      />

      <Text
        className="text-white text-2xl font-bold mt-4 text-center"
        numberOfLines={1}
      >
        {name}
      </Text>

      {email ? (
        <Text className="text-white/80 text-base mt-1" numberOfLines={1}>
          {email}
        </Text>
      ) : null}

      <View className="flex-row flex-wrap justify-center gap-2 mt-4">
        <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full">
          <RoleIcon size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-semibold ml-1.5">
            {isAdmin ? "Admin" : "Member"}
          </Text>
        </View>

        {memberSince ? (
          <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full">
            <Calendar size={14} color="#FFFFFF" />
            <Text className="text-white text-xs font-semibold ml-1.5">
              Since {memberSince}
            </Text>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}
