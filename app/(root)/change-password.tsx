import AuthInput from "@/components/auth/AuthInput";
import Button from "@/components/auth/Button";
import ErrorMessage from "@/components/auth/ErrorMessage";
import FormFooter from "@/components/profile/FormFooter";
import PasswordStrength from "@/components/profile/PasswordStrength";
import ScreenHeader from "@/components/profile/ScreenHeader";
import { useChangePassword } from "@/hooks/useChangePassword";
import { useRouter } from "expo-router";
import { Check, Info, Lock, ShieldCheck } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [done, setDone] = useState(false);
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
    canSubmit,
    submit,
    passwordEnabled,
  } = useChangePassword();

  const onSubmit = async () => {
    if (await submit()) setDone(true);
  };

  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === newPassword;

  /* ------------------------------ success ------------------------------ */
  if (done) {
    return (
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-8">
          <Animated.View
            entering={ZoomIn.springify().damping(12)}
            className="w-24 h-24 rounded-full bg-green-100 items-center justify-center"
          >
            <View className="w-16 h-16 rounded-full bg-green-500 items-center justify-center">
              <Check size={34} color="#FFFFFF" strokeWidth={3} />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).springify().damping(16)}
            className="items-center w-full"
          >
            <Text className="text-gray-900 text-2xl font-bold mt-8 text-center">
              Password updated
            </Text>
            <Text className="text-gray-500 text-base text-center mt-2 leading-6">
              {signOutOthers
                ? "Your password was changed and your other devices were signed out."
                : "Your password was changed successfully."}
            </Text>

            <View className="w-full mt-8">
              <Button label="Done" onPress={() => router.back()} />
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  /* ------------------------------- form -------------------------------- */
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <ScreenHeader
        title="Change password"
        subtitle="Keep your account secure"
      />

      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
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
            <>
              <Animated.View
                entering={FadeInDown.duration(400).springify().damping(16)}
                className="flex-row items-center bg-violet-50 rounded-2xl p-4 mb-4"
              >
                <View className="w-11 h-11 rounded-2xl bg-white items-center justify-center">
                  <ShieldCheck size={22} color="#7C3AED" />
                </View>
                <Text className="flex-1 ml-4 text-violet-900 leading-5">
                  Choose a strong password you don&rsquo;t use anywhere else.
                </Text>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(120).springify().damping(16)}
                className="bg-white rounded-3xl p-5"
              >
                <ErrorMessage message={formError} />

                <AuthInput
                  icon={Lock}
                  isPassword
                  label="Current password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  autoCapitalize="none"
                  textContentType="password"
                  error={fieldErrors.current}
                />

                <AuthInput
                  icon={Lock}
                  isPassword
                  label="New password"
                  placeholder="Create a new password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                  textContentType="newPassword"
                  error={fieldErrors.next}
                />

                <PasswordStrength password={newPassword} />

                <AuthInput
                  icon={Lock}
                  isPassword
                  label="Confirm new password"
                  placeholder="Repeat the new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                  textContentType="newPassword"
                  error={fieldErrors.confirm}
                  helper={passwordsMatch ? "Passwords match" : undefined}
                  helperTone="success"
                />

                <View className="h-px bg-gray-100 my-2" />

                <View className="flex-row items-center justify-between pt-3">
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
              </Animated.View>
            </>
          )}
        </ScrollView>

        {passwordEnabled && (
          <FormFooter>
            <Button
              label="Update password"
              onPress={onSubmit}
              loading={saving}
              disabled={!canSubmit}
            />
          </FormFooter>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
