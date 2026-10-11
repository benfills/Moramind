import Aichatboxicon from "../assets/aichatboxicon";
import Bookicon from "../assets/bookicon";
import Journalicon from "../assets/journalicon";
import Mathicon from "../assets/mathicon";
import Productivityicon from "../assets/productivityicon";
import Settingsicon from "../assets/settingsicon";
import { useRef } from "react";

export default function Dashboard() {
  const iconhover = useRef<HTMLDivElement | null>(null);
  const linehover = useRef<HTMLDivElement | null>(null);
  const slideeffect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const leftbook = iconhover.current?.getBoundingClientRect().left ?? 0;
    const rightbook = iconhover.current?.getBoundingClientRect().right ?? 0;
    const bottombook = iconhover.current?.getBoundingClientRect().bottom ?? 0;
    const topbook = iconhover.current?.getBoundingClientRect().top ?? 0;
    const dleft = event.clientX - leftbook;
    const dright = rightbook - event.clientX;
    const dbottom = bottombook - event.clientY;
    const dtop = event.clientY - topbook;
    const nearest = Math.min(dleft, dright, dbottom, dtop);
    if (nearest === dbottom || nearest === dtop) {
      if (linehover.current) {
        linehover.current.style.transformOrigin = "center";
      }
    } else if (nearest === dleft) {
      if (linehover.current) {
        linehover.current.style.transformOrigin = "left";
      }
    } else if (nearest === dright) {
      if (linehover.current) {
        linehover.current.style.transformOrigin = "right";
      }
    }
  };
  return (
    <div className="relative flex h-dvh w-dvw flex-col">
      <div className="sticky top-0 flex h-1/8 w-full items-center justify-between bg-[#0B132B] text-5xl">
        <div className="flex h-full w-1/3 place-items-center gap-10 pl-6">
          <div className="iconhover" ref={iconhover} onMouseEnter={slideeffect}>
            <Bookicon />
            <div className="linehover" ref={linehover} />
          </div>
          <div className="iconhover">
            <Productivityicon />
            <div className="linehover" />
          </div>
          <div className="iconhover">
            <Journalicon />
            <div className="linehover" />
          </div>
        </div>
        <div className="h-full w-full">
          {/* transition-colors duration-500 ease-in-out */}
          <div className="absolute top-1/4 left-[37%] h-1/2 w-96  rounded-full bg-transparent blur-none transition-all duration-500 ease-in-out hover:bg-[rgba(0,229,255,0.12)] hover:blur-[15px]" />
          <h1 className="pointer-events-none absolute top-1/2 left-1/2 flex translate-[-50%] items-center justify-center font-extrabold text-[#FFFFFF] transition-all duration-500 ease-in">
            Moramind
          </h1>
        </div>
        <div className="flex h-full w-1/3 place-items-center gap-10 pr-6">
          <div className="iconhover">
            <Aichatboxicon />
            <div className="linehover" />
          </div>
          <div className="iconhover">
            <Mathicon />
            <div className="linehover" />
          </div>
          <div className="iconhover">
            <Settingsicon />
            <div className="linehover" />
          </div>
        </div>
      </div>
      <div className="cardfeatures_wrapper">
        <div className="cardfeatures">
          <p className="col-[1/3] bg-amber-500 text-center">Pomodoro Timer</p>
          <button className="cardfeatures_more col-[2/3] row-[2/3] bg-slate-700 wrap-break-word sm:opacity-0 transition-opacity duration-200 ease-linear hover:opacity-100">
            Read more
          </button>
        </div>
      </div>
    </div>
  );
}
