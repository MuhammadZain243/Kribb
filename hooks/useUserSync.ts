import { useUser } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUserStore } from "../store/userStore";
import { useSupabase } from "./useSupabase";

export type SyncStatus = "syncing" | "synced" | "error";

/**
 * Makes sure the signed-in Clerk user exists in Supabase and loads their
 * admin flag into the store. Exposes a status so the UI can wait for it.
 */
export const useUserSync = () => {
  const { user, isLoaded } = useUser();
  const setIsAdmin = useUserStore((state) => state.setIsAdmin);
  const authSupabase = useSupabase();

  const [status, setStatus] = useState<SyncStatus>("syncing");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Always-latest client and user, read inside the effect so they don't have
  // to be effect dependencies (that would re-run the sync on every change).
  const latest = useRef({ client: authSupabase, user });
  useEffect(() => {
    latest.current = { client: authSupabase, user };
  });

  const userId = user?.id;

  useEffect(() => {
    if (!isLoaded || !userId) return;

    let cancelled = false;

    const sync = async () => {
      const { client, user: clerkUser } = latest.current;
      if (!clerkUser) return;

      setStatus("syncing");
      setError(null);

      const readIsAdmin = async () => {
        const { data, error: readError } = await client
          .from("users")
          .select("is_admin")
          .eq("clerk_id", userId)
          .single();
        if (readError) throw readError;
        return data?.is_admin ?? false;
      };

      // 1. Does the user already exist?
      const { data: existing, error: selectError } = await client
        .from("users")
        .select("clerk_id, is_admin")
        .eq("clerk_id", userId)
        .maybeSingle();
      if (selectError) throw selectError;

      let isAdmin: boolean;

      if (existing) {
        isAdmin = existing.is_admin ?? false;
      } else {
        // 2. First time we see this user: create the row
        const { data: created, error: insertError } = await client
          .from("users")
          .insert({
            clerk_id: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress ?? null,
            first_name: clerkUser.firstName,
            last_name: clerkUser.lastName,
            avatar_url: clerkUser.imageUrl,
          })
          .select("is_admin")
          .single();

        if (insertError) {
          // 23505 = unique violation: another run created it a moment ago
          if (insertError.code !== "23505") throw insertError;
          isAdmin = await readIsAdmin();
        } else {
          isAdmin = created?.is_admin ?? false;
        }
      }

      if (cancelled) return;
      setIsAdmin(isAdmin);
      setStatus("synced");
    };

    sync().catch((e: { message?: string }) => {
      if (cancelled) return;
      console.warn("User sync failed:", e);
      setError(e?.message ?? "Unable to sync your account.");
      setStatus("error");
    });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, userId, attempt, setIsAdmin]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { status, error, retry };
};
