import { SignInFlow } from "@/hooks/useSignInFlow";
import { Link } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import AuthInput from "./AuthInput";
import AuthLayout from "./AuthLayout";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

type Props = { flow: SignInFlow };

export default function CredentialsStep({ flow }: Props) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    formError,
    isLoading,
    signInWithPassword,
  } = flow;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue exploring properties."
      footer={
        <View className="flex-row">
          <Text className="text-gray-500">Don&rsquo;t have an account? </Text>
          <Link href="/sign-up">
            <Text className="text-blue-600 font-semibold">Create Account</Text>
          </Link>
        </View>
      }
    >
      <ErrorMessage message={formError} />

      <AuthInput
        icon={Mail}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
      />

      <AuthInput
        icon={Lock}
        isPassword
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        textContentType="password"
        error={errors.fields?.password?.message}
      />

      <View className="mt-2">
        <Button
          label="Sign In"
          onPress={signInWithPassword}
          loading={isLoading}
        />
      </View>
    </AuthLayout>
  );
}
