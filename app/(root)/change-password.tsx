import AuthInput from "@/components/auth/AuthInput";
import Button from "@/components/auth/Button";
import ErrorMessage from "@/components/auth/ErrorMessage";
import ScreenHeader from "@/components/profile/ScreenHeader";
import { useChangePassword } from "@/hooks/useChangePassword";
import { useRouter } from "expo-router";
import { Info, Lock } from "lucide-react-native";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    signOutOthers,
    setSignOutOthers,
    fieldErrors,
    formError,
    saving,
    submit,
    passwordEnabled,
  } = useChangePassword();

  const onSubmit = async () => {
    if (await submit()) {
      Alert.alert("Password updated", "Your password has been changed.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScreenHeader title="Change password" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!passwordEnabled ? (
            <View className="flex-row items-start bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <Info size={18} color="#2563EB" style={{ marginTop: 2 }} />
              <Text className="flex-1 ml-3 text-blue-800 leading-5">
                Your account doesn&rsquo;t use a password, so there&rsquo;s
                nothing to change here.
              </Text>
            </View>
          ) : (
            <View className="bg-white rounded-3xl p-5">
              <Text className="text-gray-500 mb-5 leading-5">
                Enter your current password, then choose a new one of at least 8
                characters.
              </Text>

              <ErrorMessage message={formError} />

              <AuthInput
                icon={Lock}
                isPassword
                placeholder="Current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                autoCapitalize="none"
                textContentType="password"
                error={fieldErrors.current}
              />

              <AuthInput
                icon={Lock}
                isPassword
                placeholder="New password"
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
                textContentType="newPassword"
                error={fieldErrors.next}
              />

              <AuthInput
                icon={Lock}
                isPassword
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                textContentType="newPassword"
                error={fieldErrors.confirm}
              />

              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-1 mr-4">
                  <Text className="text-gray-900 font-semibold">
                    Sign out of other devices
                  </Text>
                  <Text className="text-gray-500 text-sm mt-0.5">
                    Recommended after changing your password.
                  </Text>
                </View>
                <Switch
                  value={signOutOthers}
                  onValueChange={setSignOutOthers}
                  trackColor={{ true: "#2563EB" }}
                />
              </View>

              <Button
                label="Update password"
                onPress={onSubmit}
                loading={saving}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
