import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { useState } from "react";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Wallet,
  ArrowDownToLine,
  Target,
  Settings,
} from "lucide-react";

function Layout() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const handleNavigation = () => {
    setSidebarOpen(false);
  };

  const navClass = ({ isActive }) =>
    `px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
      isActive
        ? "bg-indigo-600 text-white shadow-md"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="mobile-menu-button"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <h2 className="mobile-logo">SmartBudget</h2>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="px-3 mb-10">
            <h2 className="text-2xl font-bold tracking-tight !text-white">
              SmartBudget
            </h2>
            <div className="mt-2 h-1 w-10 rounded-full bg-indigo-500"></div>
          </div>

          {/* Close button - mobile only */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="mobile-close-button"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            className={navClass}
            onClick={handleNavigation}
          >
            <LayoutDashboard size={20} />
            <span>{t("dashboard")}</span>
          </NavLink>

          <NavLink
            to="/expenses"
            className={navClass}
            onClick={handleNavigation}
          >
            <ArrowDownToLine size={20} />
            <span>{t("expenses")}</span>
          </NavLink>

          <NavLink to="/income" className={navClass} onClick={handleNavigation}>
            <Wallet size={20} />
            <span>{t("income")}</span>
          </NavLink>

          <NavLink
            to="/budgets"
            className={navClass}
            onClick={handleNavigation}
          >
            <Target size={20} />
            <span>{t("budgets")}</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={navClass}
            onClick={handleNavigation}
          >
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
