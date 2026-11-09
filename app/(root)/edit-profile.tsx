import AuthInput from "@/components/auth/AuthInput";
import Button from "@/components/auth/Button";
import ErrorMessage from "@/components/auth/ErrorMessage";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ScreenHeader from "@/components/profile/ScreenHeader";
import { useEditProfile } from "@/hooks/useEditProfile";
import { useProfilePhoto } from "@/hooks/useProfilePhoto";
import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Mail, User } from "lucide-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { openMenu, uploading } = useProfilePhoto();
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    saving,
    error,
    canSave,
    save,
  } = useEditProfile();

  const onSave = async () => {
    if (await save()) router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScreenHeader title="Edit profile" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mt-2 mb-6">
            <ProfileAvatar
              imageUrl={user?.imageUrl}
              loading={uploading}
              onPress={openMenu}
            />
            <Text className="text-blue-600 font-semibold mt-3">
              Change photo
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-5">
            <ErrorMessage message={error} />

            <AuthInput
              icon={User}
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              textContentType="givenName"
            />

            <AuthInput
              icon={User}
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              textContentType="familyName"
            />

            {/* Read-only: changing the email needs re-verification */}
            <View className="opacity-60">
              <AuthInput
                icon={Mail}
                value={user?.primaryEmailAddress?.emailAddress ?? ""}
                editable={false}
              />
            </View>
            <Text className="text-gray-400 text-xs -mt-2 mb-5 ml-1">
              Your email can&rsquo;t be changed here.
            </Text>

            <Button
              label="Save changes"
              onPress={onSave}
              loading={saving}
              disabled={!canSave}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
