import aichatboxicon from "../assets/aichatboxicon.svg";
import articleicon from "../assets/articleicon.svg";
import journalicon from "../assets/journalicon.svg";
import mathicon from "../assets/mathicon.svg";
import Productivityicon from "../assets/productivityicon";
import settingsicon from "../assets/settingsicon.svg";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const slideeffect = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    const leftbook = event.currentTarget.getBoundingClientRect().left;
    const rightbook = event.currentTarget.getBoundingClientRect().right;
    const bottombook = event.currentTarget.getBoundingClientRect().bottom;
    const topbook = event.currentTarget.getBoundingClientRect().top;
    const dleft = event.clientX - leftbook;
    const dright = rightbook - event.clientX;
    const dbottom = bottombook - event.clientY;
    const dtop = event.clientY - topbook;
    const nearest = Math.min(dleft, dright, dbottom, dtop);
    const linehover = event.currentTarget.querySelector(
      ".linehover",
    ) as HTMLElement;
    // Goal: pending new mission...
    if (nearest === dbottom || nearest === dtop) {
      linehover.style.transformOrigin = "center";
    } else if (nearest === dleft) {
      linehover.style.transformOrigin = "left";
    } else if (nearest === dright) {
      linehover.style.transformOrigin = "right";
    }
  };
  return (
    <div className="relative flex h-dvh w-dvw flex-col">
      <div className="sticky top-0 flex h-1/8 w-full items-center justify-between bg-[#0B132B] text-5xl">
        <div className="flex h-full flex-1 place-items-center gap-4 pl-6 lg:gap-10">
          <Link
            to="/article"
            className="iconhover relative shrink-0"
            onMouseEnter={slideeffect}
            onMouseLeave={slideeffect}
          >
            <img src={articleicon} className="size-14 max-w-none lg:size-20" />
            <div className="linehover" />
          </Link>
          <Link
            to="/dashboard"
            className="iconhover relative shrink-0"
            onMouseEnter={slideeffect}
            onMouseLeave={slideeffect}
          >
            <Productivityicon />
            <div className="linehover" />
          </Link>
          <Link
            to="/journal"
            className="iconhover relative shrink-0"
            onMouseEnter={slideeffect}
            onMouseLeave={slideeffect}
          >
            <img src={journalicon} className="size-14 max-w-none lg:size-20" />
            <div className="linehover" />
          </Link>
        </div>
        <div className="h-full flex-1">
          <Link to="/home" className="absolute top-1/4 left-[37%] h-1/2 w-96 rounded-full bg-transparent blur-none transition-all duration-500 ease-in-out hover:bg-[rgba(0,229,255,0.12)] hover:blur-[15px]" />
          <div  className="pointer-events-none absolute top-1/2 left-1/2 flex translate-[-50%] items-center justify-center font-extrabold text-[#FFFFFF] transition-all duration-500 ease-in">
            Moramind
          </div>
        </div>
        <div className="lg:gap-10-10 flex h-full flex-1 place-items-center justify-end gap-4 pr-6 lg:gap-10">
          <Link
            to="/aichat"
            className="iconhover relative shrink-0"
            onMouseEnter={slideeffect}
            onMouseLeave={slideeffect}
          >
            <img
              src={aichatboxicon}
              className="size-14 max-w-none lg:size-20"
            />
            <div className="linehover" />
          </Link>
          <Link
            to="/math-challenge"
            className="iconhover relative shrink-0"
            onMouseEnter={slideeffect}
            onMouseLeave={slideeffect}
          >
            <img src={mathicon} className="size-14 max-w-none lg:size-20" />
            <div className="linehover" />
          </Link>
          <Link
            to="/settings"
            className="iconhover relative shrink-0"
            onMouseEnter={slideeffect}
            onMouseLeave={slideeffect}
          >
            <img src={settingsicon} className="size-14 max-w-none lg:size-20" />
            <div className="linehover" />
          </Link>
        </div>
      </div>
      <div className="cardfeatures_wrapper">
        <Link to="/pomodoro-timer" className="cardfeatures">
          <p className="col-[1/3] bg-amber-500 text-center">Pomodoro Timer</p>
          <button className="cardfeatures_more col-[2/3] row-[2/3] bg-slate-700 wrap-break-word transition-opacity duration-200 ease-linear hover:opacity-100 sm:opacity-0">
            Read more
          </button>
        </Link>
      </div>
    </div>
  );
}
