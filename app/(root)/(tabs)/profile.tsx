import { useClerk } from "@clerk/expo";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert("Error", "Unable to log out. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-gray-50 px-6 pt-16">
      <Text className="text-3xl font-bold text-gray-900 mb-2">Profile</Text>

      <Text className="text-gray-500 mb-8">Manage your account settings.</Text>

      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.8}
        className="flex-row items-center justify-center gap-3 bg-red-50 border border-red-200 rounded-xl py-4"
      >
        <LogOut size={20} color="#DC2626" />
        <Text className="text-red-600 font-semibold text-base">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
