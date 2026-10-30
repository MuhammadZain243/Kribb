import { useAuth, useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = fetchStatus === "fetching";

  const onSignInPress = async () => {};

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold text-gray-800 mb-2">Sign In</Text>

        <Text className="text-gray-500 mb-6">
          Welcome back! Please sign in.
        </Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Email address"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="w-full rounded-xl py-4 mb-4 bg-blue-500 items-center"
          onPress={onSignInPress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500">Want to create a new account? </Text>
          <Link href="/sign-up">
            <Text className="text-blue-500 font-semibold">Sign up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
