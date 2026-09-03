import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { LogOut } from "lucide-react";

import {
  LayoutDashboard,
  Wallet,
  ArrowDownToLine,
  Target,
  Settings,
} from "lucide-react";
function Layout() {
  const { t } = useLanguage();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };
  const navClass = ({ isActive }) =>
    `px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
      isActive
        ? "bg-indigo-600 text-white shadow-md"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="app-layout">
      <aside className="w-60 min-h-screen bg-gray-900 text-white px-4 py-6 flex flex-col shrink-0">
        <div className="px-3 mb-10">
          <h2 className="text-2xl font-bold tracking-tight !text-white">
            SmartBudget
          </h2>
          <div className="mt-2 h-1 w-10 rounded-full bg-indigo-500"></div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink to="/dashboard" className={navClass}>
            <LayoutDashboard size={20} />
            <span>{t("dashboard")}</span>
          </NavLink>

          <NavLink to="/expenses" className={navClass}>
            <ArrowDownToLine size={20} />
            <span>{t("expenses")}</span>
          </NavLink>

          <NavLink to="/income" className={navClass}>
            <Wallet size={20} />
            <span>{t("income")}</span>
          </NavLink>

          <NavLink to="/budgets" className={navClass}>
            <Target size={20} />
            <span>{t("budgets")}</span>
          </NavLink>

          <NavLink to="/settings" className={navClass}>
            <Settings size={20} />
            <span>{t("settings")}</span>
          </NavLink>
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} />
          <span>{t("logout")}</span>
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
