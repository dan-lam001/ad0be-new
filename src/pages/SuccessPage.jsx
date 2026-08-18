import { useState } from "react";

const MESSAGE_URL = "http://localhost:3000/message";
const LOGIN_ROUTE = "/login";

function Spinner() {
  return (
    <span className="inline-block w-3.5 h-3.5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin mr-2 align-[-2px]" />
  );
}

export default function SuccessPage() {
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleViewMessage() {
    setLoading(true);
    setShowMessage(false);
    try {
      const response = await fetch(MESSAGE_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      let text;
      if (!response.ok) {
        text = `Server responded with an error (status ${response.status}).`;
      } else {
        try {
          const data = await response.json();
          text = data.message || JSON.stringify(data, null, 2);
        } catch (_) {
          text = await response.text();
        }
      }
      setMessage(text);
      setShowMessage(true);
    } catch (err) {
      setMessage("Could not reach the server at localhost:3000. Is it running?");
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    // If you're using react-router, swap this for: navigate("/login")
    window.location.href = LOGIN_ROUTE;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/60 rounded-xl p-9 shadow-2xl shadow-black/40 text-center">
        <div className="w-14 h-14 rounded-full bg-teal-300/10 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-teal-300">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-slate-100 tracking-tight mb-1">You're signed in</h1>
        <p className="text-sm text-slate-400 mb-7 leading-relaxed">
          Login was successful. You can view your message below.
        </p>

        <button
          onClick={handleViewMessage}
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-teal-300 hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 text-sm font-semibold transition active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Spinner />
              Loading…
            </>
          ) : (
            "View message"
          )}
        </button>

        <button
          onClick={handleLogout}
          className="w-full py-2.5 mt-3 rounded-lg border border-slate-700/60 hover:border-teal-500 hover:bg-teal-300/5 text-slate-100 text-sm font-semibold transition"
        >
          Log out
        </button>

        {showMessage && (
          <div className="mt-5 p-3.5 bg-slate-950 border border-slate-700/60 rounded-lg text-sm text-slate-100 text-left whitespace-pre-wrap break-words">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}