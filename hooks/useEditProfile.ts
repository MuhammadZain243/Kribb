import { getErrorMessage } from "@/utils/errors";
import { useUser } from "@clerk/expo";
import { useState } from "react";
import { useSyncProfile } from "./useSyncProfile";

export function useEditProfile() {
  const { user } = useUser();
  const syncProfile = useSyncProfile();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const first = firstName.trim();
  const last = lastName.trim();

  const dirty =
    first !== (user?.firstName ?? "") || last !== (user?.lastName ?? "");
  const canSave = dirty && first.length > 0 && !saving;

  /** Returns true when everything was saved. */
  const save = async (): Promise<boolean> => {
    if (!user || !canSave) return false;

    setError(null);
    setSaving(true);

    try {
      await user.update({ firstName: first, lastName: last });
      await syncProfile({ first_name: first, last_name: last });
      return true;
    } catch (e) {
      setError(getErrorMessage(e));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    saving,
    error,
    canSave,
    save,
  };
}
