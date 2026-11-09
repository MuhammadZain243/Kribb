import { getErrorMessage } from "@/utils/errors";
import { useUser } from "@clerk/expo";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import { useSyncProfile } from "./useSyncProfile";

export function useProfilePhoto() {
  const { user } = useUser();
  const syncProfile = useSyncProfile();
  const [uploading, setUploading] = useState(false);

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

  /** Shows "Choose from library / Remove photo / Cancel". */
  const openMenu = () => {
    Alert.alert("Profile photo", undefined, [
      { text: "Choose from library", onPress: pickFromLibrary },
      ...(user?.hasImage
        ? [
            {
              text: "Remove photo",
              style: "destructive" as const,
              onPress: removePhoto,
            },
          ]
        : []),
      { text: "Cancel", style: "cancel" as const },
    ]);
  };

  return { openMenu, uploading };
}
