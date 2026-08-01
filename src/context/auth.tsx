import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type {
  AuthResponse,
  AuthTokenResponsePassword,
  AuthError,
  Session,
  User,
} from "@supabase/supabase-js";
import { ctx } from "./authcontext";

export function Auth({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoading(false);
      setUser(data.session?.user ?? null);
      setSession(data.session);
    });
    const {
      data: {
        subscription: { unsubscribe },
      },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(
        `↳ [Auth] event diterima: "${event}"`,
        session?.user?.email ?? "(no session)",
      );
      if (event === "SIGNED_IN") {
        setLoading(false);
        setSession(session);
        setUser(session?.user ?? null);
      } else if (event === "SIGNED_OUT") {
        setLoading(false);
        setSession(null);
        setUser(null);
      } else if (event === "INITIAL_SESSION") {
        setLoading(false);
        setSession(session);
        setUser(session?.user ?? null);
      } else if (event === "TOKEN_REFRESHED") {
        setLoading(false);
        setSession(session);
        setUser(session?.user ?? null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  function signUp(email: string, password: string): Promise<AuthResponse> {
    return supabase.auth.signUp({ email, password });
  }
  function signIn(
    email: string,
    password: string,
  ): Promise<AuthTokenResponsePassword> {
    return supabase.auth.signInWithPassword({ email, password });
  }
  function signOut(): Promise<{ error: AuthError | null }> {
    return supabase.auth.signOut();
  }
  return (
    <ctx.Provider value={{ user, signIn, signOut, signUp, isLoading, session }}>
      {children}
    </ctx.Provider>
  );
}
