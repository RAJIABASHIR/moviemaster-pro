import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  function validate() {
    const next = { email: "", password: "" };
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email.";
    if (password.length < 6) next.password = "Min 6 characters.";
    setErrs(next);
    return !next.email && !next.password;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix the errors.");
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (e) {
      toast.error(
        e.code === "auth/invalid-credential" ? "Invalid email or password." : e.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google");
      navigate("/");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 card mt-8">
      <h1 className="h1 mb-6">Login</h1>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="label block mb-1">Email</label>
          <input
            id="email"
            type="email"
            className={`input block w-full ${errs.email ? "border-red-500 focus:ring-red-500" : ""}`}
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errs.email}
          />
          {errs.email && <p className="text-sm text-red-500">{errs.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="label block mb-1">Password</label>
          <div className="relative w-full">
            <input
              id="password"
              type={showPwd ? "text" : "password"}
              className={`input block w-full pr-24 ${errs.password ? "border-red-500 focus:ring-red-500" : ""}`}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errs.password}
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}          // keep focus in input
              onClick={() => setShowPwd((v) => !v)}
              aria-label={showPwd ? "Hide password" : "Show password"}
              aria-pressed={showPwd}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-3 py-1.5 rounded-lg
                         border border-slate-300 dark:border-slate-700 select-none
                         hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>
          {errs.password && <p className="text-sm text-red-500">{errs.password}</p>}
        </div>

        {/* Centered text via justify-center */}
        <button
          className="btn w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>

<button
  type="button"
  onClick={google}
  disabled={loading}
  className="btn w-full mt-3 disabled:opacity-60 disabled:cursor-not-allowed"
>
  <span className="inline-flex items-center justify-center gap-3 w-full">
    {/* Google G in a white circular chip for contrast */}
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white ring-1 ring-black/5"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 48 48"
        className="w-4 h-4"
        role="img"
        focusable="false"
        aria-label="Google logo"
      >
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.9 0-12.5-5.6-12.5-12.5S17.1 11 24 11c3.2 0 6.1 1.2 8.3 3.2l5.7-5.7C34.7 5.4 29.6 3.5 24 3.5 12 3.5 2.5 13 2.5 25S12 46.5 24 46.5 45.5 37 45.5 25c0-1.6-.2-3.1-.6-4.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 13 24 13c3.2 0 6.1 1.2 8.3 3.2l5.7-5.7C34.7 7.4 29.6 5.5 24 5.5c-7.3 0-13.6 4.1-16.7 10z"/>
        <path fill="#4CAF50" d="M24 44.5c5.3 0 10.1-2 13.6-5.3l-6.3-5.2c-2 1.4-4.6 2.2-7.3 2.2-5.3 0-9.7-3.4-11.3-8l-6.6 5c3.1 6.1 9.4 11.3 17.9 11.3z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-3.2 5.2-6 6.5l6.3 5.2C39.2 36.2 41.5 31 41.5 25c0-1.6-.2-3.1-.6-4.5z"/>
      </svg>
    </span>

    <span className="leading-none">
      {loading ? "Signing in…" : "Google Login"}
    </span>
  </span>
</button>

      <div className="text-sm mt-4">
        No account? <Link className="text-primary" to="/register">Register</Link>
      </div>
    </div>
  );
}