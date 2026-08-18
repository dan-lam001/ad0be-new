import { useState } from "react";

const LOGIN_URL = "http://localhost:3000/login";
const SUCCESS_ROUTE = "/success";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function Spinner() {
  return (
    <span className="inline-block w-3.5 h-3.5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin mr-2 align-[-2px]" />
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!isValidEmail(email.trim())) next.email = "Enter a valid email address.";

    if (!password) next.password = "Password is required.";
    else if (password.length < 6) next.password = "Password must be at least 6 characters.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        let message = "Invalid email or password.";
        try {
          const data = await response.json();
          if (data?.message) message = data.message;
        } catch (_) {}
        setFormError(message);
        setLoading(false);
        return;
      }

      // Redirect to the success page.
      // If you're using react-router, swap this for: navigate("/success")
      window.location.href = SUCCESS_ROUTE;
    } catch (err) {
      setFormError("Could not reach the server at localhost:3000. Is it running?");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/60 rounded-xl p-9 shadow-2xl shadow-black/40">
        {/* <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-300 to-teal-500 flex items-center justify-center font-bold text-slate-900 text-lg mb-5">
          A
        </div> */}
        <h1 className="text-xl font-semibold text-slate-100 tracking-tight mb-1">Sign in</h1>
        <p className="text-sm text-slate-400 mb-7 leading-relaxed">
          Enter your email and password to continue.
        </p>

        {formError && (
          <div className="bg-red-400/10 border border-red-400/30 text-red-400 text-sm rounded-lg px-3 py-2.5 mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-lg text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-teal-400/25 focus:border-teal-500 ${
                errors.email ? "border-red-400" : "border-slate-700/60"
              }`}
            />
            <div className="text-red-400 text-xs mt-1.5 min-h-[16px]">{errors.email}</div>
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="block text-xs font-medium text-slate-400 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-lg text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-teal-400/25 focus:border-teal-500 ${
                errors.password ? "border-red-400" : "border-slate-700/60"
              }`}
            />
            <div className="text-red-400 text-xs mt-1.5 min-h-[16px]">{errors.password}</div>
          </div>

          <div className="flex items-center justify-between mb-6 mt-2">
            <label className="flex items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-teal-500"
              />
              Remember me
            </label>
            <a href="#" className="text-xs text-teal-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-teal-300 hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 text-sm font-semibold transition active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Spinner />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}