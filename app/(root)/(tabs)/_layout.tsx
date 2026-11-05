import AndroidTabs from "@/components/tabs/AndroidTabs";
import IOSTabs from "@/components/tabs/IOSTabs";
import { Platform } from "react-native";

export default function TabLayout() {
  return Platform.OS === "ios" ? <IOSTabs /> : <AndroidTabs />;
}
