import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="flex flex-1 min-h-screen flex-col items-center justify-center bg-[#0e0f14] px-5 py-12">
      <div className="mb-8 flex flex-col items-center">
        <span className="mb-4 inline-block rounded-full bg-[#aa3bff]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#aa3bff]">
          Welcome back
        </span>
        <h1 className="text-4xl font-black tracking-tight text-white">
          Moramind
        </h1>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 px-6 py-7 shadow-[0_0_40px_rgba(170,59,255,0.15)] backdrop-blur">
        <p className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-500">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-300">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#aa3bff]/60 focus:ring-1 focus:ring-[#aa3bff]/30 transition"
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-300">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#aa3bff]/60 focus:ring-1 focus:ring-[#aa3bff]/30 transition"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400 border border-red-500/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 w-full rounded-xl bg-[#aa3bff] text-sm font-bold text-white
              shadow-[0_0_20px_rgba(170,59,255,0.45)]
              hover:bg-[#9b2df0] hover:shadow-[0_0_30px_rgba(170,59,255,0.7)]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#aa3bff] hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
