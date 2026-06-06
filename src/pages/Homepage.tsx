import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type Span = "wide" | "full" | undefined;

interface Feature {
  id: string;
  symbol: string;
  title: string;
  desc: string;
  accent: string;
  accentRgb: string;
  available: boolean;
  href?: string;
  span?: Span;
}

const FEATURES: Feature[] = [
  {
    id: "pomodoro",
    symbol: "◷",
    title: "Pomodoro",
    desc: "Deep work sessions with customizable focus timers and automatic rest cycles.",
    accent: "#aa3bff",
    accentRgb: "170,59,255",
    available: true,
    href: "/pomodoro",
    span: "wide",
  },
  {
    id: "tasks",
    symbol: "◻",
    title: "Tasks",
    desc: "Capture, prioritize, and close your work items.",
    accent: "#60a5fa",
    accentRgb: "96,165,250",
    available: false,
  },
  {
    id: "habits",
    symbol: "↺",
    title: "Habits",
    desc: "Build lasting routines with daily streak tracking.",
    accent: "#34d399",
    accentRgb: "52,211,153",
    available: false,
  },
  {
    id: "notes",
    symbol: "◈",
    title: "Notes",
    desc: "Quick capture for thoughts, ideas, and linked references.",
    accent: "#fbbf24",
    accentRgb: "251,191,36",
    available: false,
  },
  {
    id: "music",
    symbol: "◉",
    title: "Music",
    desc: "Ambient soundscapes and curated playlists for deep focus.",
    accent: "#f472b6",
    accentRgb: "244,114,182",
    available: false,
  },
  {
    id: "stats",
    symbol: "◎",
    title: "Stats",
    desc: "Track your progress, streaks, and visualize your focus patterns over time.",
    accent: "#22d3ee",
    accentRgb: "34,211,238",
    available: false,
    span: "full",
  },
];

const QUICK_STATS = [
  { label: "Sessions today", value: "0" },
  { label: "Focus time", value: "0 min" },
  { label: "Tasks done", value: "0" },
  { label: "Day streak", value: "1" },
];

function getGreeting(email?: string) {
  const h = new Date().getHours();
  const salutation =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const name = email?.split("@")[0] ?? "there";
  return { salutation, name };
}

export default function Homepage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { salutation, name } = useMemo(() => getGreeting(user?.email), [user]);

  return (
    <div className="min-h-screen w-full bg-[#0e0f14] text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(170,59,255,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-8 flex flex-col gap-10">
        <header className="flex items-center justify-between">
          <span
            className="text-sm font-black text-white tracking-tight"
            style={{ letterSpacing: "-0.5px" }}
          >
            Moramind
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-gray-500 sm:block truncate max-w-50">
              {user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="text-xs text-gray-400 transition-colors hover:text-white"
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-gray-500">{salutation},</p>
          <h1
            className="text-5xl font-black capitalize text-white md:text-6xl"
            style={{ letterSpacing: "-2.5px", lineHeight: "1.05" }}
          >
            {name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </section>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-1 rounded-xl border border-white/[0.07] bg-white/3 px-4 py-4"
            >
              <p className="text-[11px] font-medium uppercase tracking-widest text-gray-500">
                {s.label}
              </p>
              <p
                className="text-2xl font-black text-white"
                style={{ letterSpacing: "-0.5px" }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-600">
            Your workspace
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FeatureCard
                key={f.id}
                feature={f}
                delay={i * 50}
                onClick={() => f.available && f.href && navigate(f.href)}
              />
            ))}
          </div>
        </div>

        <footer className="pb-4 text-center text-[11px] text-gray-700">
          Moramind · Focus. Rest. Repeat.
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({
  feature: f,
  delay,
  onClick,
}: {
  feature: Feature;
  delay: number;
  onClick: () => void;
}) {
  const spanClass =
    f.span === "full"
      ? "lg:col-span-3 sm:col-span-2"
      : f.span === "wide"
      ? "lg:col-span-2 sm:col-span-2"
      : "";

  return (
    <div
      role={f.available ? "button" : "article"}
      tabIndex={f.available ? 0 : undefined}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onClick={onClick}
      className={[
        "group relative flex min-h-42 flex-col justify-between overflow-hidden rounded-2xl border px-6 py-5 transition-all duration-300",
        spanClass,
        f.available
          ? "cursor-pointer hover:-translate-y-0.5"
          : "cursor-default opacity-55",
      ].join(" ")}
      style={{
        borderColor: f.available
          ? `rgba(${f.accentRgb},0.32)`
          : "rgba(255,255,255,0.07)",
        backgroundColor: f.available
          ? `rgba(${f.accentRgb},0.05)`
          : "rgba(255,255,255,0.02)",
        boxShadow: f.available ? `0 0 28px rgba(${f.accentRgb},0.06)` : "none",
        animationDelay: `${delay}ms`,
      }}
    >
      {f.available && (
        <div
          aria-hidden
          className="absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-35"
          style={{ background: f.accent }}
        />
      )}

      <div className="relative z-10 flex flex-col gap-2">
        <span
          className="text-2xl font-black"
          style={{ color: f.accent, lineHeight: 1 }}
        >
          {f.symbol}
        </span>
        <h2
          className="text-base font-black text-white"
          style={{ letterSpacing: "-0.5px" }}
        >
          {f.title}
        </h2>
        <p className="text-sm leading-relaxed text-gray-400">{f.desc}</p>
      </div>

      <div className="relative z-10 mt-4">
        <span
          className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
          style={
            f.available
              ? {
                  color: f.accent,
                  background: `rgba(${f.accentRgb},0.14)`,
                }
              : {
                  color: "#6b7280",
                  background: "rgba(255,255,255,0.05)",
                }
          }
        >
          {f.available ? "Open →" : "Coming soon"}
        </span>
      </div>
    </div>
  );
}
