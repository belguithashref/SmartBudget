import { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import "./Budget.css";
import { apiFetch } from "../api";

function Budgets() {
  const { t } = useLanguage();

  const [budgets, setBudgets] = useState([]);
  const [budgetProgress, setBudgetProgress] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage(t("notLoggedIn"));
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch("/budgets", {
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
              : t("failedToLoadBudgets"),
          );
          setLoading(false);
          return;
        }

        setBudgets(data);

        // Get progress for every budget
        const progressData = {};

        for (const budget of data) {
          const progressResponse = await apiFetch(
            `/budgets/${budget.id}/progress`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const progress = await progressResponse.json();

          if (progressResponse.ok) {
            progressData[budget.id] = progress;
          }
        }

        setBudgetProgress(progressData);
      } catch {
        setMessage(t("couldNotConnect"));
      }

      setLoading(false);
    };

    fetchBudgets();
  }, [t]);

  const handleCreateBudget = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(t("notLoggedIn"));
      return;
    }

    try {
      const response = await apiFetch("/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          month: Number(month),
          year: Number(year),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data.detail === "string"
            ? data.detail
            : t("failedToCreateBudget"),
        );
        return;
      }

      setBudgets((currentBudgets) => [...currentBudgets, data]);

      // Get progress for the new budget
      const progressResponse = await apiFetch(`/budgets/${data.id}/progress`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const progressData = await progressResponse.json();

      if (progressResponse.ok) {
        setBudgetProgress((currentProgress) => ({
          ...currentProgress,
          [data.id]: progressData,
        }));
      }

      setAmount("");
      setMonth("");
      setYear("");

      setMessage(t("budgetCreated"));
    } catch {
      setMessage(t("couldNotConnect"));
    }
  };

  const handleUpdateBudget = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(t("notLoggedIn"));
      return;
    }

    try {
      const response = await apiFetch(`/budgets/${editingBudget.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          month: Number(month),
          year: Number(year),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data.detail === "string"
            ? data.detail
            : t("failedToUpdateBudget"),
        );
        return;
      }

      setBudgets((currentBudgets) =>
        currentBudgets.map((budget) => (budget.id === data.id ? data : budget)),
      );

      // Refresh progress for the updated budget
      const progressResponse = await apiFetch(`/budgets/${data.id}/progress`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const progressData = await progressResponse.json();

      if (progressResponse.ok) {
        setBudgetProgress((currentProgress) => ({
          ...currentProgress,
          [data.id]: progressData,
        }));
      }

      setAmount("");
      setMonth("");
      setYear("");
      setEditingBudget(null);

      setMessage(t("budgetUpdated"));
    } catch {
      setMessage(t("couldNotConnect"));
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(t("notLoggedIn"));
      return;
    }

    try {
      const response = await apiFetch(`/budgets/${budgetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data.detail === "string"
            ? data.detail
            : t("failedToDeleteBudget"),
        );
        return;
      }

      setBudgets((currentBudgets) =>
        currentBudgets.filter((budget) => budget.id !== budgetId),
      );

      setBudgetProgress((currentProgress) => {
        const updatedProgress = { ...currentProgress };
        delete updatedProgress[budgetId];
        return updatedProgress;
      });

      setMessage(t("budgetDeleted"));
    } catch {
      setMessage(t("couldNotConnect"));
    }
  };

  const startEditing = (budget) => {
    setEditingBudget(budget);
    setAmount(budget.amount);
    setMonth(budget.month);
    setYear(budget.year);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEditing = () => {
    setEditingBudget(null);
    setAmount("");
    setMonth("");
    setYear("");
  };

  if (loading) {
    return <p>{t("loading")}</p>;
  }

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <p className="page-title">{t("SmartBudget")}</p>
          <h1>{t("budgets")}</h1>
          <p className="page-subtitle">{t("manageBudgets")}</p>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      {/* Add / Update Budget */}
      <div className="card budget-form-card">
        <h2>{editingBudget ? t("updateBudget") : t("addBudget")}</h2>

        <form
          className="form-grid"
          onSubmit={editingBudget ? handleUpdateBudget : handleCreateBudget}
        >
          <div className="form-group">
            <label>{t("amount1")}</label>

            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("month")}</label>

            <select
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              required
            >
              <option value="">{t("selectMonth")}</option>
              <option value="1">{t("january")}</option>
              <option value="2">{t("february")}</option>
              <option value="3">{t("march")}</option>
              <option value="4">{t("april")}</option>
              <option value="5">{t("may")}</option>
              <option value="6">{t("june")}</option>
              <option value="7">{t("july")}</option>
              <option value="8">{t("august")}</option>
              <option value="9">{t("september")}</option>
              <option value="10">{t("october")}</option>
              <option value="11">{t("november")}</option>
              <option value="12">{t("december")}</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t("year")}</label>

            <input
              type="number"
              min="2000"
              max="2100"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button className="primary-button" type="submit">
              {editingBudget ? t("updateBudget") : t("addBudget")}
            </button>

            {editingBudget && (
              <button
                className="secondary-button"
                type="button"
                onClick={cancelEditing}
              >
                {t("cancel")}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Budget List */}
      {budgets.length === 0 ? (
        <div className="card empty-state">
          <p>{t("noBudgets")}</p>
        </div>
      ) : (
        <div className="budget-list">
          {budgets.map((budget) => {
            const progress = budgetProgress[budget.id];

            return (
              <div className="budget-card" key={budget.id}>
                <div className="budget-header">
                  <h3>
                    {
                      [
                        t("january"),
                        t("february"),
                        t("march"),
                        t("april"),
                        t("may"),
                        t("june"),
                        t("july"),
                        t("august"),
                        t("september"),
                        t("october"),
                        t("november"),
                        t("december"),
                      ][budget.month - 1]
                    }{" "}
                    {budget.year}
                  </h3>

                  <div className="budget-amount">
                    {Number(budget.amount).toFixed(2)} TND
                  </div>
                </div>

                {progress && (
                  <>
                    <div className="budget-details">
                      <div className="budget-detail">
                        <span>{t("used")}</span>
                        <strong>{Number(progress.spent).toFixed(2)} TND</strong>
                      </div>

                      <div className="budget-detail">
                        <span>{t("remaining")}</span>
                        <strong>
                          {Number(progress.remaining).toFixed(2)} TND
                        </strong>
                      </div>
                    </div>

                    <div className="budget-percentage">
                      <span>{t("used")}</span>

                      <strong>
                        {Number(progress.percentage_used).toFixed(2)}%
                      </strong>
                    </div>

                    <div className="budget-progress">
                      <div
                        className={`budget-progress-bar ${progress.status}`}
                        style={{
                          width: `${Math.min(progress.percentage_used, 100)}%`,
                        }}
                      ></div>
                    </div>

                    <p className={`budget-status ${progress.status}`}>
                      {t("status")}:{" "}
                      {progress.status === "on_track"
                        ? t("budgetOnTrack")
                        : progress.status === "warning"
                          ? t("budgetWarning")
                          : t("budgetExceeded")}
                    </p>
                  </>
                )}

                <div className="budget-actions">
                  <button
                    className="edit-button"
                    type="button"
                    onClick={() => startEditing(budget)}
                  >
                    {t("edit")}
                  </button>

                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => handleDeleteBudget(budget.id)}
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Budgets;
