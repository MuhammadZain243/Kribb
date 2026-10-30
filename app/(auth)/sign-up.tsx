import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const OTP_LENGTH = 6;

function OTPInput({
  code,
  setCode,
}: {
  code: string;
  setCode: (value: string) => void;
}) {
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, "");

    if (!digit) {
      const newCode = code.split("");
      newCode[index] = "";
      setCode(newCode.join(""));
      return;
    }

    const newCode = code.split("");
    newCode[index] = digit[digit.length - 1];

    setCode(newCode.join(""));

    if (index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between gap-2 mb-4">
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputs.current[index] = ref;
          }}
          className="flex-1 h-14 border border-gray-300 rounded-xl text-center text-xl font-bold"
          value={code[index] || ""}
          onChangeText={(value) => handleChange(value, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();

  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const isLoading = fetchStatus === "fetching";

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  const onVerifyEmailPress = async () => {
    if (code.length !== 6) {
      alert("Please enter the complete 6-digit code.");
      return;
    }

    const { error } = await signUp.verifications.verifyEmailCode({
      code,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
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
          We sent a verification code to {signUp.emailAddress}. Please check
          your email and enter the code below to verify your email address.
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
            await signUp.verifications.sendEmailCode();
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

        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Create an Account
        </Text>

        <Text className="text-gray-500 mb-6">Find your dream house today.</Text>

        <View className="flex-row gap-3 mb-4">
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            placeholder="First Name"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Last Name"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>

        <View className="relative w-full mb-4">
          <TextInput
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Email address"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.fields?.emailAddress && (
            <Text className="text-red-500 mb-2 ml-1">
              {errors.fields.emailAddress.message}
            </Text>
          )}
        </View>

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
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 bottom-0 w-12 items-center justify-center"
              activeOpacity={0.7}
            >
              {" "}
              <View className="relative w-full mb-4">
                <TextInput
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12"
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-0 bottom-0 justify-center items-center"
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>

                {errors.fields?.password && (
                  <Text className="text-red-500 mb-2 ml-1">
                    {errors.fields.password.message}
                  </Text>
                )}
              </View>
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
          onPress={onSignUpPress}
          disabled={isLoading}
          className="w-full rounded-xl py-4 mb-4 bg-blue-500 items-center"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold">Sign up</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500">Already have an account? </Text>
          <Link href="/sign-in">
            <Text className="text-blue-500 font-semibold">Sign in</Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
