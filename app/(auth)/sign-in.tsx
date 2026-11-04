import OTPInput from "@/components/OTPInput";
import { useAuth, useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
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

type SecondFactorStrategy = "phone_code" | "totp" | "backup_code";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [secondFactorStrategy, setSecondFactorStrategy] =
    useState<SecondFactorStrategy | null>(null);

  const isLoading = fetchStatus === "fetching";

  if (signIn.status === "complete" || isSignedIn) {
    return null;
  }

  const finalizeSignIn = async () => {
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  const onVerifyEmailPress = async () => {
    await signIn.mfa.verifyEmailCode({ code });
    await finalizeSignIn();
  };

  const onVerifySecondFactorPress = async () => {
    if (secondFactorStrategy === "phone_code") {
      await signIn.mfa.verifyPhoneCode({ code });
    } else if (secondFactorStrategy === "totp") {
      await signIn.mfa.verifyTOTP({ code });
    } else if (secondFactorStrategy === "backup_code") {
      await signIn.mfa.verifyBackupCode({ code });
    } else {
      return;
    }

    await finalizeSignIn();
  };

  const selectSecondFactor = async (strategy: SecondFactorStrategy) => {
    setSecondFactorStrategy(strategy);
    setCode("");

    if (strategy === "phone_code") {
      await signIn.mfa.sendPhoneCode();
    }
  };

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password: password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      const secondFactor = signIn.supportedSecondFactors.find(
        (factor) =>
          factor.strategy === "phone_code" ||
          factor.strategy === "totp" ||
          factor.strategy === "backup_code",
      );

      if (!secondFactor) {
        alert("No supported second-factor method is available.");
        return;
      }

      await selectSecondFactor(secondFactor.strategy);
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.log("Sign-in attempt not complete:", signIn);
    }

  };

  if (signIn.status === "needs_second_factor") {
    const supportedSecondFactors = signIn.supportedSecondFactors
      .map((factor) => factor.strategy)
      .filter(
        (strategy): strategy is SecondFactorStrategy =>
          strategy === "phone_code" ||
          strategy === "totp" ||
          strategy === "backup_code",
      );
    const selectedStrategy =
      secondFactorStrategy ?? supportedSecondFactors[0];
    const factorLabel =
      selectedStrategy === "phone_code"
        ? "the code sent to your phone"
        : selectedStrategy === "totp"
          ? "your authenticator app"
          : "your backup code";

    return (
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Verify your sign-in
        </Text>

        <Text className="text-gray-500 mb-6">
          Enter {factorLabel} to continue.
        </Text>

        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2">
            Choose a verification method
          </Text>
          {supportedSecondFactors.map((strategy) => {
            const label =
              strategy === "phone_code"
                ? "Text message"
                : strategy === "totp"
                  ? "Authenticator app"
                  : "Backup code";

            return (
              <TouchableOpacity
                key={strategy}
                onPress={() => selectSecondFactor(strategy)}
                disabled={isLoading}
                className={`rounded-xl border px-4 py-3 mb-2 ${
                  selectedStrategy === strategy
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <Text
                  className={
                    selectedStrategy === strategy
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  }
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedStrategy === "backup_code" ? (
          <TextInput
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
            placeholder="Enter your backup code"
            placeholderTextColor="#9CA3AF"
            value={code}
            onChangeText={setCode}
            autoCapitalize="none"
            autoCorrect={false}
          />
        ) : (
          <OTPInput code={code} setCode={setCode} />
        )}

        {errors.fields?.code && (
          <Text className="text-red-500 mb-2 ml-1">
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onVerifySecondFactorPress}
          disabled={isLoading}
          className="w-full rounded-xl py-4 mb-4 bg-blue-500 items-center"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold">Verify</Text>
          )}
        </TouchableOpacity>

        {selectedStrategy === "phone_code" && (
          <TouchableOpacity
            onPress={async () => {
              setCode("");
              await signIn.mfa.sendPhoneCode();
            }}
            disabled={isLoading}
          >
            <Text className="text-blue-500">Resend verification code</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (signIn.status === "needs_client_trust") {
    return (
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Verify your email
        </Text>

        <Text className="text-gray-500 mb-6">
          We sent a verification code to {email}. Please check your email and
          enter the code below to verify your email address.
        </Text>

        <OTPInput code={code} setCode={setCode} />

        {errors.fields?.code && (
          <Text className="text-red-500 mb-2 ml-1">
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onVerifyEmailPress}
          disabled={isLoading}
          className="w-full rounded-xl py-4 mb-4 bg-blue-500 items-center"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold">
              Verify Email
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            setCode("");
            await signIn.mfa.sendEmailCode();
          }}
        >
          <Text className="text-blue-500">Resend verification code</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

        <View className="w-full mb-4">
          <View className="relative justify-center">
            <TextInput
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12"
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-0 bottom-0 w-12 items-center justify-center"
              activeOpacity={0.7}
            >
              {showPassword ? (
                <EyeOff size={20} color="#9CA3AF" />
              ) : (
                <Eye size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>

          {errors.fields?.password && (
            <Text className="text-red-500 mt-1 ml-1">
              {errors.fields.password.message}
            </Text>
          )}
        </View>

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
          <Text className="text-gray-500">Don&rsquo;t have an account? </Text>
          <Link href="/sign-up">
            <Text className="text-blue-500 font-semibold">Create Account</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
