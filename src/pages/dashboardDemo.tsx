import Aichatboxicon from "../assets/aichatboxicon";
import Bookicon from "../assets/bookicon";
import Journalicon from "../assets/journalicon";
import Mathicon from "../assets/mathicon";
import Productivityicon from "../assets/productivityicon";
import Settingsicon from "../assets/settingsicon";

export default function Dashboard() {
  return (
    <div className="relative flex h-dvh w-dvw flex-col">
      <div className="sticky top-0 flex h-1/8 w-full items-center justify-between bg-[#0B132B] text-5xl">
        <div className="flex w-1/3 justify-evenly gap-10 pl-6">
          {/* to be continued */}
          <Bookicon />
          <Productivityicon />
          <Journalicon />
        </div>
        <div className="h-full w-full">
          <div className="absolute top-1/2 left-1/2 h-1/2 w-96 translate-[-50%] rounded-full transition-[background-color_0.5s_ease,blur_10s_ease] hover:bg-[rgba(0,229,255,0.12)] hover:blur-[20px]" />
          {/* to be continued */}
          <h1 className="pointer-events-none absolute top-1/2 left-1/2 flex translate-[-50%] items-center justify-center font-extrabold text-[#FFFFFF] transition-all duration-500 ease-in hover:text-shadow-[1px_0px_2px_#00E5FF,-1px_0px_2px_#00E5FF,0px_1px_2px_#00E5FF,0px_-1px_2px_#00E5FF]">
            Moramind
          </h1>
        </div>
        <div className="flex w-1/3 justify-evenly gap-10 pr-6">
          {/* to be continued */}
          <Aichatboxicon />
          <Mathicon />
          <Settingsicon />
        </div>
      </div>
      <div className="grid w-full flex-1 grid-cols-4 grid-rows-[298px_1fr] gap-7.5 bg-black p-5 wrap-break-word">
        <div className=" grid h-full w-full grid-cols-[1fr_60px] grid-rows-[30px_1fr] overflow-hidden rounded-[70px] bg-slate-950 text-white">
          <p className="col-[1/3] bg-amber-500 text-center">Pomodoro Timer</p>
          {/* State changes from other elements --> read more animation */}
          <button className="col-[2/3] row-[2/3] bg-slate-700 wrap-break-word">
            Read more
          </button>
        </div>
        <div className="grid h-full w-full grid-cols-[1fr_60px] justify-center rounded-[70px] bg-slate-950 text-white">
          <p className="text-center">Progress Tracking</p>
          <button className="col-[2/3] rounded-r-[70px] bg-slate-700 wrap-break-word">
            Read more
          </button>
        </div>
        <div className="grid h-full w-full grid-cols-[1fr_60px] justify-center rounded-[70px] bg-slate-950 text-white">
          <p className="text-center">Scheduler</p>
          <button className="col-[2/3] rounded-r-[70px] bg-slate-700 wrap-break-word">
            Read more
          </button>
        </div>
        <div className="grid h-full w-full grid-cols-[1fr_60px] justify-center rounded-[70px] bg-slate-950 text-white">
          <p className="text-center">Habit recovery tracker</p>
          <button className="col-[2/3] rounded-r-[70px] bg-slate-700 wrap-break-word">
            Read more
          </button>
        </div>
      </div>
    </div>
  );
}
