import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./Dashboard.css";

import { useLanguage } from "../hooks/useLanguage";
import { apiFetch } from "../api";

function Dashboard() {
  const { t } = useLanguage();

  const [dashboard, setDashboard] = useState(
    /** @type {{
total_income: number,
total_expenses: number,
balance: number,
monthly_income: number,
monthly_expenses: number,
monthly_balance: number,
budget: {
amount: number,
spent: number,
remaining: number,
percentage_used: number,
status: string
} | null
} | null} */ (null),
  );

  const [statistics, setStatistics] = useState([]);
  const [period, setPeriod] = useState("monthly");
  const [message, setMessage] = useState("");

  // =========================
  // Dashboard data
  // =========================

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage(t("notLoggedIn"));
        return;
      }

      try {
        const response = await apiFetch("/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            typeof data.detail === "string"
              ? data.detail
              : t("failedToLoadDashboard"),
          );
          return;
        }

        setDashboard(data);
      } catch {
        setMessage(t("couldNotConnect"));
      }
    };

    fetchDashboard();
  }, [t]);

  // =========================
  // Statistics data
  // =========================

  useEffect(() => {
    const fetchStatistics = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await apiFetch(
          `/dashboard/statistics?period=${period}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        setStatistics(data);
      } catch {
        // Dashboard data already loaded.
      }
    };

    fetchStatistics();
  }, [period]);

  if (message) {
    return <p className="dashboard-message">{message}</p>;
  }

  if (!dashboard) {
    return <p className="dashboard-message">{t("loading")}</p>;
  }

  return (
    <div className="dashboard">
      {/* Header */}

      <div className="dashboard-header">
        <h1>SmartBudget</h1>
        <p>{t("dashboard")}</p>
      </div>

      {/* Balance */}

      <div className="balance-card">
        <div className="balance-label">{t("balance")}</div>

        <div className="balance-value">{dashboard.balance} TND</div>
      </div>

      {/* Income / Expenses */}

      <div className="summary-grid">
        <div className="summary-card income-card">
          <h3>{t("income")}</h3>

          <div className="summary-value">{dashboard.total_income} TND</div>
        </div>

        <div className="summary-card expense-card">
          <h3>{t("expenses")}</h3>

          <div className="summary-value">{dashboard.total_expenses} TND</div>
        </div>
      </div>

      {/* Income / Expenses Chart */}

      <div className="chart-card">
        <div className="chart-header">
          <h2>
            {t("income")} & {t("expenses")}
          </h2>

          <div className="period-selector">
            <button
              className={period === "monthly" ? "active" : ""}
              onClick={() => setPeriod("monthly")}
            >
              {t("monthly")}
            </button>

            <button
              className={period === "quarterly" ? "active" : ""}
              onClick={() => setPeriod("quarterly")}
            >
              {t("quarterly")}
            </button>

            <button
              className={period === "yearly" ? "active" : ""}
              onClick={() => setPeriod("yearly")}
            >
              {t("yearly")}
            </button>
          </div>
        </div>

        <div className="chart-container">
          {statistics.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={statistics}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="period" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="income"
                  name={t("income")}
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="expenses"
                  name={t("expenses")}
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-chart-data">{t("noData")}</p>
          )}
        </div>
      </div>

      {/* Budget */}

      <div className="budget-card">
        <div className="budget-header">
          <h2>{t("budget")}</h2>
        </div>

        {dashboard.budget !== null ? (
          <div>
            <div className="budget-summary">
              <span>
                {t("budget")}: {dashboard.budget.amount} TND
              </span>

              <strong>
                {dashboard.budget.percentage_used}% {t("used")}
              </strong>
            </div>

            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${Math.min(dashboard.budget.percentage_used, 100)}%`,
                  backgroundColor:
                    dashboard.budget.percentage_used >= 100
                      ? "#ef4444"
                      : dashboard.budget.percentage_used >= 80
                        ? "#f59e0b"
                        : "#22c55e",
                }}
              />
            </div>

            <div className="budget-details">
              <span>
                {dashboard.budget.spent} TND {t("used")}
              </span>

              <span>
                {dashboard.budget.remaining} TND {t("remaining")}
              </span>
            </div>
          </div>
        ) : (
          <p>{t("noBudget")}</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
