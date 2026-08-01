import type {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  User,
  Session
} from "@supabase/supabase-js";
import { createContext } from "react";

export interface AuthContext {
  user: User | null;
  isLoading: boolean;
  session: Session | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<AuthTokenResponsePassword>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
}

export const ctx = createContext<AuthContext | null>(null);
