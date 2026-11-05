import { ViewStyle } from "react-native";

export const softShadow: ViewStyle = {
  elevation: 3,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
};

export const cardShadow: ViewStyle = {
  elevation: 3,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
};

export const primaryShadow: ViewStyle = {
  elevation: 4,
  shadowColor: "#2563EB",
  shadowOpacity: 0.3,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
};
