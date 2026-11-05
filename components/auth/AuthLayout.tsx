import React, { ReactNode } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* decorative background blobs */}
          <View
            pointerEvents="none"
            className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-blue-50"
          />
          <View
            pointerEvents="none"
            className="absolute top-52 -left-28 w-56 h-56 rounded-full bg-blue-50/60"
          />

          <Animated.View
            entering={FadeInDown.duration(500).springify().damping(18)}
            className="flex-1 justify-center px-6 py-10"
          >
            <Image
              source={require("@/assets/images/kribb.png")}
              className="w-32 h-14 mb-10"
              resizeMode="contain"
            />

            <Text className="text-3xl font-bold text-gray-900">{title}</Text>
            {subtitle ? (
              <Text className="text-gray-500 text-base leading-6 mt-2 mb-8">
                {subtitle}
              </Text>
            ) : (
              <View className="mb-8" />
            )}

            {children}
          </Animated.View>

          {footer ? <View className="items-center pb-6">{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
