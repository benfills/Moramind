import Aichatboxicon from "../assets/aichatboxicon";
import Bookicon from "../assets/bookicon";
import Journalicon from "../assets/journalicon";
import Mathicon from "../assets/mathicon";
import Productivityicon from "../assets/productivityicon";
import Settingsicon from "../assets/settingsicon";

export default function Dashboard() {
  return (
    <div className="relative flex h-1/8 w-full items-center justify-between bg-[#0B132B] text-5xl">
      <div className="flex w-1/3 justify-evenly gap-10 pl-6">
        {/* to be continued */}
        <Bookicon />
        <Productivityicon />
        <Journalicon />
      </div>
      <div className="flex h-full w-full items-center justify-center">
        <div className="absolute inset-[50%_0px_0px_50%] h-1/2 w-96 translate-[-50%] rounded-full transition-[background-color_0.5s_ease,blur_10s_ease] hover:bg-[rgba(0,229,255,0.12)] hover:blur-[20px]" />
        {/* to be continued */}
        <h1 className="pointer-events-none absolute inset-[50%_0px_0px_50%] flex translate-[-50%] items-center justify-center font-extrabold text-[#FFFFFF] transition-all duration-500 ease-in hover:text-shadow-[1px_0px_2px_#00E5FF,-1px_0px_2px_#00E5FF,0px_1px_2px_#00E5FF,0px_-1px_2px_#00E5FF]">
          {" "}
          Moramind{" "}
        </h1>
      </div>
      <div className="flex w-1/3 justify-evenly gap-10 pr-6">
        {/* to be continued */}
        <Aichatboxicon />
        <Mathicon />
        <Settingsicon />
      </div>
    </div>
  );
}
