import { useUserStore } from "@/store/userStore";
import { Tabs } from "expo-router";
import React from "react";
import GlassTabBar from "./GlassTabBar";
import { TAB_META } from "./tabConfig";

export default function AndroidTabs() {
  const isAdmin = useUserStore((state) => state.isAdmin);

  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: TAB_META.index.label }} />
      <Tabs.Screen name="search" options={{ title: TAB_META.search.label }} />
      <Tabs.Screen
        name="create"
        options={{
          title: TAB_META.create.label,
          // Hide the route completely for non-admins
          href: isAdmin ? undefined : null,
        }}
      />
      <Tabs.Screen name="saved" options={{ title: TAB_META.saved.label }} />
      <Tabs.Screen name="profile" options={{ title: TAB_META.profile.label }} />
    </Tabs>
  );
}
