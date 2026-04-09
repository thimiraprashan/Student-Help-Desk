import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setStudentSessionStorage } from "../../utils/sessionStore";

const CSlogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setStudentSessionStorage(data);
      onLogin?.(data);
      navigate("/student/dashboard");
    } catch (err) {
      setError("Unable to login. Try again later.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid lg:grid-cols-[1.2fr_0.8fr]">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-700 text-white p-10 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-slate-300">CareerGuide</p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight">
                Find internships, track applications, and manage your student career.
              </h1>
              <p className="mt-4 text-slate-200 text-sm leading-6">
                Login to view internships, submit applications, and receive notifications for your student profile.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-white/10 rounded-3xl p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Fast access</p>
                <p className="mt-3 text-sm">Login quickly and start applying for internships today.</p>
              </div>
              <div className="bg-white/10 rounded-3xl p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Student focus</p>
                <p className="mt-3 text-sm">Your applications, notifications, and profile are stored in one student workspace.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-slate-300">
            <div className="bg-white/10 rounded-3xl p-5">
              <p className="font-semibold text-white">01</p>
              <p className="mt-2">Login</p>
            </div>
            <div className="bg-white/10 rounded-3xl p-5">
              <p className="font-semibold text-white">02</p>
              <p className="mt-2">Search internships</p>
            </div>
            <div className="bg-white/10 rounded-3xl p-5">
              <p className="font-semibold text-white">03</p>
              <p className="mt-2">Apply & track</p>
            </div>
          </div>
        </div>

        <div className="p-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Student Portal</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500">
                Sign in to access your dashboard, internships, applications, and notifications.
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              S
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="student@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 text-white py-3 text-sm font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>

            <div className="text-sm text-slate-500">
              <p>Don't have a student account yet?</p>
              <button
                type="button"
                onClick={() => navigate("/student/register")}
                className="text-blue-600 underline"
              >
                Create a student account
              </button>
            </div>

            <div className="text-sm text-slate-500">
              <span>Need company login? </span>
              <button
                type="button"
                onClick={() => navigate("/company/login")}
                className="text-blue-600 underline"
              >
                Go to company login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CSlogin;
