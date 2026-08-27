import Cloud from "../assets/cloud";
import videoPlaceholder from "../assets/VideoPlaceholder.mp4";
import subtitle from "../assets/subtitles.vtt";

export default function Homepage() {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center gap-10 bg-black px-4 py-12">
      <div className="mb-10 flex w-full flex-col items-center justify-center gap-4 text-center">
        <h1 className="max-w-[100vw] sm:max-w-130">
          <span className="text-[clamp(2rem,6vw,3.5rem)] leading-tight font-bold text-(--text-primary)">
            Brains adapt.{" "}
          </span>
          <span className="text-[clamp(1rem,2.5vw,1.5rem)] leading-tight font-normal text-(--text-secondary)">
            We just build systems that don't fight yours.
          </span>
        </h1>
        <button className="mt-1 h-9 -translate-x-0.5 -translate-y-0.5 rounded-2xl border-3 border-solid border-white bg-(--primary-main) px-8 text-white shadow-[3px_3px_12px_1px_rgba(25,41,66,0.16)] hover:bg-(--primary-hover) active:translate-x-0 active:translate-y-0 active:shadow-none">
          Try Now
        </button>
      </div>
      <div className="relative mx-auto mt-25 aspect-502/324 w-full max-w-125.5">
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
          <div className="absolute top-4 left-1/2 w-32 -translate-y-full rounded-4xl border-2 border-solid border-black bg-white p-2 text-center text-xs wrap-break-word sm:w-40 sm:text-[15px]">
            Hello, I will explain a summary of the specific feature shown in
            this video.
          </div>
        </div>
      </div>
      <div className="dbg1 flex h-90 w-full">
        <div className="dbg2 flex-1"></div>
        <div className="dbg3 flex flex-1 justify-center">
          <div className="dbg4 m-10 flex w-1/2 flex-wrap pr-6 leading-none">
            <Heatblocks />
          </div>
        </div>
      </div>
    </div>
  );
}

function Heatblocks() {
  const heatmapColors = [
    "#ccd7e6",
    "#96abcb",
    "#efefef",
    "#4a6fa5",
    "#96abcb",
    "#ccd7e6",
    "#efefef",
    "#96abcb",
    "#4a6fa5",
    "#4a6fa5",
    "#ccd7e6",
    "#efefef",
    "#96abcb",
    "#4a6fa5",
    "#efefef",
    "#ccd7e6",
    "#96abcb",
    "#4a6fa5",
    "#4a6fa5",
    "#96abcb",
    "#ccd7e6",
    "#4a6fa5",
    "#96abcb",
    "#ccd7e6",
    "#efefef",
    "#ccd7e6",
    "#96abcb",
    "#4a6fa5",
    "#96abcb",
    "#ccd7e6",
    "#4a6fa5",
    "#96abcb",
    "#ccd7e6",
    "#efefef",
    "#ccd7e6",
    "#96abcb",
    "#4a6fa5",
  ];
  const progress = heatmapColors.map((colors, index) => (
    <div
      className="h-5 w-5 rounded-lg border-black"
      style={{
        backgroundColor: `${colors}`,
      }}
    />
  ));
  return progress;
}
