import { useContext, useState } from "react";
import { ctx } from "../context/authcontext";
import HomepageWallpaper from "../assets/moramindhomepagewallpaper.png";
import Cloud from "../assets/cloud";

export default function Login() {
  const auth = useContext(ctx);
  if (!auth) {
    console.error("client not detected");
    return;
  }
  const { signIn } = auth;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [respond] = useState<string[]>([
    "Please respect my personal space",
    "Your behavior is unacceptable",
    "I must ask you to keep your distance",
    "Stop touching me",
    "I am not comfortable with this physical contact.",
    "I did not give you permission to touch me",
    "I expect you to respect my boundaries",
  ]);
  const threshold = 90;

  return (
    <div
      style={{ backgroundImage: `url(${HomepageWallpaper})` }}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden border-[0.5px] bg-(--surface-1) bg-cover bg-center bg-no-repeat"
      onMouseMove={(e) => {
        const stage = e.currentTarget.getBoundingClientRect();
        const mx = e.clientX - stage.left;
        const my = e.clientY - stage.top;
        const cx = (pos.x / 100) * stage.width;
        const cy = (pos.y / 100) * stage.height;
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < threshold) {
          const angle = Math.atan2(dy, dx);
          const pushx = Math.cos(angle) * 60;
          const pushy = Math.sin(angle) * 60;
          const newCx = Math.min(stage.width - 50, Math.max(50, cx + pushx));
          const newCy = Math.min(stage.height - 40, Math.max(40, cy + pushy));
          setPos({
            x: (newCx / stage.width) * 100,
            y: (newCy / stage.height) * 100,
          });
        }
      }}
    >
      <div
        className="absolute flex h-40 w-50 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition-all duration-150 ease-out"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      >
        <Cloud />
        <div
          className={`absolute bottom-0 flex max-w-40 translate-x-6 -translate-y-22 items-center justify-center rounded-4xl border-2 border-solid border-white bg-white p-2 text-[15px] wrap-break-word`}
        >
          {`${respond[Math.floor(Math.random() * respond.length)]}`}
        </div>
      </div>
      <div className="flex h-96 w-full flex-col items-center justify-center border-2 border-solid">
        <button
          className="inline-block w-2xl translate-x-2 -translate-y-2 rounded-2xl bg-green-600 px-20 py-2 text-2xl text-white shadow-[-8px_8px_12px_1px_rgba(18,18,18,0.71)] hover:brightness-125 active:translate-x-0 active:translate-y-0 active:shadow-none"
          onClick={() => {
            signIn(email, password)
              .then((success) => {
                if (success.data.session) {
                  alert("User Signed In");
                } else if (success.error?.name === "AuthRetryableFetchError") {
                  alert("internet error");
                } else if (success.error) {
                  alert(
                    `unable to sign in:scheck if your password is correct and email exist`,
                  );
                } else {
                }
              })
              .catch((error) => {
                alert(`something went wrong: ${error}`);
              });
          }}
        >
          {" "}
          Login{" "}
        </button>
        <div className="flex max-h-full max-w-full flex-0 justify-center">
          <input
            className="mt-2 w-2xs max-w-md rounded-lg border-4 border-blue-900 bg-amber-800 p-2"
            id="Email"
            title="email"
            placeholder="someone@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="mt-2 w-2xs max-w-md rounded-lg border-4 border-blue-900 bg-amber-800 p-2"
            id="Password"
            title="password"
            type="password"
            placeholder="8 Characters Min"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>{" "}
      </div>
    </div>
  );
}
