import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import {
  Add,
  AutoAwesome,
  Bolt,
  CalendarMonth,
  CleaningServices,
  Close,
  Dashboard as DashboardIcon,
  Delete,
  EditOutlined,
  FilterList,
  Help,
  Home,
  LocalGasStation,
  MoreVert,
  NotificationsNone,
  Payments,
  QueryStats,
  Receipt,
  ReceiptLong,
  Refresh,
  Savings,
  Search,
  Settings,
  ShoppingBagOutlined,
  TrendingUp,
  Wallet,
} from "@mui/icons-material";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const monthlyBudget = 50000;
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = `${currentYear}-${String(
  currentDate.getMonth() + 1
).padStart(2, "0")}`;

const initialTransactions = [
  {
    id: 1,
    title: "Whole Foods Market",
    amount: 1425,
    category: "Groceries",
    date: `${currentMonth}-12`,
  },
  {
    id: 2,
    title: "Shell Gas Station",
    amount: 550,
    category: "Transport",
    date: `${currentMonth}-11`,
  },
  {
    id: 3,
    title: "Electric Utility",
    amount: 1800,
    category: "Utilities",
    date: `${currentMonth}-10`,
  },
  {
    id: 4,
    title: "Monthly Rent",
    amount: 18500,
    category: "Housing",
    date: `${currentMonth}-03`,
  },
];

const months = Array.from({ length: 12 }, (_, index) => {
  const date = new Date(currentYear, index, 1);

  return {
    value: `${currentYear}-${String(index + 1).padStart(2, "0")}`,
    label: new Intl.DateTimeFormat("en-IN", {
      month: "short",
      year: "numeric",
    }).format(date),
  };
});

const themeOptions = [
  { id: "default", label: "Default" },
  { id: "lavender", label: "Lavender" },
  { id: "sunset", label: "Sunset" },
  { id: "forest", label: "Forest" },
  { id: "dark", label: "Dark" },
];

const categoryColors = {
  Housing: "#007f5f",
  Groceries: "#3b82f6",
  Transport: "#f59e0b",
  Utilities: "#8b5cf6",
  Dining: "#ef4444",
  dining: "#ef4444",
  Food: "#10b981",
  Travel: "#ec4899",
  Shopping: "#06b6d4",
  Other: "#64748b",
};

const transactionIcons = {
  Housing: Home,
  Groceries: ShoppingBagOutlined,
  Transport: LocalGasStation,
  Utilities: Bolt,
  Dining: ReceiptLong,
  Shopping: ShoppingBagOutlined,
  Other: ReceiptLong,
};

const navigation = [
  { label: "Dashboard", icon: DashboardIcon, target: "dashboard" },
  { label: "Expenses", icon: Payments, target: "expenses" },
  { label: "Analytics", icon: QueryStats, target: "analytics" },
  { label: "AI Insights", icon: AutoAwesome, target: "insights" },
  { label: "Settings", icon: Settings, target: "settings" },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDisplayDate = (dateValue) => {
  if (!dateValue) return "Today";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateValue}T00:00:00`));
};

const emptyForm = {
  title: "",
  amount: "",
  category: "Groceries",
  date: "",
};

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("fintrack_budget");
    return saved ? Number(saved) : 50000;
  });
  const [budgetDraft, setBudgetDraft] = useState(() => {
    const saved = localStorage.getItem("fintrack_budget");
    return saved ? String(saved) : "50000";
  });
  const [isBudgetEditing, setIsBudgetEditing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("fintrack_theme");
    return saved || "default";
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expenseForm, setExpenseForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeSection, setActiveSection] = useState("Dashboard");

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2800);
  };

  // Save budget to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("fintrack_budget", String(budget));
  }, [budget]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("fintrack_theme", theme);
  }, [theme]);

  // Fetch expenses from backend
  const fetchExpensesFromBackend = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      console.log("Fetching expenses from backend...");
      const response = await axios.get("http://127.0.0.1:8000/expenses");
      console.log("Backend response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        console.log("Setting transactions:", response.data);
        setTransactions(response.data);
        setLoadError(null);
        console.log("Total expenses loaded:", response.data.length);
      } else {
        console.warn("Response data is not an array:", response.data);
        setLoadError("Invalid data format from server");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response?.data);
      setLoadError("Failed to load expenses: " + (error.message || "Unknown error"));
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch expenses from backend on component mount
  useEffect(() => {
    fetchExpensesFromBackend();
  }, []);

  const monthlyTransactions = transactions.filter((transaction) =>
    transaction.date.startsWith(selectedMonth)
  );

  const totalExpenses = monthlyTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const remainingBudget = budget - totalExpenses;
  const budgetUsed = budget
    ? Math.min((totalExpenses / budget) * 100, 100)
    : 0;

  const categories = useMemo(() => {
    const totals = monthlyTransactions.reduce((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || categoryColors.Other,
    }));
  }, [monthlyTransactions]);

  const highestCategory = categories.reduce(
    (max, category) => (category.value > max.value ? category : max),
    { name: "None", value: 0 }
  );

  const filteredTransactions = monthlyTransactions.filter((transaction) => {
    const matchesSearch = transaction.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || transaction.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = [
    {
      label: "Monthly Budget",
      value: formatCurrency(budget),
      helper: "Editable monthly limit",
      tone: "green",
      icon: Wallet,
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      helper: `${monthlyTransactions.length} transactions this month`,
      tone: "red",
      icon: ReceiptLong,
    },
    {
      label: "Remaining Budget",
      value: formatCurrency(remainingBudget),
      helper: remainingBudget >= 0 ? "On track for savings" : "Budget exceeded",
      tone: "blue",
      icon: Savings,
    },
    {
      label: "Budget Usage",
      value: `${budgetUsed.toFixed(1)}%`,
      helper: budgetUsed > 90 ? "Slow down spending" : "Spending pace is healthy",
      tone: "orange",
      icon: QueryStats,
      progress: budgetUsed,
    },
  ];

  const scrollToSection = (item) => {
    setActiveSection(item.label);
    document.getElementById(item.target)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    setExpenseForm({
      ...emptyForm,
      date: `${selectedMonth}-01`,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingId(transaction.id);
    setExpenseForm({
      title: transaction.title,
      amount: String(transaction.amount),
      category: transaction.category,
      date: transaction.date,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setExpenseForm(emptyForm);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setExpenseForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const saveExpense = async (event) => {
    event.preventDefault();

    const amountNumber = Number(expenseForm.amount);
    if (!expenseForm.title.trim() || !amountNumber || amountNumber <= 0) {
      showMessage("Enter a valid title and amount.");
      return;
    }

    if (!expenseForm.date) {
      showMessage("Please select a date.");
      return;
    }

    const expenseData = {
      title: expenseForm.title.trim(),
      amount: amountNumber,
      category: expenseForm.category,
      date: expenseForm.date,
    };

    try {
      if (editingId) {
        // Update existing expense
        const response = await axios.put(
          `http://127.0.0.1:8000/expenses/${editingId}`,
          expenseData
        );

        if (response.data.error) {
          showMessage("Error updating expense: " + response.data.error);
          return;
        }

        // Refetch all expenses to ensure data consistency
        await fetchExpensesFromBackend();
        closeModal();
        showMessage("Expense updated successfully.");
      } else {
        // Create new expense
        const response = await axios.post(
          "http://127.0.0.1:8000/expenses",
          expenseData
        );

        if (response.data.error) {
          showMessage("Error adding expense: " + response.data.error);
          return;
        }

        // Refetch all expenses from server to ensure consistency
        await fetchExpensesFromBackend();
        closeModal();
        showMessage("Your expense has been added.");
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      showMessage(
        "Error saving expense: " +
          (error.response?.data?.error || error.message || "Unknown error")
      );
    }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/expenses/${id}`);

      if (response.data.error) {
        showMessage("Error deleting expense: " + response.data.error);
        return;
      }

      // Refetch all expenses to ensure data consistency
      await fetchExpensesFromBackend();
      showMessage("Expense deleted successfully.");
    } catch (error) {
      console.error("Error deleting expense:", error);
      showMessage(
        "Error deleting expense: " +
          (error.response?.data?.error || error.message || "Unknown error")
      );
    }
  };

  const saveBudget = (event) => {
    event.preventDefault();
    const nextBudget = Number(budgetDraft);

    if (!nextBudget || nextBudget <= 0) {
      showMessage("Enter a valid budget amount.");
      return;
    }

    setBudget(nextBudget);
    setIsBudgetEditing(false);
    showMessage("Monthly budget updated.");
  };

  const downloadReport = () => {
    const selectedMonthLabel =
      months.find((month) => month.value === selectedMonth)?.label ||
      selectedMonth;
    const report = [
      "FinTrack AI Expense Report",
      `Month: ${selectedMonthLabel}`,
      `Monthly Budget: ${formatCurrency(budget)}`,
      `Total Expenses: ${formatCurrency(totalExpenses)}`,
      `Remaining Budget: ${formatCurrency(remainingBudget)}`,
      "",
      ...monthlyTransactions.map(
        (transaction) =>
          `${formatDisplayDate(transaction.date)} - ${transaction.title} - ${
            transaction.category
          } - ${formatCurrency(transaction.amount)}`
      ),
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fintrack-report.txt";
    link.click();
    URL.revokeObjectURL(url);
    showMessage("Report downloaded.");
  };

  return (
    <div className={`app-shell theme-${theme}`}>
      <aside className="sidebar">
        <div>
          <div className="brand">
            <h1>FinTrack AI</h1>
            <p>Smart Finance Expense Tracker</p>
          </div>

          <nav className="nav-list" aria-label="Primary navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className={`nav-item ${
                    activeSection === item.label ? "active" : ""
                  }`}
                  key={item.label}
                  type="button"
                  onClick={() => scrollToSection(item)}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="upgrade-box">
          <span>Upgrade to Pro</span>
          <button type="button" onClick={() => showMessage("Premium coming soon.")}>
            Go Premium
          </button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <label className="search-box">
            <Search />
            <input
              type="search"
              placeholder="Search transactions..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="top-actions">
            <button
              className="icon-button"
              type="button"
              aria-label="Refresh data"
              title="Refresh expenses from server"
              onClick={() => {
                fetchExpensesFromBackend();
                showMessage("Refreshing data from server...");
              }}
              disabled={loading}
            >
              <Refresh />
            </button>
            <button
              className="icon-button has-alert"
              type="button"
              aria-label="Notifications"
              onClick={() => showMessage("No new notifications.")}
            >
              <NotificationsNone />
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label="Help"
              onClick={() => showMessage("Use + to add, pencil to edit, bin to delete.")}
            >
              <Help />
            </button>
            <button
              className="avatar"
              type="button"
              aria-label="User profile"
              onClick={() => showMessage("Profile page coming soon.")}
            >
              AI
            </button>
          </div>
        </header>

        {loadError && (
          <div style={{
            padding: "12px 20px",
            backgroundColor: "#fee2e2",
            borderBottom: "1px solid #fecaca",
            color: "#991b1b",
            fontSize: "14px"
          }}>
            ⚠️ {loadError}
          </div>
        )}

        <main className="dashboard-content">
          <section className="page-heading" id="dashboard">
            <div>
              <h2>Dashboard Overview</h2>
              <p>Real-time spending analysis and budget tracking</p>
            </div>

            <div className="heading-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={downloadReport}
              >
                Download Report
              </button>
              <label className="period-select">
                <CalendarMonth />
                <select
                  value={selectedMonth}
                  onChange={(event) => {
                    setSelectedMonth(event.target.value);
                    setSearch("");
                    setCategoryFilter("All");
                    showMessage("Month changed.");
                  }}
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="stats-grid" aria-label="Budget overview">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article className="stat-card" key={stat.label}>
                  <div className="stat-card-header">
                    <span>{stat.label}</span>
                    <div className={`stat-icon ${stat.tone}`}>
                      <Icon />
                    </div>
                  </div>
                  <strong>{stat.value}</strong>
                  {stat.label === "Monthly Budget" ? (
                    <div className="budget-card-editor">
                      {isBudgetEditing ? (
                        <form onSubmit={saveBudget}>
                          <input
                            type="number"
                            min="1"
                            value={budgetDraft}
                            onChange={(event) => setBudgetDraft(event.target.value)}
                            aria-label="Monthly budget"
                          />
                          <button type="submit">Save</button>
                          <button
                            type="button"
                            onClick={() => {
                              setBudgetDraft(String(budget));
                              setIsBudgetEditing(false);
                            }}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setBudgetDraft(String(budget));
                            setIsBudgetEditing(true);
                          }}
                        >
                          Edit Budget
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className={stat.tone === "red" ? "muted" : "positive"}>
                      {stat.helper}
                    </p>
                  )}
                  {stat.progress !== undefined && (
                    <div className="progress-track" aria-label="Budget usage">
                      <span style={{ width: `${stat.progress}%` }} />
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          <section className="dashboard-grid" id="analytics">
            <div className="left-column">
              <article className="panel insights-panel" id="insights">
                <div className="panel-header">
                  <h3>
                    <AutoAwesome />
                    AI Spending Insights
                  </h3>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() =>
                      showMessage(`${highestCategory.name} is your top spending category.`)
                    }
                  >
                    View All Insights
                  </button>
                </div>

                <div className="insight-grid">
                  <div className="insight-card green">
                    <TrendingUp />
                    <div>
                      <h4>Budget Usage</h4>
                      <p>
                        You have used {budgetUsed.toFixed(1)}% of your monthly
                        budget so far.
                      </p>
                    </div>
                  </div>
                  <div className="insight-card blue">
                    <CleaningServices />
                    <div>
                      <h4>Smart Saving</h4>
                      <p>
                        Review recurring spends in {highestCategory.name} to
                        improve savings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="highlight-row">
                  <div className="highlight-icon">
                    <Home />
                  </div>
                  <div>
                    <h4>{highestCategory.name}</h4>
                    <p>Your highest category this month</p>
                  </div>
                  <strong>{formatCurrency(highestCategory.value)}</strong>
                </div>
              </article>

              <article className="panel transactions-panel" id="expenses">
                <div className="transactions-header">
                  <h3>Recent Transactions</h3>
                  <div className="table-tools">
                    <label>
                      <Search />
                      <input
                        type="search"
                        placeholder="Filter..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                      />
                    </label>
                    <select
                      className="category-filter"
                      value={categoryFilter}
                      onChange={(event) => setCategoryFilter(event.target.value)}
                    >
                      <option value="All">All</option>
                      {Object.keys(categoryColors).map((category) => (
                        <option value={category} key={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <button
                      className="icon-button filter-button"
                      type="button"
                      aria-label="Clear filters"
                      onClick={() => {
                        setSearch("");
                        setCategoryFilter("All");
                        showMessage("Filters cleared.");
                      }}
                    >
                      <FilterList />
                    </button>
                  </div>
                </div>

                <div className="transaction-table">
                  <div className="table-row table-head">
                    <span>Title</span>
                    <span>Amount</span>
                    <span>Category</span>
                    <span>Date</span>
                    <span>Actions</span>
                  </div>

                  {filteredTransactions.length === 0 ? (
                    <p className="empty-state">No expenses found.</p>
                  ) : (
                    filteredTransactions.map((transaction) => {
                      const Icon =
                        transactionIcons[transaction.category] || ReceiptLong;
                      return (
                        <div className="table-row" key={transaction.id}>
                          <div className="transaction-title">
                            <span className="transaction-icon">
                              <Icon />
                            </span>
                            <strong>{transaction.title}</strong>
                          </div>
                          <span className="amount">
                            -{formatCurrency(transaction.amount)}
                          </span>
                          <span className="category-pill">
                            {transaction.category}
                          </span>
                          <span className="date">
                            {formatDisplayDate(transaction.date)}
                          </span>
                          <div className="row-actions">
                            <button
                              className="action-button"
                              type="button"
                              aria-label={`Edit ${transaction.title}`}
                              onClick={() => openEditModal(transaction)}
                            >
                              <EditOutlined />
                              <span>Edit</span>
                            </button>
                            <button
                              className="action-button danger-action"
                              type="button"
                              aria-label={`Delete ${transaction.title}`}
                              onClick={() => deleteExpense(transaction.id)}
                            >
                              <Delete />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </article>
            </div>

            <aside className="panel category-panel">
              <div className="panel-header">
                <h3>Category Breakdown</h3>
                <button
                  className="icon-button"
                  type="button"
                  aria-label="More options"
                  onClick={() => showMessage("Category menu opened.")}
                >
                  <MoreVert />
                </button>
              </div>

              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="value"
                      innerRadius={58}
                      outerRadius={86}
                      stroke="none"
                    >
                      {categories.map((category) => (
                        <Cell key={category.name} fill={category.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-center">
                  <span>Spent</span>
                  <strong>{budgetUsed.toFixed(1)}%</strong>
                </div>
              </div>

              <div className="category-list">
                {categories.map((category) => (
                  <div className="category-item" key={category.name}>
                    <span style={{ background: category.color }} />
                    <p>{category.name}</p>
                    <strong>{formatCurrency(category.value)}</strong>
                  </div>
                ))}
              </div>

              <blockquote>
                "{highestCategory.name} is currently your biggest spend area.
                Watch this category for better budget control."
              </blockquote>

              <p className="optimization">
                <Bolt />
                AI Optimization Active
              </p>
            </aside>
          </section>

          <section className="panel settings-panel" id="settings">
            <div className="panel-header">
              <h3>
                <Settings />
                Settings
              </h3>
              <span className="settings-status">Workspace preferences</span>
            </div>

            <div className="settings-grid">
              <div className="settings-card">
                <div>
                  <h4>Theme</h4>
                  <p>Switch the dashboard style for demos and presentations.</p>
                </div>
                <div className="theme-options">
                  {themeOptions.map((option) => (
                    <button
                      className={theme === option.id ? "active-theme" : ""}
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setTheme(option.id);
                        showMessage(`${option.label} theme applied.`);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-card">
                <div>
                  <h4>Display</h4>
                  <p>Professional dashboard preferences for presentation.</p>
                </div>
                <label className="toggle-row">
                  <input type="checkbox" defaultChecked />
                  <span>Show AI insights</span>
                </label>
                <label className="toggle-row">
                  <input type="checkbox" defaultChecked />
                  <span>Use compact table rows</span>
                </label>
              </div>

              <div className="settings-card">
                <div>
                  <h4>Data Controls</h4>
                  <p>Quick actions for a cleaner demo workflow.</p>
                </div>
                <button
                  className="secondary-button reset-button"
                  type="button"
                  onClick={async () => {
                    try {
                      await fetchExpensesFromBackend();
                      setSelectedMonth(currentMonth);
                      showMessage("Expenses refreshed from server.");
                    } catch (error) {
                      console.error("Error refreshing data:", error);
                      showMessage("Error refreshing data.");
                    }
                  }}
                >
                  Refresh Server Data
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <button
        className="floating-action"
        type="button"
        aria-label="Add transaction"
        onClick={openAddModal}
      >
        <Add />
      </button>

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="expense-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-modal-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="expense-modal-title">
                  {editingId ? "Edit Expense" : "Add Expense"}
                </h3>
                <p>
                  {editingId
                    ? "Update this transaction."
                    : "Record a new transaction for this month."}
                </p>
              </div>
              <button type="button" aria-label="Close" onClick={closeModal}>
                <Close />
              </button>
            </div>

            <form className="expense-form" onSubmit={saveExpense}>
              <label>
                Title
                <input
                  name="title"
                  type="text"
                  placeholder="Example: Coffee, groceries, rent"
                  value={expenseForm.title}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <label>
                Amount
                <input
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={expenseForm.amount}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <label>
                Category
                <select
                  name="category"
                  value={expenseForm.category}
                  onChange={handleFormChange}
                >
                  {Object.keys(categoryColors).map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Date
                <input
                  name="date"
                  type="date"
                  value={expenseForm.date}
                  onChange={handleFormChange}
                />
              </label>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {editingId ? "Update Expense" : "Add Expense"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {message && (
        <div className="toast-message" role="status" aria-live="polite">
          {message}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
