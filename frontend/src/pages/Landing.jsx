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
  TrendingUp,
  CreditCard,
  Target,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

export default function Landing() {
  const { t, language, changeLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.5,
  });

  /* ================= SCROLL ANIMATIONS ================= */

  const heroOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  const heroY = useTransform(smoothProgress, [0, 0.15], [0, -120]);

  const dashboardY = useTransform(smoothProgress, [0, 0.25], [0, -100]);

  const dashboardScale = useTransform(smoothProgress, [0, 0.22], [1, 0.88]);

  const dashboardRotate = useTransform(smoothProgress, [0, 0.22], [0, -2]);

  const floatingCardOneY = useTransform(smoothProgress, [0, 0.2], [0, -80]);

  const floatingCardTwoY = useTransform(smoothProgress, [0, 0.2], [0, 100]);

  const featureOpacity = useTransform(smoothProgress, [0.12, 0.25], [0, 1]);

  const featureY = useTransform(smoothProgress, [0.12, 0.28], [80, 0]);

  const toggleLanguage = () => {
    changeLanguage(language === "en" ? "fr" : "en");
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
            >
              <Wallet size={20} strokeWidth={2.4} />
            </motion.div>

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
              {t("landingFeatures")}
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              {t("landingHowItWorks")}
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              {t("landingAbout")}
            </button>
          </nav>

          {/* Desktop actions */}

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              <Globe size={16} />
              {language === "en" ? "FR" : "EN"}
            </button>

            <Link
              to="/login"
              className="rounded-xl border border-blue-200 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              {t("login")}
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              {t("landingGetStarted")}
            </Link>
          </div>

          {/* Mobile */}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-700 md:hidden"
            aria-label={t("landingToggleNavigation")}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-sm font-medium text-slate-600"
              >
                {t("landingFeatures")}
              </button>

              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-left text-sm font-medium text-slate-600"
              >
                {t("landingHowItWorks")}
              </button>

              <button
                onClick={() => scrollToSection("about")}
                className="text-left text-sm font-medium text-slate-600"
              >
                {t("landingAbout")}
              </button>

              <div className="border-t border-slate-100 pt-4">
                <button
                  onClick={toggleLanguage}
                  className="mb-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  <Globe size={16} />
                  {language === "en" ? t("french") : t("english")}
                </button>

                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="flex-1 rounded-xl border border-blue-200 py-2.5 text-center text-sm font-semibold text-blue-600"
                  >
                    {t("login")}
                  </Link>

                  <Link
                    to="/register"
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    {t("landingGetStarted")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          HERO / SCROLL EXPERIENCE
      ========================================================= */}

      <main>
        <section className="relative min-h-[160vh] overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
          {/* Background glow */}

          <div className="absolute left-1/2 top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-300/20 blur-[120px]" />

          <div className="absolute -left-40 top-[500px] h-96 w-96 rounded-full bg-indigo-300/20 blur-[120px]" />

          <div className="absolute -right-40 top-[700px] h-96 w-96 rounded-full bg-blue-200/30 blur-[120px]" />

          {/* Hero text */}

          <motion.div
            style={{
              opacity: heroOpacity,
              y: heroY,
            }}
            className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-36 text-center lg:pt-44"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              {t("landingHeroBadge")}
            </motion.div>

            <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              {t("landingHeroTitle")}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t("landingHeroHighlight")}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              {t("landingHeroDescription")}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-1 hover:bg-blue-700"
              >
                {t("landingGetStarted")}

                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-7 py-4 font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
              >
                {t("login")}
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 size={16} className="text-emerald-500" />
                {t("landingFreeToUse")}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 size={16} className="text-emerald-500" />
                {t("landingSecure")}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 size={16} className="text-emerald-500" />
                {t("landingNoCreditCard")}
              </div>
            </div>
          </motion.div>

          {/* =====================================================
              DASHBOARD
          ===================================================== */}

          <motion.div
            style={{
              y: dashboardY,
              scale: dashboardScale,
              rotateX: dashboardRotate,
            }}
            className="absolute left-1/2 top-[600px] z-20 w-[92%] max-w-5xl -translate-x-1/2"
          >
            {/* Floating card - balance */}

            <motion.div
              style={{ y: floatingCardOneY }}
              className="absolute -left-5 top-16 z-30 hidden w-48 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-2xl backdrop-blur-xl sm:block lg:-left-20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-slate-400">
                    {t("balance")}
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    2,450 TND
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp size={18} />
                </div>
              </div>

              <p className="mt-3 text-[10px] font-medium text-emerald-600">
                +12.5% this month
              </p>
            </motion.div>

            {/* Floating card - budget */}

            <motion.div
              style={{ y: floatingCardTwoY }}
              className="absolute -right-5 bottom-20 z-30 hidden w-52 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-2xl backdrop-blur-xl sm:block lg:-right-20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Target size={18} />
                </div>

                <div>
                  <p className="text-[10px] text-slate-400">
                    {t("landingMonthlyBudget")}
                  </p>

                  <p className="text-sm font-bold text-slate-900">70% used</p>
                </div>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[70%] rounded-full bg-blue-600" />
              </div>
            </motion.div>

            {/* Browser */}

            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_40px_100px_rgba(15,23,42,0.18)]">
              {/* Browser bar */}

              <div className="flex h-12 items-center border-b border-slate-100 px-5">
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                </div>

                <div className="mx-auto hidden h-6 w-64 rounded-md bg-slate-50 sm:block" />
              </div>

              <div className="flex min-h-[440px]">
                {/* Sidebar */}

                <div className="hidden w-44 border-r border-slate-100 bg-slate-50/70 p-4 sm:block">
                  <div className="mb-8 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <Wallet size={14} />
                    </div>

                    <span className="text-xs font-bold">SmartBudget</span>
                  </div>

                  <div className="space-y-2">
                    <div className="rounded-lg bg-blue-100 px-3 py-2 text-[11px] font-semibold text-blue-600">
                      {t("dashboard")}
                    </div>

                    <div className="rounded-lg px-3 py-2 text-[11px] text-slate-500">
                      {t("expenses")}
                    </div>

                    <div className="rounded-lg px-3 py-2 text-[11px] text-slate-500">
                      {t("income")}
                    </div>

                    <div className="rounded-lg px-3 py-2 text-[11px] text-slate-500">
                      {t("budgets")}
                    </div>

                    <div className="rounded-lg px-3 py-2 text-[11px] text-slate-500">
                      {t("settings")}
                    </div>
                  </div>
                </div>

                {/* Dashboard */}

                <div className="flex-1 bg-white p-5 sm:p-7">
                  <div className="mb-6">
                    <p className="text-[10px] text-slate-400">
                      {t("landingWelcomeBack")}
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      {t("dashboard")}
                    </h3>
                  </div>

                  {/* Stats */}

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-emerald-50 p-4">
                      <p className="text-[9px] font-medium text-emerald-600">
                        {t("balance")}
                      </p>

                      <p className="mt-2 text-base font-bold text-slate-900">
                        2,450 TND
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-[8px] font-semibold text-emerald-600">
                        <TrendingUp size={10} />
                        +12.5%
                      </div>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-4">
                      <p className="text-[9px] font-medium text-blue-600">
                        {t("income")}
                      </p>

                      <p className="mt-2 text-base font-bold text-slate-900">
                        3,500 TND
                      </p>

                      <div className="mt-2 h-1.5 rounded-full bg-blue-100">
                        <div className="h-full w-[80%] rounded-full bg-blue-500" />
                      </div>
                    </div>

                    <div className="rounded-xl bg-red-50 p-4">
                      <p className="text-[9px] font-medium text-red-500">
                        {t("expenses")}
                      </p>

                      <p className="mt-2 text-base font-bold text-slate-900">
                        1,050 TND
                      </p>

                      <div className="mt-2 h-1.5 rounded-full bg-red-100">
                        <div className="h-full w-[45%] rounded-full bg-red-400" />
                      </div>
                    </div>
                  </div>

                  {/* Main content */}

                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {/* Chart */}

                    <div className="rounded-xl border border-slate-100 p-5 lg:col-span-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            {t("landingSpendingOverview")}
                          </p>

                          <p className="mt-1 text-[9px] text-slate-400">
                            {t("landingThisMonth")}
                          </p>
                        </div>

                        <BarChart3 size={17} className="text-blue-500" />
                      </div>

                      <div className="mt-8 flex h-36 items-end gap-2">
                        {[40, 58, 45, 72, 52, 82, 62, 90, 67, 78, 60, 86].map(
                          (height, index) => (
                            <motion.div
                              key={index}
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{
                                delay: 0.4 + index * 0.05,
                                duration: 0.7,
                                ease: "easeOut",
                              }}
                              className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400"
                            />
                          ),
                        )}
                      </div>
                    </div>

                    {/* Budget */}

                    <div className="rounded-xl border border-slate-100 p-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                          <Target size={15} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            {t("landingMonthlyBudget")}
                          </p>

                          <p className="text-[9px] text-slate-400">
                            700 / 1,000 TND
                          </p>
                        </div>
                      </div>

                      <div className="mt-7 flex justify-center">
                        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[12px] border-slate-100">
                          <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-blue-500 border-r-blue-500 rotate-[-20deg]" />

                          <div className="text-center">
                            <p className="text-xl font-bold text-slate-900">
                              70%
                            </p>

                            <p className="text-[8px] text-slate-400">used</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom cards */}

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <CreditCard size={15} className="text-slate-500" />

                      <p className="mt-2 text-[9px] text-slate-400">
                        Transactions
                      </p>

                      <p className="text-sm font-bold text-slate-800">24</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <PieChart size={15} className="text-blue-500" />

                      <p className="mt-2 text-[9px] text-slate-400">
                        Categories
                      </p>

                      <p className="text-sm font-bold text-slate-800">8</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <TrendingUp size={15} className="text-emerald-500" />

                      <p className="mt-2 text-[9px] text-slate-400">Savings</p>

                      <p className="text-sm font-bold text-slate-800">+18%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}

          <motion.div
            style={{ opacity: heroOpacity }}
            className="absolute bottom-12 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium text-slate-400 md:flex"
          >
            <span>Scroll to explore</span>

            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
              className="flex h-9 w-6 items-start justify-center rounded-full border border-slate-300 p-1.5"
            >
              <div className="h-1.5 w-1 rounded-full bg-slate-400" />
            </motion.div>
          </motion.div>
        </section>

        {/* =========================================================
            FEATURE STORY
        ========================================================= */}

        <motion.section
          id="features"
          style={{
            opacity: featureOpacity,
            y: featureY,
          }}
          className="relative overflow-hidden bg-white py-32"
        >
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100/40 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                {t("landingFeatures")}
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {t("landingFeaturesTitle")}
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                {t("landingFeaturesDescription")}
              </p>
            </div>

            <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: BarChart3,
                  title: "landingFeatureTrackTitle",
                  text: "landingFeatureTrackText",
                },
                {
                  icon: Wallet,
                  title: "landingFeatureBudgetTitle",
                  text: "landingFeatureBudgetText",
                },
                {
                  icon: PieChart,
                  title: "landingFeatureInsightsTitle",
                  text: "landingFeatureInsightsText",
                },
                {
                  icon: ShieldCheck,
                  title: "landingFeatureSecurityTitle",
                  text: "landingFeatureSecurityText",
                },
              ].map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.6,
                    }}
                    whileHover={{
                      y: -8,
                    }}
                    className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-900/10"
                  >
                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={23} />
                    </div>

                    <h3 className="mt-7 text-lg font-bold text-slate-900">
                      {t(feature.title)}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {t(feature.text)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* =========================================================
            HOW IT WORKS
        ========================================================= */}

        <section
          id="how-it-works"
          className="relative overflow-hidden bg-slate-950 py-32 text-white"
        >
          <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                {t("landingHowItWorks")}
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                {t("landingHowItWorksTitle")}
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                {t("landingHowItWorksDescription")}
              </p>
            </div>

            <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  number: "01",
                  title: "landingStep1Title",
                  text: "landingStep1Text",
                },
                {
                  number: "02",
                  title: "landingStep2Title",
                  text: "landingStep2Text",
                },
                {
                  number: "03",
                  title: "landingStep3Title",
                  text: "landingStep3Text",
                },
                {
                  number: "04",
                  title: "landingStep4Title",
                  text: "landingStep4Text",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    delay: index * 0.12,
                  }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur"
                >
                  <span className="text-sm font-bold text-blue-400">
                    {step.number}
                  </span>

                  <h3 className="mt-8 text-xl font-bold">{t(step.title)}</h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {t(step.text)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            PRODUCT SHOWCASE
        ========================================================= */}

        <section id="about" className="relative overflow-hidden bg-white py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2 lg:px-8">
            <motion.div
              initial={{
                opacity: 0,
                x: -60,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                {t("landingSeeItInAction")}
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {t("landingDashboardTitle")}
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                {t("landingDashboardDescription")}
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "landingDashboardFeature1",
                  "landingDashboardFeature2",
                  "landingDashboardFeature3",
                  "landingDashboardFeature4",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-emerald-500"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {t(feature)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Product visual */}

            <motion.div
              initial={{
                opacity: 0,
                x: 60,
                scale: 0.95,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.8,
              }}
              className="relative"
            >
              <div className="absolute -inset-10 rounded-full bg-blue-200/30 blur-[80px]" />

              <div className="relative rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl">
                <div className="rounded-2xl bg-slate-50 p-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-emerald-100 p-4">
                      <TrendingUp className="text-emerald-600" size={20} />

                      <p className="mt-4 text-[10px] text-emerald-600">
                        {t("income")}
                      </p>

                      <p className="text-lg font-bold text-slate-800">3,500</p>
                    </div>

                    <div className="rounded-2xl bg-red-100 p-4">
                      <CreditCard className="text-red-500" size={20} />

                      <p className="mt-4 text-[10px] text-red-500">
                        {t("expenses")}
                      </p>

                      <p className="text-lg font-bold text-slate-800">1,050</p>
                    </div>

                    <div className="rounded-2xl bg-blue-100 p-4">
                      <Wallet className="text-blue-600" size={20} />

                      <p className="mt-4 text-[10px] text-blue-600">
                        {t("balance")}
                      </p>

                      <p className="text-lg font-bold text-slate-800">2,450</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        {t("landingSpendingOverview")}
                      </span>

                      <BarChart3 size={18} className="text-blue-600" />
                    </div>

                    <div className="mt-8 flex h-44 items-end gap-3">
                      {[30, 55, 42, 68, 48, 82, 58, 76, 64, 90].map(
                        (height, index) => (
                          <motion.div
                            key={index}
                            initial={{
                              height: 0,
                            }}
                            whileInView={{
                              height: `${height}%`,
                            }}
                            viewport={{
                              once: true,
                            }}
                            transition={{
                              delay: index * 0.06,
                              duration: 0.6,
                            }}
                            className="flex-1 rounded-t-lg bg-blue-500"
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================================
            CTA
        ========================================================= */}

        <section className="px-6 pb-28 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-16 text-white shadow-2xl shadow-blue-600/20 md:px-14"
          >
            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
              <div>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  {t("landingCtaTitle")}
                </h2>

                <p className="mt-3 max-w-xl text-blue-100">
                  {t("landingCtaDescription")}
                </p>
              </div>

              <Link
                to="/register"
                className="group flex shrink-0 items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-blue-600 transition hover:-translate-y-1 hover:bg-blue-50"
              >
                {t("landingCreateAccount")}

                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}

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
              {t("landingFooterDescription")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("landingNavigation")}</h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <button
                onClick={() => scrollToSection("features")}
                className="block transition hover:text-white"
              >
                {t("landingFeatures")}
              </button>

              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block transition hover:text-white"
              >
                {t("landingHowItWorks")}
              </button>

              <button
                onClick={() => scrollToSection("about")}
                className="block transition hover:text-white"
              >
                {t("landingAbout")}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("landingConnect")}</h3>

            <div className="mt-4 flex gap-3">
              <a
                href="https://github.com/belguithashref/SmartBudget"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-white/5 p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <Globe size={18} /> <p Github />
              </a>

              <a
                href="https://www.linkedin.com/in/belguith-achraf-132655400/"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-white/5 p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <Globe size={18} /> <p Linkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-6 py-5 text-xs text-slate-500 sm:flex-row lg:px-8">
            <span>{t("landingCopyright")}</span>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 transition hover:text-white"
            >
              <Globe size={14} />

              {language === "en" ? t("french") : t("english")}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
