import { useContext, useState } from "react";
import { ctx } from "../context/authcontext";
import HomepageWallpaper from "../assets/moramindhomepagewallpaper.png";

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
      className="relative w-full h-screen overflow-hidden bg-(--surface-1)  border-[0.5px] flex justify-center items-center bg-cover bg-no-repeat bg-center"
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
        className="absolute w-50 h-40 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out cursor-pointer flex items-center justify-center"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      >
        <svg viewBox="0 0 180 1" width="270" height="168" className="absolute">
          <ellipse
            cx="45"
            cy="36"
            rx="43"
            ry="20"
            fill="var(--surface-2)"
            stroke="var(--border-strong)"
            strokeWidth="1"
          ></ellipse>
          <circle
            cx="24"
            cy="20"
            r="16"
            fill="var(--surface-2)"
            stroke="var(--border-strong)"
            strokeWidth="1"
          ></circle>
          <circle
            cx="50"
            cy="14"
            r="20"
            fill="var(--surface-2)"
            stroke="var(--border-strong)"
            strokeWidth="1"
          ></circle>
          <circle
            cx="72"
            cy="24"
            r="14"
            fill="var(--surface-2)"
            stroke="var(--border-strong)"
            strokeWidth="1"
          ></circle>
          <rect
            x="6"
            y="30"
            width="78"
            height="9"
            fill="var(--surface-2)"
          ></rect>
          <circle cx="36" cy="30" r="3" fill="var(--text-primary)"></circle>
          <circle cx="54" cy="30" r="3" fill="var(--text-primary)"></circle>
          <polygon
            points="90 -20, 100 -10, 69.5 10"
            fill="var(--surface-2)"
            stroke="var(--surface-2)"
          ></polygon>
        </svg>
        <div
          className={`absolute translate-x-6 -translate-y-22 border-2 border-solid max-w-40 bottom-0 wrap-break-word text-[15px] rounded-4xl bg-white flex justify-center items-center border-white p-2`}
        >
          {`${respond[Math.floor(Math.random() * respond.length)]}`}
        </div>
      </div>
      <div className="h-96 flex flex-col justify-center items-center w-full border-solid border-2">
        <button
          className="inline-block bg-green-600 text-white text-2xl px-20 py-2 rounded-2xl w-2xl translate-x-2 -translate-y-2 shadow-[-8px_8px_12px_1px_rgba(18,18,18,0.71)] hover:brightness-125 active:shadow-none active:translate-x-0 active:translate-y-0"
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
        <div className="flex flex-0 justify-center  max-w-full max-h-full">
          <input
            className="bg-amber-800 max-w-md mt-2 rounded-lg p-2 border-4 border-blue-900 w-2xs"
            id="Email"
            title="email"
            placeholder="someone@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="bg-amber-800 max-w-md mt-2 rounded-lg p-2 border-4 border-blue-900 w-2xs"
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
