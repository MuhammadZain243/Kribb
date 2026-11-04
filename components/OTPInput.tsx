import React, { useRef } from "react";
import { TextInput, View } from "react-native";

const OTP_LENGTH = 6;

export default function OTPInput({
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
      setCode(code.slice(0, index));
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
