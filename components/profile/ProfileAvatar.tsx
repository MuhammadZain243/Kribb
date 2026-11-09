import { Camera } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

type Props = {
  imageUrl?: string;
  size?: number;
  loading?: boolean;
  /** When provided, shows the camera badge and makes the avatar tappable. */
  onPress?: () => void;
};

export default function ProfileAvatar({
  imageUrl,
  size = 112,
  loading = false,
  onPress,
}: Props) {
  const radius = size / 2;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress || loading}
      style={{ width: size, height: size }}
      accessibilityRole={onPress ? "button" : "image"}
      accessibilityLabel="Profile photo"
    >
      <Image
        source={{ uri: imageUrl }}
        className="bg-gray-200"
        style={{ width: size, height: size, borderRadius: radius }}
      />

      {loading && (
        <View
          className="bg-black/40 items-center justify-center"
          style={{ ...StyleSheet.absoluteFillObject, borderRadius: radius }}
        >
          <ActivityIndicator color="#FFFFFF" />
        </View>
      )}

      {onPress && !loading && (
        <View
          className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-blue-600 items-center justify-center"
          style={{ borderWidth: 3, borderColor: "#FFFFFF" }}
        >
          <Camera size={16} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}
