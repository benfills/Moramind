import aichatboxicon from "../assets/aichatboxicon.svg";
import bookicon from "../assets/bookicon.svg";
import journalicon from "../assets/journalicon.svg";
import mathicon from "../assets/mathicon.svg";
import Productivityicon from "../assets/productivityicon";
import settingsicon from "../assets/settingsicon.svg";

export default function Dashboard() {
  const linehoverpoint = null;
  const slideeffect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const leftbook = event.currentTarget.getBoundingClientRect().left;
    const rightbook = event.currentTarget.getBoundingClientRect().right;
    const bottombook = event.currentTarget.getBoundingClientRect().bottom;
    const topbook = event.currentTarget.getBoundingClientRect().top;
    const dleft = event.clientX - leftbook;
    const dright = rightbook - event.clientX;
    const dbottom = bottombook - event.clientY;
    const dtop = event.clientY - topbook;
    const nearest = Math.min(dleft, dright, dbottom, dtop);
    // Goal: How can I ensure that the identifier for linehover is also dynamic, depending on the element currently being hovered over?
    if (nearest === dbottom || nearest === dtop) {
      event.currentTarget.style.transformOrigin = "center";
    } else if (nearest === dleft) {
      event.currentTarget.style.transformOrigin = "left";
    } else if (nearest === dright) {
      event.currentTarget.style.transformOrigin = "right";
    }
  };
  return (
    <div className="relative flex h-dvh w-dvw flex-col">
      <div className="sticky top-0 flex h-1/8 w-full items-center justify-between bg-[#0B132B] text-5xl">
        <div className="flex h-full flex-1 place-items-center gap-4 pl-6 lg:gap-10">
          <div className="iconhover shrink-0" onMouseEnter={slideeffect}>
            <img src={bookicon} className="size-14 max-w-none lg:size-20" />
            <div className="linehover" ref={linehoverpoint} />
          </div>
          <div className="iconhover shrink-0" onMouseEnter={slideeffect}>
            <Productivityicon />
            <div className="linehover" ref={linehoverpoint} />
          </div>
          <div className="iconhover shrink-0" onMouseEnter={slideeffect}>
            <img src={journalicon} className="size-14 max-w-none lg:size-20" />
            <div className="linehover" ref={linehoverpoint} />
          </div>
        </div>

        <div className="h-full flex-1">
          <div className="absolute top-1/4 left-[37%] h-1/2 w-96 rounded-full bg-transparent blur-none transition-all duration-500 ease-in-out hover:bg-[rgba(0,229,255,0.12)] hover:blur-[15px]" />
          <h1 className="pointer-events-none absolute top-1/2 left-1/2 flex translate-[-50%] items-center justify-center font-extrabold text-[#FFFFFF] transition-all duration-500 ease-in">
            Moramind
          </h1>
        </div>
        <div className="lg:gap-10-10 flex h-full flex-1 place-items-center justify-end gap-4 pr-6 lg:gap-10">
          <div className="iconhover shrink-0" onMouseEnter={slideeffect}>
            <img
              src={aichatboxicon}
              className="size-14 max-w-none lg:size-20"
            />
            <div className="linehover" ref={linehoverpoint} />
          </div>
          <div className="iconhover shrink-0" onMouseEnter={slideeffect}>
            <img src={mathicon} className="size-14 max-w-none lg:size-20" />
            <div className="linehover" ref={linehoverpoint} />
          </div>
          <div className="iconhover shrink-0" onMouseEnter={slideeffect}>
            <img src={settingsicon} className="size-14 max-w-none lg:size-20" />
            <div className="linehover" ref={linehoverpoint} />
          </div>
        </div>
      </div>
      <div className="cardfeatures_wrapper">
        <div className="cardfeatures">
          <p className="col-[1/3] bg-amber-500 text-center">Pomodoro Timer</p>
          <button className="cardfeatures_more col-[2/3] row-[2/3] bg-slate-700 wrap-break-word transition-opacity duration-200 ease-linear hover:opacity-100 sm:opacity-0">
            Read more
          </button>
        </div>
      </div>
    </div>
  );
}
