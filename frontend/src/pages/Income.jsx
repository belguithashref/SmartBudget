import { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import "./income.css";
import { apiFetch } from "../api";
function Income() {
  const { t } = useLanguage();

  const [income, setIncome] = useState([]);
  const [message, setMessage] = useState("");

  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [incomeDate, setIncomeDate] = useState("");

  const [editingIncome, setEditingIncome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncome = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage(t("notLoggedIn"));
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch("/income", {
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
              : t("failedToLoadIncome"),
          );
          setLoading(false);
          return;
        }

        setIncome(data);
      } catch {
        setMessage(t("couldNotConnect"));
      }

      setLoading(false);
    };

    fetchIncome();
  }, [t]);

  const handleCreateIncome = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(t("notLoggedIn"));
      return;
    }

    try {
      const response = await apiFetch("/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          source,
          description,
          income_date: incomeDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data.detail === "string"
            ? data.detail
            : t("failedToCreateIncome"),
        );
        return;
      }

      setIncome((currentIncome) => [...currentIncome, data]);

      setAmount("");
      setSource("");
      setDescription("");
      setIncomeDate("");

      setMessage(t("incomeCreated"));
    } catch {
      setMessage(t("couldNotConnect"));
    }
  };

  const handleUpdateIncome = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(t("notLoggedIn"));
      return;
    }

    try {
      const response = await apiFetch(`/income/${editingIncome.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          source,
          description,
          income_date: incomeDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data.detail === "string"
            ? data.detail
            : t("failedToUpdateIncome"),
        );
        return;
      }

      setIncome((currentIncome) =>
        currentIncome.map((item) => (item.id === data.id ? data : item)),
      );

      setAmount("");
      setSource("");
      setDescription("");
      setIncomeDate("");
      setEditingIncome(null);

      setMessage(t("incomeUpdated"));
    } catch {
      setMessage(t("couldNotConnect"));
    }
  };

  const handleDeleteIncome = async (incomeId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(t("notLoggedIn"));
      return;
    }

    try {
      const response = await apiFetch(`/income/${incomeId}`, {
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
            : t("failedToDeleteIncome"),
        );
        return;
      }

      setIncome((currentIncome) =>
        currentIncome.filter((item) => item.id !== incomeId),
      );

      setMessage(t("incomeDeleted"));
    } catch {
      setMessage(t("couldNotConnect"));
    }
  };

  const startEditing = (item) => {
    setEditingIncome(item);
    setAmount(item.amount);
    setSource(item.source);
    setDescription(item.description);
    setIncomeDate(item.income_date);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEditing = () => {
    setEditingIncome(null);
    setAmount("");
    setSource("");
    setDescription("");
    setIncomeDate("");
  };

  const totalIncome = income.reduce(
    (total, item) => total + Number(item.amount),
    0,
  );

  if (loading) {
    return (
      <div className="page">
        <p>{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-title1">{t("SmartBudget")}</p>
          <h1>{t("income")}</h1>
          <p className="page-subtitle">{t("myIncome")}</p>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      {/* Total Income */}

      <div className="summary-card">
        <div>
          <p className="summary-label">{t("totalIncome")}</p>
          <h2>{totalIncome.toFixed(2)} TND</h2>
        </div>
      </div>

      {/* Add / Update Form */}

      <div className="card">
        <h2>{editingIncome ? t("updateIncome") : t("addIncome")}</h2>

        <form
          className="form-grid"
          onSubmit={editingIncome ? handleUpdateIncome : handleCreateIncome}
        >
          <div className="form-group">
            <label>{t("amount")}</label>

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
            <label>{t("source")}</label>

            <input
              type="text"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("description")}</label>

            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("date")}</label>

            <input
              type="date"
              value={incomeDate}
              onChange={(event) => setIncomeDate(event.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button className="primary-button" type="submit">
              {editingIncome ? t("updateIncome") : t("addIncome")}
            </button>

            {editingIncome && (
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

      {/* Income List */}

      <div className="card">
        <h2>{t("myIncome")}</h2>

        {income.length === 0 ? (
          <p className="empty-state">{t("noIncome")}</p>
        ) : (
          <div className="income-list">
            {income.map((item) => (
              <div className="income-item" key={item.id}>
                <div className="income-info">
                  <h3>{item.source}</h3>

                  <p>{item.description}</p>

                  <span>{item.income_date}</span>
                </div>

                <div className="income-right">
                  <strong>+{Number(item.amount).toFixed(2)} TND</strong>

                  <div className="item-actions">
                    <button
                      className="edit-button"
                      type="button"
                      onClick={() => startEditing(item)}
                    >
                      {t("edit")}
                    </button>

                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => handleDeleteIncome(item.id)}
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Income;
