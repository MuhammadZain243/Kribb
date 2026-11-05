import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export type IconName = keyof typeof MaterialIcons.glyphMap;

export const TAB_COLORS = {
  active: "#2563EB",
  activeDark: "#1D4ED8",
  inactive: "#64748B",
} as const;

export const TAB_BAR = {
  height: 68,
  margin: 16,
  radius: 30,
} as const;

export const SPRING_CONFIG = { damping: 14, stiffness: 160, mass: 0.7 };

export type TabName = "index" | "search" | "create" | "saved" | "profile";

/** The raised button tab that only admins can see. */
export const ADD_TAB: TabName = "create";

export const TAB_META: Record<TabName, { icon: IconName; label: string }> = {
  index: { icon: "home", label: "Home" },
  search: { icon: "search", label: "Search" },
  create: { icon: "add", label: "Add Property" },
  saved: { icon: "favorite", label: "Saved" },
  profile: { icon: "person", label: "Profile" },
};

export const isTabName = (name: string): name is TabName => name in TAB_META;

export const tabItemStyle = StyleSheet.create({
  item: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
}).item;
