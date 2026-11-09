import { getErrorMessage } from "@/utils/errors";
import { useUser } from "@clerk/expo";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import { useSyncProfile } from "./useSyncProfile";

export type ProfilePhoto = ReturnType<typeof useProfilePhoto>;

/** Waits for the bottom sheet to finish closing before opening the picker. */
const SHEET_CLOSE_DELAY_MS = 350;

export function useProfilePhoto() {
  const { user } = useUser();
  const syncProfile = useSyncProfile();
  const [uploading, setUploading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const run = async (task: () => Promise<void>) => {
    setUploading(true);
    try {
      await task();
    } catch (error) {
      Alert.alert("Couldn't update photo", getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const pickFromLibrary = async () => {
    if (!user) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!asset.base64) {
      Alert.alert("Couldn't update photo", "We couldn't read that image.");
      return;
    }

    await run(async () => {
      const file = `data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}`;
      const image = await user.setProfileImage({ file });
      await syncProfile({ avatar_url: image?.publicUrl ?? user.imageUrl });
    });
  };

  const removePhoto = async () => {
    if (!user) return;

    await run(async () => {
      await user.setProfileImage({ file: null });
      await user.reload();
      await syncProfile({ avatar_url: user.imageUrl });
    });
  };

  const choosePhoto = () => {
    setMenuVisible(false);
    setTimeout(pickFromLibrary, SHEET_CLOSE_DELAY_MS);
  };

  const deletePhoto = () => {
    setMenuVisible(false);
    setTimeout(removePhoto, SHEET_CLOSE_DELAY_MS);
  };

  return {
    uploading,
    menuVisible,
    canRemove: !!user?.hasImage,
    openMenu: () => setMenuVisible(true),
    closeMenu: () => setMenuVisible(false),
    choosePhoto,
    deletePhoto,
  };
}
