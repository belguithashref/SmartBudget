import { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import "../styles/Expenses.css";
import { apiFetch } from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Expenses() {
  const { t } = useLanguage();

  const [expenses, setExpenses] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [categorySummary, setCategorySummary] = useState({});
  const [message, setMessage] = useState("");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState({});

  const [loading, setLoading] = useState(true);

  const categoryChartData = Object.entries(categorySummary).map(
    ([category, amount]) => ({
      name: category,
      value: Number(amount),
    }),
  );

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage(t("notLoggedIn"));
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch("/expenses", {
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
              : t("failedToLoadExpenses"),
          );
          setLoading(false);
          return;
        }

        setExpenses(data);

        // Expense summary
        const summaryResponse = await apiFetch("/expenses/summary", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const summaryData = await summaryResponse.json();

        if (summaryResponse.ok) {
          setExpenseSummary(summaryData);
        }

        // Category summary
        const categoryResponse = await apiFetch(
          "/expenses/summary/categories",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const categoryData = await categoryResponse.json();

        if (categoryResponse.ok) {
          setCategorySummary(categoryData);
        }

        // Monthly summary
        const monthlyResponse = await apiFetch("/expenses/summary/monthly", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const monthlyData = await monthlyResponse.json();

        if (monthlyResponse.ok) {
          setMonthlySummary(monthlyData);
        }
      } catch {
        setMessage(t("couldNotConnect"));
      }

      setLoading(false);
    };

    fetchExpenses();
  }, [t]);

  const refreshSummary = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      // Refresh expense summary
      const summaryResponse = await apiFetch("/expenses/summary", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const summaryData = await summaryResponse.json();

      if (summaryResponse.ok) {
        setExpenseSummary(summaryData);
      }

      // Refresh category summary
      const categoryResponse = await apiFetch("/expenses/summary/categories", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const categoryData = await categoryResponse.json();

      if (categoryResponse.ok) {
        setCategorySummary(categoryData);
      }

      // Refresh monthly summary
      const monthlyResponse = await apiFetch("/expenses/summary/monthly", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const monthlyData = await monthlyResponse.json();

      if (monthlyResponse.ok) {
        setMonthlySummary(monthlyData);
      }
    } catch {
      // Main operation already succeeded.
    }
  };

  const handleCreateExpense = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(t("notLoggedIn"));
      return;
    }

    try {
      const response = await apiFetch("/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          category: category,
          description: description,
          expense_date: expenseDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data.detail === "string"
            ? data.detail
            : t("failedToCreateExpense"),
        );
        return;
      }

      setExpenses((currentExpenses) => [...currentExpenses, data]);

      setDescription("");
      setAmount("");
      setCategory("");
      setExpenseDate("");

      setMessage(t("expenseCreated"));

      await refreshSummary();
    } catch {
      setMessage(t("couldNotConnect"));
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(t("notLoggedIn"));
      return;
    }

    try {
      const response = await apiFetch(`/expenses/${expenseId}`, {
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
            : t("failedToDeleteExpense"),
        );
        return;
      }

      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== expenseId),
      );

      setMessage(t("expenseDeleted"));

      await refreshSummary();
    } catch {
      setMessage(t("couldNotConnect"));
    }
  };

  const handleUpdateExpense = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(t("notLoggedIn"));
      return;
    }

    try {
      const response = await apiFetch(`/expenses/${editingExpense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          category: category,
          description: description,
          expense_date: expenseDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data.detail === "string"
            ? data.detail
            : t("failedToUpdateExpense"),
        );
        return;
      }

      setExpenses((currentExpenses) =>
        currentExpenses.map((expense) =>
          expense.id === data.id ? data : expense,
        ),
      );

      setDescription("");
      setAmount("");
      setCategory("");
      setExpenseDate("");
      setEditingExpense(null);

      setMessage(t("expenseUpdated"));

      await refreshSummary();
    } catch {
      setMessage(t("couldNotConnect"));
    }
  };

  const cancelEdit = () => {
    setEditingExpense(null);
    setDescription("");
    setAmount("");
    setCategory("");
    setExpenseDate("");
  };

  if (loading) {
    return (
      <div className="expenses-page">
        <div className="expenses-loading">
          <div className="loading-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expenses-page">
      <div className="expenses-container">
        {/* Page Header */}
        <div className="expenses-header">
          <div>
            <p className="page-label">SmartBudget</p>
            <h1>{t("expenses")}</h1>
            <p className="page-description">{t("myExpenses")}</p>
          </div>
        </div>

        {/* Message */}
        {message && <div className="expenses-message">{message}</div>}

        {/* Summary Cards */}
        {expenseSummary && (
          <section className="summary-section">
            <h2>{t("expenseSummary")}</h2>

            <div className="summary-grid">
              <div className="summary-card">
                <span className="summary-label">{t("totalExpenses")}</span>
                <span className="summary-value">
                  {Number(expenseSummary.total_expenses).toFixed(2)} TND
                </span>
              </div>

              <div className="summary-card">
                <span className="summary-label">{t("expenseCount")}</span>
                <span className="summary-value">
                  {expenseSummary.expense_count}
                </span>
              </div>

              <div className="summary-card">
                <span className="summary-label">{t("averageExpense")}</span>
                <span className="summary-value">
                  {Number(expenseSummary.average_expense).toFixed(2)} TND
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Category + Monthly summaries */}
        <div className="analytics-grid">
          {/* Category Summary */}
          <section className="dashboard-card">
            {/* Spending By Category */}

            <div className="card category-chart-card">
              <h2>{t("categorySummary")}</h2>

              {categoryChartData.length === 0 ? (
                <p className="empty-state">{t("noCategoryExpenses")}</p>
              ) : (
                <div className="category-chart">
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              [
                                "#6366f1",
                                "#22c55e",
                                "#f59e0b",
                                "#ef4444",
                                "#06b6d4",
                                "#a855f7",
                                "#ec4899",
                                "#84cc16",
                              ][index % 8]
                            }
                          />
                        ))}
                      </Pie>

                      <Tooltip formatter={(value) => `${value} TND`} />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {Object.keys(categorySummary).length === 0 ? (
              <p className="empty-message">{t("noCategoryExpenses")}</p>
            ) : (
              <div className="category-list">
                {Object.entries(categorySummary).map(
                  ([categoryName, total]) => (
                    <div className="category-row" key={categoryName}>
                      <span>{categoryName}</span>
                      <strong>{Number(total).toFixed(2)} TND</strong>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          {/* Monthly Summary */}
          <section className="dashboard-card">
            <div className="card-header">
              <h2>{t("monthlyExpenseSummary")}</h2>
            </div>

            {Object.keys(monthlySummary).length === 0 ? (
              <p className="empty-message">{t("noMonthlyExpenses")}</p>
            ) : (
              <div className="monthly-list">
                {Object.entries(monthlySummary).map(([month, total]) => (
                  <div className="monthly-row" key={month}>
                    <span>{month}</span>
                    <strong>{Number(total).toFixed(2)} TND</strong>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Add / Update Expense */}
        <section className="expense-form-card">
          <div className="card-header">
            <div>
              <h2>{editingExpense ? t("updateExpense") : t("addExpense")}</h2>
              <p>{editingExpense ? t("updateExpense") : t("addExpense")}</p>
            </div>
          </div>

          <form
            className="expense-form"
            onSubmit={
              editingExpense ? handleUpdateExpense : handleCreateExpense
            }
          >
            <div className="form-group">
              <label>{t("description")}</label>
              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={t("description")}
                required
              />
            </div>

            <div className="form-group">
              <label>{t("amount")}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label>{t("category")}</label>
              <input
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder={t("category")}
                required
              />
            </div>

            <div className="form-group">
              <label>{t("date")}</label>
              <input
                type="date"
                value={expenseDate}
                onChange={(event) => setExpenseDate(event.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <button className="primary-button" type="submit">
                {editingExpense ? t("updateExpense") : t("addExpense")}
              </button>

              {editingExpense && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={cancelEdit}
                >
                  {t("cancel")}
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Expense List */}
        <section className="expense-list-section">
          <div className="section-title">
            <h2>{t("myExpenses")}</h2>
            <span className="expense-count">{expenses.length}</span>
          </div>

          {expenses.length === 0 ? (
            <div className="empty-expenses">
              <p>{t("noExpenses")}</p>
            </div>
          ) : (
            <div className="expense-list">
              {expenses.map((expense) => (
                <div className="expense-item" key={expense.id}>
                  <div className="expense-main">
                    <div className="expense-icon">
                      {expense.category
                        ? expense.category.charAt(0).toUpperCase()
                        : "E"}
                    </div>

                    <div className="expense-info">
                      <h3>{expense.description}</h3>

                      <div className="expense-meta">
                        <span>{expense.category}</span>
                        <span>•</span>
                        <span>{expense.expense_date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="expense-right">
                    <strong className="expense-amount">
                      {Number(expense.amount).toFixed(2)} TND
                    </strong>

                    <div className="expense-actions">
                      <button
                        className="edit-button"
                        type="button"
                        onClick={() => {
                          setEditingExpense(expense);
                          setDescription(expense.description);
                          setAmount(expense.amount);
                          setCategory(expense.category);
                          setExpenseDate(expense.expense_date);
                        }}
                      >
                        {t("edit")}
                      </button>

                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Expenses;
