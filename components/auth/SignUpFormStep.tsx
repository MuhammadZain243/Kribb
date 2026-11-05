import { SignUpFlow } from "@/hooks/useSignUpFlow";
import { Link } from "expo-router";
import { Lock, Mail, User } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import AuthInput from "./AuthInput";
import AuthLayout from "./AuthLayout";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

type Props = { flow: SignUpFlow };

export default function SignUpFormStep({ flow }: Props) {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    formError,
    isLoading,
    signUpWithPassword,
  } = flow;

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Find your dream house today."
      footer={
        <View className="flex-row">
          <Text className="text-gray-500">Already have an account? </Text>
          <Link href="/sign-in">
            <Text className="text-blue-600 font-semibold">Sign in</Text>
          </Link>
        </View>
      }
    >
      <ErrorMessage message={formError} />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <AuthInput
            icon={User}
            placeholder="First name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            textContentType="givenName"
          />
        </View>
        <View className="flex-1">
          <AuthInput
            icon={User}
            placeholder="Last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            textContentType="familyName"
          />
        </View>
      </View>

      <AuthInput
        icon={Mail}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        error={errors.fields?.emailAddress?.message}
      />

      <AuthInput
        icon={Lock}
        isPassword
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        textContentType="newPassword"
        error={errors.fields?.password?.message}
      />

      <View className="mt-2">
        <Button
          label="Sign Up"
          onPress={signUpWithPassword}
          loading={isLoading}
        />
      </View>

      {/* required by Clerk's bot protection */}
      <View nativeID="clerk-captcha" />
    </AuthLayout>
  );
}
