import { useAuth } from "@clerk/expo";
import { useMemo } from "react";
import { createSupabaseClient } from "../lib/supabase";

export function useSupabase() {
  const { getToken } = useAuth();

  const client = useMemo(
    () => createSupabaseClient(() => getToken()),
    [getToken],
  );

  return client;
}
