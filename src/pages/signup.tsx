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
      className="flex h-dvh max-h-full w-dvw max-w-full items-center justify-center bg-cover bg-center bg-no-repeat"
    >
      <div className="flex h-96 w-full flex-col items-center justify-center">
        <button
          className="inline-block w-2xl translate-x-2 -translate-y-2 rounded-2xl bg-green-600 px-20 py-2 text-2xl text-white shadow-[-8px_8px_12px_1px_rgba(18,18,18,0.71)] hover:brightness-125 active:translate-x-0 active:translate-y-0 active:shadow-none"
          onClick={() => signUp(email, password)}
        >
          {" "}
          Sign Up{" "}
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
        </div>
        <div className="flex w-2xl justify-evenly">
          <Link
            to={"/login"}
            className="text-blue-600 underline hover:text-blue-800 hover:decoration-3"
          >
            {" "}
            Already have an Account?
          </Link>
          <Link
            to={"/forgotpassword"}
            className="text-blue-600 underline hover:text-blue-800 hover:decoration-3"
          >
            {" "}
            Forgot Password?{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}
