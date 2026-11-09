import { softShadow } from "@/components/home/shadows";
import MenuRow from "@/components/profile/MenuRow";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useProfilePhoto } from "@/hooks/useProfilePhoto";
import { useUserStore } from "@/store/userStore";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Calendar, Lock, LogOut, User } from "lucide-react-native";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const isAdmin = useUserStore((state) => state.isAdmin);
  const { openMenu, uploading } = useProfilePhoto();

  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Your name";

  const memberSince = user?.createdAt?.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const confirmLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            // No manual navigation: the route guard in app/_layout.tsx sends
            // signed-out users to the auth screens automatically.
            await signOut();
            useUserStore.setState({ isAdmin: false });
          } catch {
            Alert.alert("Error", "Unable to log out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-4">
          <Text className="text-3xl font-bold text-gray-900">Profile</Text>
        </View>

        <ProfileHeader
          imageUrl={user?.imageUrl}
          name={name}
          email={user?.primaryEmailAddress?.emailAddress}
          isAdmin={isAdmin}
          uploading={uploading}
          onChangePhoto={openMenu}
        />

        {/* Account */}
        <View className="px-6 mt-8">
          <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 ml-1">
            Account
          </Text>

          <View
            className="bg-white rounded-3xl overflow-hidden"
            style={softShadow}
          >
            <MenuRow
              icon={User}
              label="Edit profile"
              description="Update your name and photo"
              onPress={() => router.push("/edit-profile")}
            />
            <View className="h-px bg-gray-100 ml-16" />
            <MenuRow
              icon={Lock}
              label="Change password"
              description="Keep your account secure"
              onPress={() => router.push("/change-password")}
            />
          </View>

          {memberSince ? (
            <View className="flex-row items-center mt-4 ml-1">
              <Calendar size={14} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm ml-2">
                Member since {memberSince}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Logout */}
        <View className="px-6 mt-8">
          <TouchableOpacity
            onPress={confirmLogout}
            activeOpacity={0.8}
            className="flex-row items-center justify-center gap-3 bg-red-50 border border-red-200 rounded-2xl py-4"
          >
            <LogOut size={20} color="#DC2626" />
            <Text className="text-red-600 font-semibold text-base">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
