import MenuRow from "@/components/profile/MenuRow";
import PhotoActionSheet from "@/components/profile/PhotoActionSheet";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SettingsSection from "@/components/profile/SettingsSection";
import { useProfilePhoto } from "@/hooks/useProfilePhoto";
import { useUserStore } from "@/store/userStore";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Lock, LogOut, User } from "lucide-react-native";
import React from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const isAdmin = useUserStore((state) => state.isAdmin);
  const photo = useProfilePhoto();

  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Your name";

  const memberSince = user?.createdAt?.toLocaleDateString(undefined, {
    month: "short",
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
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
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
          memberSince={memberSince}
          uploading={photo.uploading}
          onChangePhoto={photo.openMenu}
        />

        <SettingsSection title="Account" delay={120}>
          <MenuRow
            icon={User}
            label="Edit profile"
            description="Update your name and photo"
            onPress={() => router.push("/edit-profile")}
          />
          <MenuRow
            icon={Lock}
            tone="violet"
            label="Change password"
            description="Keep your account secure"
            onPress={() => router.push("/change-password")}
          />
        </SettingsSection>

        <SettingsSection title="Session" delay={220}>
          <MenuRow
            icon={LogOut}
            destructive
            label="Log out"
            description="Sign out of this device"
            showChevron={false}
            onPress={confirmLogout}
          />
        </SettingsSection>
      </ScrollView>

      <PhotoActionSheet photo={photo} />
    </SafeAreaView>
  );
}
