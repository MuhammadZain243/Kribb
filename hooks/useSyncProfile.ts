import { useUser } from "@clerk/expo";
import { useCallback } from "react";
import { useSupabase } from "./useSupabase";

type ProfileFields = {
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
};

/**
 * Mirrors profile changes from Clerk into the Supabase `users` row.
 * Clerk stays the source of truth; Supabase is the copy.
 */
export function useSyncProfile() {
  const { user } = useUser();
  const supabase = useSupabase();

  return useCallback(
    async (fields: ProfileFields) => {
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .update(fields)
        .eq("clerk_id", user.id)
        .select("clerk_id");

      if (error) {
        throw new Error(
          `Saved to your account, but syncing failed: ${error.message}`,
        );
      }

      // A row-level-security rule can block an update without any error:
      // zero rows changed. Treat that as a failure too.
      if (!data?.length) {
        throw new Error(
          "Saved to your account, but your profile copy wasn't updated (check the update policy on the users table).",
        );
      }
    },
    [user, supabase],
  );
}
