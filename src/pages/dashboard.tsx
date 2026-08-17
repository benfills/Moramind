import Aichatboxicon from "../assets/aichatboxicon";
import Bookicon from "../assets/bookicon";
import Journalicon from "../assets/journalicon";
import Mathicon from "../assets/mathicon";
import Productivityicon from "../assets/productivityicon";
import Settingsicon from "../assets/settingsicon";

export default function Dashboard() {
  return (
    <div className="bg-[#0B132B] relative h-1/8 w-full flex justify-between items-center text-5xl ">
      <div className=" w-1/3 flex justify-evenly gap-10 pl-6 ">
        {/* to be continued */}
        <Bookicon />
        <Productivityicon />
        <Journalicon />
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <div className="absolute inset-[50%_0px_0px_50%] translate-[-50%]  h-1/2 w-96 rounded-full transition-[background-color_0.5s_ease,blur_10s_ease] hover:bg-[rgba(0,229,255,0.12)] hover:blur-[20px]" />
        {/* to be continued */}
        <h1 className="absolute inset-[50%_0px_0px_50%] transition-all duration-500 ease-in translate-[-50%] pointer-events-none font-extrabold hover:text-shadow-[1px_0px_2px_#00E5FF,-1px_0px_2px_#00E5FF,0px_1px_2px_#00E5FF,0px_-1px_2px_#00E5FF] text-[#FFFFFF] flex justify-center items-center">
          {" "}
          Moramind{" "}
        </h1>
      </div>
      <div className="w-1/3 flex justify-evenly gap-10 pr-6">
        {/* to be continued */}
        <Aichatboxicon />
        <Mathicon />
        <Settingsicon />
      </div>
    </div>
  );
}
