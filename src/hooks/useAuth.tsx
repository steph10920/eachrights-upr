import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";
import {
  getCurrentStaffProfile,
  signIn,
  signOut,
} from "../lib/auth";

import type { Profile } from "../types/auth";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;

  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;

  signOut: () => Promise<void>;

  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user ?? null;

  async function loadProfile() {
  try {
    const staffProfile = await getCurrentStaffProfile();

    console.log("AUTH USER:", user);
    console.log("STAFF PROFILE:", staffProfile);

    setProfile(staffProfile as Profile | null);
  } catch (error) {
    console.error("Failed to load staff profile:", error);
    setProfile(null);
  }
}

  useEffect(() => {
    let mounted = true;

    async function initialise() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(session);

        if (session?.user) {
          await loadProfile();
        }
      } catch (error) {
        console.error("Failed to initialise authentication:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initialise();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        if (!mounted) return;

        setSession(nextSession);

        if (nextSession?.user) {
          await loadProfile();
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignIn(
    email: string,
    password: string
  ): Promise<{ error: string | null }> {
    try {
      await signIn(email, password);

      return { error: null };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to sign in.",
      };
    }
  }

  async function handleSignOut() {
    await signOut();
    setSession(null);
    setProfile(null);
  }

  async function refreshProfile() {
    await loadProfile();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within <AuthProvider>"
    );
  }

  return context;
}