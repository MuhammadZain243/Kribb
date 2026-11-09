import AuthInput from "@/components/auth/AuthInput";
import Button from "@/components/auth/Button";
import ErrorMessage from "@/components/auth/ErrorMessage";
import FormFooter from "@/components/profile/FormFooter";
import PhotoActionSheet from "@/components/profile/PhotoActionSheet";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ScreenHeader from "@/components/profile/ScreenHeader";
import { useEditProfile } from "@/hooks/useEditProfile";
import { useProfilePhoto } from "@/hooks/useProfilePhoto";
import { useUser } from "@clerk/expo";
import { usePreventRemove } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { Mail, User } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const { user } = useUser();
  const router = useRouter();
  const navigation = useNavigation();
  const photo = useProfilePhoto();
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    saving,
    error,
    canSave,
    dirty,
    save,
  } = useEditProfile();

  // Set right before leaving after a successful save, so we don't ask twice
  const skipPrompt = useRef(false);

  // Ask before discarding edits (covers the back button, swipe and hardware back)
  usePreventRemove(dirty, ({ data }) => {
    if (skipPrompt.current) {
      navigation.dispatch(data.action);
      return;
    }

    Alert.alert(
      "Discard changes?",
      "You have unsaved changes. If you leave now they'll be lost.",
      [
        { text: "Keep editing", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => navigation.dispatch(data.action),
        },
      ],
    );
  });

  const onSave = async () => {
    if (await save()) {
      skipPrompt.current = true;
      router.back();
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <ScreenHeader title="Edit profile" subtitle="Update how you appear" />

      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.duration(400).springify().damping(16)}
            className="items-center mt-2 mb-6"
          >
            <ProfileAvatar
              size={120}
              imageUrl={user?.imageUrl}
              loading={photo.uploading}
              onPress={photo.openMenu}
            />
            <Text className="text-blue-600 font-semibold mt-3">
              Change photo
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(120).springify().damping(16)}
            className="bg-white rounded-3xl p-5"
          >
            <ErrorMessage message={error} />

            <AuthInput
              icon={User}
              label="First name"
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              textContentType="givenName"
              returnKeyType="next"
            />

            <AuthInput
              icon={User}
              label="Last name"
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              textContentType="familyName"
              returnKeyType="done"
            />

            <AuthInput
              icon={Mail}
              label="Email"
              value={user?.primaryEmailAddress?.emailAddress ?? ""}
              editable={false}
              helper="Your email can't be changed here."
            />
          </Animated.View>
        </ScrollView>

        <FormFooter>
          {dirty ? (
            <View className="flex-row items-center justify-center mb-3">
              <View className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
              <Text className="text-amber-600 text-xs font-medium">
                You have unsaved changes
              </Text>
            </View>
          ) : null}

          <Button
            label="Save changes"
            onPress={onSave}
            loading={saving}
            disabled={!canSave}
          />
        </FormFooter>
      </KeyboardAvoidingView>

      <PhotoActionSheet photo={photo} />
    </SafeAreaView>
  );
}
