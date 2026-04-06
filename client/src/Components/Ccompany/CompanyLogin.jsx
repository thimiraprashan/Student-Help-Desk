import { useState } from "react";
import { useNavigate } from "react-router-dom";

const emptyForm = {
  name: "",
  email: "",
  password: "",
};

function CompanyLogin({ onLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        mode === "login"
          ? "http://localhost:5000/company-auth/login"
          : "http://localhost:5000/company-auth/register";

      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      let data;

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          "Backend login route is not responding correctly. Restart the server and try again."
        );
      }

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      localStorage.setItem("companySession", JSON.stringify(data));
      onLogin(data);
      navigate("/company/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#bfdbfe_0%,_#dbeafe_28%,_#eef4ff_58%,_#f8fbff_100%)] px-4 py-6 lg:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-[84rem] items-center">
        <div className="grid w-full gap-3 rounded-[1.9rem] border border-white/70 bg-white/45 p-3 shadow-[0_28px_80px_rgba(59,130,246,0.16)] backdrop-blur-xl lg:grid-cols-[1.02fr_0.9fr]">
        <div className="hidden rounded-[1.7rem] border border-white/20 bg-[linear-gradient(145deg,_#0f172a_0%,_#172554_45%,_#1d4ed8_100%)] p-5 text-white shadow-[0_20px_50px_rgba(30,64,175,0.24)] lg:block">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.4em] text-sky-200">
              CareerGuide
            </p>
            <div className="rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.25em] text-sky-100">
              Company Space
            </div>
          </div>

          <p className="mt-10 text-xs uppercase tracking-[0.45em] text-sky-200/80">
            CareerGuide
          </p>
          <h1 className="mt-4 max-w-xl text-[2.55rem] font-semibold leading-[1.08] xl:text-[3rem]">
            Hire interns with a portal that feels organized, fast, and clear.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100/85 xl:max-w-3xl">
            Manage internships, applicants, notifications, and company details in one
            focused workspace. Each company gets its own isolated account and data.
          </p>

          <div className="mt-6 grid gap-3 xl:grid-cols-2">
            <div className="rounded-[1.35rem] border border-white/15 bg-white/8 p-3.5 backdrop-blur-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-lg">
                <span>+</span>
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-sky-200">
                Fast Setup
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-100/90">
                Create an account, log in, and start posting internships in a few steps.
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-white/15 bg-white/8 p-3.5 backdrop-blur-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-lg">
                <span>#</span>
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-sky-200">
                Separate Data
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-100/90">
                Every logged-in company sees only its own internships, applicants, and profile.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3.5 text-center backdrop-blur-sm">
              <p className="text-xl font-semibold text-white">01</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-100/80">
                Login
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3.5 text-center backdrop-blur-sm">
              <p className="text-xl font-semibold text-white">02</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-100/80">
                Post Roles
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3.5 text-center backdrop-blur-sm">
              <p className="text-xl font-semibold text-white">03</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-100/80">
                Review Talent
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full rounded-[1.7rem] border border-white/80 bg-white/90 p-4.5 shadow-[0_18px_45px_rgba(59,130,246,0.14)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-blue-500">
                Company Portal
              </p>
              <h2 className="mt-2 text-[1.65rem] font-bold text-slate-900">
                {mode === "login" ? "Welcome back" : "Create your company account"}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(145deg,_#2563eb,_#4f46e5)] text-base font-bold text-white shadow-lg shadow-blue-200">
              CG
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            {mode === "login"
              ? "Sign in to open your dashboard, profile, internships, applicants, and notifications."
              : "Register with company name, email, and password to create your own workspace."}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-500">Portal</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">Secure</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-sky-50 px-3 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-500">Data</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">Private</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-indigo-50 px-3 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-500">Flow</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">Simple</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            {mode === "register" && (
              <div>
                <label className="text-sm font-medium text-slate-700">Company Name</label>
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(191,219,254,0.55)]"
                  placeholder="Tesla"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(191,219,254,0.55)]"
                placeholder="tesla@gmail.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(191,219,254,0.55)]"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[linear-gradient(90deg,_#2563eb,_#4338ca)] px-4 py-3 font-medium text-white shadow-[0_16px_30px_rgba(59,130,246,0.28)] transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Login"
                  : "Register"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode((prev) => (prev === "login" ? "register" : "login"));
              setError("");
              setForm(emptyForm);
            }}
            className="mt-6 text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            {mode === "login"
              ? "Create a new company account"
              : "Already have an account? Login"}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyLogin;
