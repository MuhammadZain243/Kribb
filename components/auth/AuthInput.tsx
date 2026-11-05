import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type Props = TextInputProps & {
  icon: LucideIcon;
  error?: string;
  /** Renders a show/hide toggle and hides the text by default. */
  isPassword?: boolean;
};

export default function AuthInput({
  icon: Icon,
  error,
  isPassword = false,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const borderClass = error
    ? "border-red-400 bg-red-50"
    : focused
      ? "border-blue-500 bg-white"
      : "border-gray-200 bg-gray-50";

  return (
    <View className="mb-4">
      <View
        className={`flex-row items-center h-14 rounded-2xl border px-4 ${borderClass}`}
      >
        <Icon
          size={20}
          color={error ? "#F87171" : focused ? "#2563EB" : "#9CA3AF"}
        />

        <TextInput
          className="flex-1 ml-3 text-gray-900 text-base"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !visible}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setVisible((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            {visible ? (
              <EyeOff size={20} color="#9CA3AF" />
            ) : (
              <Eye size={20} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text className="text-red-500 text-sm mt-1.5 ml-1">{error}</Text>
      ) : null}
    </View>
  );
}
