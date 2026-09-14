import Cloud from "../assets/cloud";
import videoPlaceholder from "../assets/VideoPlaceholder.mp4";
import subtitle from "../assets/subtitles.vtt";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Homepage() {
  const [initialDuration, setInitialDuration] = useState(40);
  const [tick, setTick] = useState(initialDuration);
  const [status, setStatus] = useState(false);
  const [hasError, setHasError] = useState({
    increment: false,
    decrement: false,
    playback: false,
  });
  const duration = [Math.floor(tick / 60), tick % 60]
    .map((time) => time.toString().padStart(2, "0"))
    .join(":");
  useEffect(() => {
    if (!status) return;
    const tickid = setInterval(() => {
      setTick((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(tickid);
  }, [status]);
  useEffect(() => {
    if (status && tick === 0) {
      setStatus(false);
    }
  }, [tick, status]);

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center gap-10 overflow-x-clip bg-(--bg-primary) px-4 py-12">
      <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
        <h1 className="max-w-[100vw] sm:max-w-130">
          <span className="block text-[clamp(2rem,6vw,3.5rem)] leading-tight font-bold text-(--text-primary)">
            Brains adapt.
          </span>
          <span className="mt-2 block text-[clamp(1rem,2.5vw,1.5rem)] leading-tight font-normal text-(--text-secondary)">
            We just build systems that don't fight yours.
          </span>
        </h1>
        <button className="mt-1 h-9 -translate-x-0.5 -translate-y-0.5 rounded-2xl border-3 border-solid border-(--bg-surface) bg-(--primary-main) px-8 text-(--text-on-primary) shadow-[3px_3px_12px_1px_rgba(25,41,66,0.16)] hover:bg-(--primary-hover) active:translate-x-0 active:translate-y-0 active:shadow-none">
          Try Now
        </button>
      </div>
      <div className="relative mx-auto mt-30 aspect-502/324 w-full max-w-125.5">
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-(--bg-secondary)">
          <video className="h-full w-full object-cover" controls>
            <source src={videoPlaceholder} type="video/mp4" />
            <track
              kind="captions"
              src={subtitle}
              srcLang="en"
              label="English"
              default
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="absolute -top-15 left-0 z-10 aspect-105/76 w-[28%] max-w-40.5 min-w-22.5 -translate-x-1/4 sm:-translate-x-1/3">
          <Cloud />
          <div className="absolute top-4 left-0 w-[calc(100vw-32px)] -translate-y-full rounded-4xl border-2 border-solid border-(--border-strong) bg-(--bg-surface) p-2 text-center text-xs wrap-break-word text-(--text-primary) sm:left-1/2 sm:w-max sm:max-w-sm sm:-translate-x-1/2 sm:text-[15px]">
            Hello, I will explain a summary of the specific feature shown in
            this video.
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-16">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-10 flex w-max flex-col items-center justify-center gap-7">
            <p className="text-[16px] text-(--text-secondary)">Session 1/4</p>

            {status === false && tick === initialDuration ? (
              <div className="flex gap-10">
                <div className="relative">
                  <button
                    className="h-12 w-12 -translate-x-0.5 -translate-y-0.5 rounded-[50%] bg-(--primary-light) text-(--text-primary) shadow-[3px_3px_12px_1px_rgba(25,41,66,0.16)] hover:bg-(--primary-hover) hover:text-(--text-on-primary) active:translate-x-0 active:translate-y-0 active:shadow-none"
                    onClick={() => {
                      if (initialDuration >= 3600) {
                        setHasError((prev) => ({ ...prev, increment: true }));
                        setTimeout(() => {
                          setHasError((prev) => ({
                            ...prev,
                            increment: false,
                          }));
                        }, 2000);
                      } else {
                        const next = Math.min(initialDuration + 120, 3600);
                        setInitialDuration(next);
                        setTick(next);
                      }
                    }}
                  >
                    +120s
                  </button>
                  {hasError.increment ? (
                    <p className="absolute top-full left-1/2 mt-2 w-24 -translate-x-1/2 text-center text-xs whitespace-nowrap text-(--text-secondary)">
                      maximum reached
                    </p>
                  ) : null}
                </div>
                <div className="relative">
                  <button
                    className="h-12 w-12 -translate-x-0.5 -translate-y-0.5 rounded-[50%] bg-(--primary-light) text-(--text-primary) shadow-[3px_3px_12px_1px_rgba(25,41,66,0.16)] hover:bg-(--primary-hover) hover:text-(--text-on-primary) active:translate-x-0 active:translate-y-0 active:shadow-none"
                    onClick={() => {
                      if (initialDuration <= 0) {
                        setHasError((prev) => ({ ...prev, decrement: true }));
                        setTimeout(() => {
                          setHasError((prev) => ({
                            ...prev,
                            decrement: false,
                          }));
                        }, 2000);
                      } else {
                        const next = Math.max(initialDuration - 120, 0);
                        setInitialDuration(next);
                        setTick(next);
                      }
                    }}
                  >
                    -120s
                  </button>
                  {hasError.decrement ? (
                    <p className="absolute top-full left-1/2 mt-2 w-28 -translate-x-1/2 text-center text-xs whitespace-nowrap text-(--text-secondary)">
                      you wouldn't want to
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <p className="text-7xl font-bold text-(--text-primary)">
              {duration}
            </p>

            <div className="relative flex items-center justify-center gap-4">
              {tick !== initialDuration ? (
                <button
                  className="h-10 w-28 -translate-x-0.5 -translate-y-0.5 rounded-3xl bg-(--text-muted) text-(--text-on-primary) shadow-[3px_3px_12px_1px_rgba(25,41,66,0.16)] hover:bg-(--text-secondary) active:translate-x-0 active:translate-y-0 active:shadow-none"
                  onClick={() => {
                    setTick(initialDuration);
                    setStatus(false);
                  }}
                >
                  RESET
                </button>
              ) : null}
              <button
                className={`h-10 w-28 -translate-x-0.5 -translate-y-0.5 rounded-3xl ${
                  status && tick > 0
                    ? "bg-(--status-error) hover:bg-(--status-error-hover)"
                    : "bg-(--primary-main) hover:bg-(--primary-hover)"
                } text-(--text-on-primary) shadow-[3px_3px_12px_1px_rgba(25,41,66,0.16)] active:translate-x-0 active:translate-y-0 active:shadow-none`}
                onClick={() => {
                  if (tick > 0) {
                    setStatus(!status);
                  } else {
                    setHasError((prev) => ({ ...prev, playback: true }));
                    setTimeout(() => {
                      setHasError((prev) => ({ ...prev, playback: false }));
                    }, 2000);
                  }
                }}
              >
                {status && tick > 0
                  ? "STOP"
                  : tick > 0 && tick < initialDuration
                    ? "RESUME"
                    : "START"}
              </button>
              {hasError.playback ? (
                <p className="absolute top-full mt-2 text-xs whitespace-nowrap text-(--text-secondary)">
                  What exactly are you timing with this?
                </p>
              ) : null}
            </div>
          </div>
          <h3 className="text-[22px] font-bold text-(--text-primary)">
            Pomodoro
          </h3>
          <p className="text-base text-(--text-secondary)">
            Time that works with you, not against you.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-5">
            <p className="text-[16px] text-(--text-secondary)">This month</p>
            <div className="m-10 grid w-max grid-cols-7 content-start gap-0.5">
              <Heatblocks />
            </div>
          </div>
          <h3 className="text-[22px] font-bold text-(--text-primary)">
            Progress Tracking
          </h3>
          <p className="text-base text-(--text-secondary)">
            See your pattern, not your failures.
          </p>
        </div>
      </div>
    </div>
  );
}

function Heatblocks() {
  const heatmapPalette = [
    "var(--primary-main)",
    "var(--primary-light)",
    "var(--bg-tertiary)",
    "var(--primary-hover)",
  ];

  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();

  const progress = Array.from({ length: daysInMonth }, (_, index) => (
    <div
      key={index}
      className="h-7 w-7 rounded-md"
      style={{
        backgroundColor: heatmapPalette[index % heatmapPalette.length],
      }}
    />
  ));

  return progress;
}
