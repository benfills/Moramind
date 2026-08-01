import { useContext, useState } from "react";
import { ctx } from "../context/authcontext";
import "../index.css";
import HomepageWallpaper from "../assets/moramindhomepagewallpaper.png";
import { Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authctx = useContext(ctx);
  if (!authctx) {
    throw new Error("No Auth Data available");
  }
  const { signUp } = authctx;
  return (
    <div
      style={{ backgroundImage: `url(${HomepageWallpaper})` }}
      className="flex items-center justify-center w-dvw h-dvh max-w-full max-h-full bg-cover bg-no-repeat bg-center"
    >
      <div className="h-96 flex flex-col justify-center items-center w-full">
        <button
          className="inline-block bg-green-600 text-white text-2xl px-20 py-2 rounded-2xl w-2xl translate-x-2 -translate-y-2 shadow-[-8px_8px_12px_1px_rgba(18,18,18,0.71)] hover:brightness-125 active:shadow-none active:translate-x-0 active:translate-y-0"
          onClick={() => signUp(email, password)}
        >
          {" "}
          Sign Up{" "}
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
        </div>
        <div className="flex justify-evenly w-2xl">
          <Link
            to={"/login"}
            className="underline text-blue-600 hover:text-blue-800 hover:decoration-3"
          >
            {" "}
            Already have an Account?
          </Link>
          <Link
            to={"/forgotpassword"}
            className="underline text-blue-600 hover:text-blue-800 hover:decoration-3"
          >
            {" "}
            Forgot Password?{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}
