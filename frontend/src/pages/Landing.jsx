import {
  ArrowRight,
  BarChart3,
  Wallet,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";

export default function Landing() {
  const { language, changeLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ================= NAVBAR ================= */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Wallet size={20} strokeWidth={2.4} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Smart<span className="text-blue-600">Budget</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              How it works
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              About
            </button>
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => changeLanguage(language === "en" ? "fr" : "en")}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              <Globe size={16} />
              {language.toUpperCase()}
            </button>

            <Link
              to="/login"
              className="rounded-xl border border-blue-200 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-sm font-medium text-slate-600"
              >
                Features
              </button>

              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-left text-sm font-medium text-slate-600"
              >
                How it works
              </button>

              <button
                onClick={() => scrollToSection("about")}
                className="text-left text-sm font-medium text-slate-600"
              >
                About
              </button>

              <div className="flex gap-3 border-t border-slate-100 pt-4">
                <Link
                  to="/login"
                  className="flex-1 rounded-xl border border-blue-200 py-2.5 text-center text-sm font-semibold text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-32">
          {/* Background decorations */}
          <div className="absolute -left-32 top-40 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 lg:grid-cols-2 lg:px-8 lg:pb-28">
            {/* Hero text */}
            <div>
              <div className="mb-6 inline-flex items-center rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm">
                Your personal finance companion
              </div>

              <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">
                Take control of{" "}
                <span className="text-blue-600">your money.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                SmartBudget helps you track your income and expenses, manage
                your budget, and build better financial habits. Simple, secure
                and made for you.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Get Started
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Login
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                {["Free to use", "Secure", "No credit card required"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-slate-500"
                    >
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-blue-200/30 blur-3xl" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                {/* Browser bar */}
                <div className="flex h-11 items-center gap-2 border-b border-slate-100 px-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                </div>

                <div className="flex min-h-[420px]">
                  {/* Sidebar */}
                  <div className="hidden w-40 border-r border-slate-100 bg-slate-50/70 p-4 sm:block">
                    <div className="mb-8 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-blue-600" />
                      <span className="text-xs font-bold">SmartBudget</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        "Dashboard",
                        "Expenses",
                        "Income",
                        "Budgets",
                        "Settings",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className={`rounded-lg px-3 py-2 text-[11px] ${
                            index === 0
                              ? "bg-blue-100 font-semibold text-blue-600"
                              : "text-slate-500"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dashboard content */}
                  <div className="flex-1 p-5">
                    <div className="mb-5">
                      <p className="text-[10px] text-slate-400">Welcome back</p>
                      <h3 className="text-lg font-bold text-slate-900">
                        Dashboard
                      </h3>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-emerald-50 p-3">
                        <p className="text-[9px] text-emerald-600">Balance</p>
                        <p className="mt-1 text-sm font-bold text-slate-800">
                          2,450 TND
                        </p>
                      </div>

                      <div className="rounded-xl bg-blue-50 p-3">
                        <p className="text-[9px] text-blue-600">Income</p>
                        <p className="mt-1 text-sm font-bold text-slate-800">
                          3,500 TND
                        </p>
                      </div>

                      <div className="rounded-xl bg-red-50 p-3">
                        <p className="text-[9px] text-red-500">Expenses</p>
                        <p className="mt-1 text-sm font-bold text-slate-800">
                          1,050 TND
                        </p>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="mt-4 rounded-xl border border-slate-100 p-4">
                      <div className="flex justify-between">
                        <span className="text-xs font-semibold text-slate-700">
                          Monthly Budget
                        </span>

                        <span className="text-[10px] text-slate-400">
                          700 / 1,000 TND
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-[70%] rounded-full bg-blue-600" />
                      </div>

                      <p className="mt-2 text-right text-[10px] font-semibold text-blue-600">
                        70%
                      </p>
                    </div>

                    {/* Chart */}
                    <div className="mt-4 rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">
                          Spending overview
                        </span>

                        <span className="text-[10px] text-slate-400">
                          This month
                        </span>
                      </div>

                      <div className="mt-5 flex h-28 items-end gap-3">
                        {[40, 65, 48, 80, 58, 72, 52, 88, 67, 76].map(
                          (height, index) => (
                            <div
                              key={index}
                              className="flex-1 rounded-t-md bg-blue-100"
                              style={{ height: `${height}%` }}
                            >
                              <div
                                className="h-full rounded-t-md bg-blue-500/70"
                                style={{
                                  height: `${Math.max(35, height - 20)}%`,
                                }}
                              />
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section id="features" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Features
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need to manage your money
              </h2>

              <p className="mt-4 text-slate-600">
                SmartBudget gives you the tools to track, plan and understand
                your finances.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: BarChart3,
                  title: "Track your income & expenses",
                  text: "Easily add and categorize your transactions to see where your money goes.",
                  color: "bg-emerald-50 text-emerald-600",
                },
                {
                  icon: Wallet,
                  title: "Monitor your budget",
                  text: "Set a budget and track your progress so you can stay in control.",
                  color: "bg-purple-50 text-purple-600",
                },
                {
                  icon: PieChart,
                  title: "Understand your spending",
                  text: "Get a clear overview of your financial activity with useful visual insights.",
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure personal accounts",
                  text: "Your financial information stays protected with secure authentication.",
                  color: "bg-indigo-50 text-indigo-600",
                },
              ].map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                    >
                      <Icon size={23} />
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {feature.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section
          id="how-it-works"
          className="bg-gradient-to-b from-blue-50/70 to-white py-24"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                How it works
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Get started in 4 simple steps
              </h2>

              <p className="mt-4 text-slate-600">
                It only takes a few minutes to start taking control of your
                finances.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-4">
              {[
                {
                  number: "01",
                  title: "Create an account",
                  text: "Sign up and create your personal SmartBudget account.",
                },
                {
                  number: "02",
                  title: "Add your income & expenses",
                  text: "Enter your transactions and organize them easily.",
                },
                {
                  number: "03",
                  title: "Set your budget",
                  text: "Choose your budget and financial goals.",
                },
                {
                  number: "04",
                  title: "Monitor your situation",
                  text: "Track your progress and make better decisions.",
                },
              ].map((step) => (
                <div key={step.number} className="relative">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
                    {step.number}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= ABOUT / PRODUCT SHOWCASE ================= */}
        <section id="about" className="bg-white py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10">
                <div className="rounded-xl bg-slate-50 p-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 rounded-xl bg-emerald-100" />
                    <div className="h-16 rounded-xl bg-blue-100" />
                    <div className="h-16 rounded-xl bg-red-100" />
                  </div>

                  <div className="mt-4 h-3 rounded-full bg-blue-500" />
                  <div className="mt-2 h-3 w-3/4 rounded-full bg-slate-200" />

                  <div className="mt-6 grid h-40 grid-cols-10 items-end gap-2">
                    {[35, 55, 45, 70, 60, 85, 52, 75, 65, 90].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="rounded-t-md bg-blue-500/70"
                          style={{ height: `${height}%` }}
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                See it in action
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                A clear and simple financial dashboard
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Get a complete overview of your finances at a glance. Track your
                balance, income, expenses and budget progress from one clean
                interface.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "Clear financial overview",
                  "Visual spending insights",
                  "Budget progress tracking",
                  "Access your information anytime",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-emerald-500"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="px-6 pb-24 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white shadow-2xl shadow-blue-600/20 md:flex-row md:px-12">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Start managing your money smarter today.
              </h2>

              <p className="mt-2 max-w-xl text-blue-100">
                Take the first step toward better financial habits with
                SmartBudget.
              </p>
            </div>

            <Link
              to="/register"
              className="group flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Create your free account
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-3 lg:px-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                <Wallet size={19} />
              </div>

              <span className="text-xl font-bold">
                Smart<span className="text-blue-400">Budget</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Better financial habits. A clearer financial future.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Navigation</h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <button
                onClick={() => scrollToSection("features")}
                className="block transition hover:text-white"
              >
                Features
              </button>

              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block transition hover:text-white"
              >
                How it works
              </button>

              <button
                onClick={() => scrollToSection("about")}
                className="block transition hover:text-white"
              >
                About
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Connect</h3>

            <div className="mt-4 flex gap-3">
              <a
                href="https://github.com/belguithashref/SmartBudget"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-white/5 p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <Github size={18} />
              </a>

              <a
                href="https://www.linkedin.com/in/belguith-achraf-132655400/"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-white/5 p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-6 py-5 text-xs text-slate-500 sm:flex-row lg:px-8">
            <span>© 2026 SmartBudget. All rights reserved.</span>

            <button
              onClick={() => changeLanguage(language === "en" ? "fr" : "en")}
              className="flex items-center gap-2 transition hover:text-white"
            >
              <Globe size={14} />
              {language === "en" ? "English" : "Français"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
