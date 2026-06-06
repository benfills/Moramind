import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // Supabase sends a confirmation email by default.
      // If you disabled email confirmation in the dashboard, navigate('/') instead.
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="flex flex-1 min-h-screen flex-col items-center justify-center bg-[#0e0f14] px-5">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center shadow-[0_0_40px_rgba(170,59,255,0.15)]">
          <p className="text-4xl mb-3">📬</p>
          <h2 className="text-xl font-bold text-white mb-2">
            Check your email
          </h2>
          <p className="text-sm text-gray-400">
            We sent a confirmation link to{" "}
            <span className="text-[#aa3bff]">{email}</span>. Click it to
            activate your account.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 text-sm text-[#aa3bff] hover:underline"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-screen flex-col items-center justify-center bg-[#0e0f14] px-5 py-12">
      <div className="mb-8 flex flex-col items-center">
        <span className="mb-4 inline-block rounded-full bg-[#aa3bff]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#aa3bff]">
          Get started
        </span>
        <h1 className="text-4xl font-black tracking-tight text-white">
          Moramind
        </h1>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 px-6 py-7 shadow-[0_0_40px_rgba(170,59,255,0.15)] backdrop-blur">
        <p className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-500">
          Create your account
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#aa3bff]/60 focus:ring-1 focus:ring-[#aa3bff]/30 transition"
              placeholder="min. 6 characters"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-300">
              Confirm password
            </span>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#aa3bff] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
