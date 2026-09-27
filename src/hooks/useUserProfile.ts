import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export type UserRole =
  | "contributor"
  | "reviewer"
  | "administrator";

export type AccountStatus =
  | "pending_approval"
  | "active"
  | "suspended";

export interface UserProfile {
  id: string;
  full_name: string | null;
  organisation: string | null;
  role: UserRole;
  account_status: AccountStatus;
  last_login: string | null;
}

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useUserProfile(): UseUserProfileReturn {
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (authLoading) {
        return;
      }

      if (!user) {
        if (mounted) {
          setProfile(null);
          setLoading(false);
          setError(null);
        }

        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: profileError } = await supabase
        .from("users")
        .select(`
          id,
          full_name,
          organisation,
          role,
          account_status,
          last_login
        `)
        .eq("id", user.id)
        .single();

      if (!mounted) {
        return;
      }

      if (profileError) {
        console.error("Unable to load user profile:", profileError);

        setProfile(null);
        setError(profileError.message);
        setLoading(false);

        return;
      }

      setProfile(data as UserProfile);
      setLoading(false);
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  return {
    profile,
    loading: authLoading || loading,
    error,
  };
}