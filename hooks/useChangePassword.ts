import { getClerkError } from "@/utils/errors";
import { useUser } from "@clerk/expo";
import { useState } from "react";

const MIN_LENGTH = 8;

type Field = "current" | "next" | "confirm";
type FieldErrors = Partial<Record<Field, string>>;

export function useChangePassword() {
  const { user } = useUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signOutOthers, setSignOutOthers] = useState(true);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /** Returns true when the password was changed. */
  const submit = async (): Promise<boolean> => {
    if (!user) return false;

    setFormError(null);

    const errors: FieldErrors = {};
    if (!currentPassword) errors.current = "Enter your current password.";
    if (newPassword.length < MIN_LENGTH) {
      errors.next = `Use at least ${MIN_LENGTH} characters.`;
    } else if (newPassword === currentPassword) {
      errors.next = "Your new password must be different from the current one.";
    }
    if (confirmPassword !== newPassword) {
      errors.confirm = "Passwords don't match.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return false;

    setSaving(true);
    try {
      await user.updatePassword({
        currentPassword,
        newPassword,
        signOutOfOtherSessions: signOutOthers,
      });
      return true;
    } catch (e) {
      const { message, param } = getClerkError(e);

      if (param === "current_password") setFieldErrors({ current: message });
      else if (param === "new_password") setFieldErrors({ next: message });
      else setFormError(message);

      return false;
    } finally {
      setSaving(false);
    }
  };

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    !saving;

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    signOutOthers,
    setSignOutOthers,
    fieldErrors,
    formError,
    saving,
    canSubmit,
    submit,
    /** Accounts created with a social login have no password to change. */
    passwordEnabled: user?.passwordEnabled ?? true,
  };
}
