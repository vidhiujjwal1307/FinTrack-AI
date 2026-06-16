import { useState, useEffect } from "react";
import axios from "axios";
import BudgetCards from "./components/BudgetCards";
import Profile from "./Profile";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

function App() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");


  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const [budget, setBudget] = useState(localStorage.getItem("budget") || "");

  const [expenses, setExpenses] = useState(() => {
    try {
      const raw = localStorage.getItem("expenses");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF"
];

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/expenses"
      );

      setExpenses(response.data);
      try {
        localStorage.setItem(
          "expenses",
          JSON.stringify(response.data)
        );
      } catch (e) {
        console.log("Could not save expenses to localStorage", e);
      }
    } catch (error) {
      console.log(error);
      // If backend is unavailable, keep using localStorage data
      try {
        const raw = localStorage.getItem("expenses");
        if (raw) setExpenses(JSON.parse(raw));
      } catch (e) {
        console.log("Failed to load expenses from localStorage", e);
      }
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);
  useEffect(() => {
  localStorage.setItem("budget", budget);
}, [budget]);

  const addExpense = async () => {
  try {

    if (editingId !== null) {
      await axios.put(
        `http://127.0.0.1:8000/expenses/${editingId}`,
        {
          title,
          amount: parseFloat(amount),
          category,
          date,
        }
      );

      alert("Expense Updated!");
      setEditingId(null);

    } else {
      await axios.post(
        "http://127.0.0.1:8000/expenses",
        {
          title,
          amount: parseFloat(amount),
          category,
          date,
        }
      );

      alert("Expense Added!");
    }

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");

    fetchExpenses();

  } catch (error) {
    console.log(error);
    // Fallback: if backend is unreachable, persist change locally
    try {
      if (editingId !== null) {
        const updated = expenses.map((e) =>
          e.id === editingId
            ? {
                ...e,
                title,
                amount: parseFloat(amount),
                category,
                date,
              }
            : e
        );
        setExpenses(updated);
        localStorage.setItem("expenses", JSON.stringify(updated));
        setEditingId(null);
        alert("Expense updated locally (offline)");
      } else {
        // Create a local id using timestamp
        const newExpense = {
          id: Date.now(),
          title,
          amount: parseFloat(amount),
          category,
          date,
        };
        const updated = [...expenses, newExpense];
        setExpenses(updated);
        localStorage.setItem("expenses", JSON.stringify(updated));
        alert("Expense saved locally (offline)");
      }

      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
    } catch (e) {
      console.log("Failed to persist expense locally", e);
    }
  }
};


  // DELETE FUNCTION
  const deleteExpense = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/expenses/${id}`
      );

      alert("Expense Deleted!");

      fetchExpenses();
    } catch (error) {
      console.log(error);
      // Fallback: remove locally if backend not reachable
      try {
        const updated = expenses.filter((e) => e.id !== id);
        setExpenses(updated);
        localStorage.setItem("expenses", JSON.stringify(updated));
      } catch (e) {
        console.log("Failed to update local expenses", e);
      }
    }
  };
  const chartData = [];
  const totalAmount = expenses.reduce(
  (sum, expense) => sum + Number(expense.amount),
  0
);
const remainingBudget =
  Number(budget) - totalAmount;

const budgetUsedPercentage =
  budget > 0
    ? ((totalAmount / budget) * 100).toFixed(1)
    : 0;

expenses.forEach((expense) => {
  const existing = chartData.find(
    (item) => item.name === expense.category
  );

  if (existing) {
    existing.value += expense.amount;
  } else {
    chartData.push({
      name: expense.category,
      value: expense.amount,
    });
  }
});
if (totalAmount > 0) {
  chartData.forEach((item) => {
    item.value = Number(
      ((item.value / totalAmount) * 100).toFixed(1)
    );
  });
}
let highestCategory = "";

if (chartData.length > 0) {
  highestCategory = chartData.reduce(
    (max, item) =>
      item.value > max.value ? item : max
  ).name;
}

const highestCategoryData =
  chartData.find(
    (item) => item.name === highestCategory
  );

const highestCategoryPercentage =
  highestCategoryData
    ? highestCategoryData.value
    : 0;

  return (
    <div style={{ padding: "30px" }}>
      <h1>FinTrack AI</h1>
      <h2>Monthly Budget</h2>

<input
  type="number"
  placeholder="Enter Budget"
  value={budget}
  onChange={(e) => setBudget(e.target.value)}
/>

<br /><br />


      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <br /><br />

<input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
/>


      <br /><br />

      <button onClick={addExpense}>
        {editingId ? "Update Expense" : "Add Expense"}
      </button>

      <hr />
      <h2>Budget Overview</h2>

<BudgetCards
  budget={budget}
  totalExpenses={totalAmount}
  remainingBudget={remainingBudget}
  budgetUsedPercentage={budgetUsedPercentage}
/>
{remainingBudget < 0 && (
  <h3 style={{ color: "red" }}>
    ⚠ Budget Exceeded by ₹
    {Math.abs(remainingBudget)}
  </h3>
)}
<div
  style={{
    width: "300px",
    height: "25px",
    border: "1px solid white",
    margin: "10px auto",
  }}
>
  <div
    style={{
      width: `${Math.min(
        budgetUsedPercentage,
        100
      )}%`,
      height: "100%",
      backgroundColor: "limegreen",
    }}
  ></div>
</div>

<p>
  {budgetUsedPercentage}% Budget Used
</p>

      <h2>
        Total Expenses: ₹
        {expenses.reduce(
          (sum, expense) =>
            sum + Number(expense.amount),
          0
        )}
      </h2>

      <h2>AI Insights</h2>

{chartData.length > 0 && (
  <div>
    <p>
      Highest Spending Category:
      <strong> {highestCategory}</strong>
    </p>

    <p>
      Total Expenses: ₹{totalAmount}
    </p>

    <p>
      Budget Used: {budgetUsedPercentage}%
    </p>
    <p>
  AI Recommendation:
</p>

<p>
  {highestCategory} accounts for{" "}
  {highestCategoryPercentage}% of your
  spending.
</p>

{highestCategoryPercentage > 50 && (
  <p>
    Your spending is heavily concentrated
    in {highestCategory}. Try balancing
    expenses across categories.
  </p>
)}

{budgetUsedPercentage > 90 && (
  <p style={{ color: "orange" }}>
    ⚠ You have already used more than
    90% of your monthly budget.
  </p>
)}

{remainingBudget < 0 && (
  <p style={{ color: "red" }}>
    🚨 Immediate spending reduction is
    recommended.
  </p>
)}
  </div>
)}
{remainingBudget < 0 && (
  <p style={{ color: "red" }}>
    🚨 You have exceeded your budget.
  </p>
)}

      <h2>Expense Analytics</h2>
      {chartData.length > 0 && (
  <PieChart width={400} height={300}>
    <Pie
      data={chartData}
      dataKey="value"
      nameKey="name"
      outerRadius={100}
      label={({ value }) => `${value}%`}
    >
      {chartData.map((entry, index) => (
        <Cell
          key={index}
          fill={COLORS[index % COLORS.length]}
        />
      ))}
    </Pie>
    <Tooltip
      formatter={(value) => [`${value}%`, "Share"]}
    />

    <Legend />
  </PieChart>
)}



      <h2>Expenses List</h2>

      <input
        type="text"
        placeholder="Search Expense..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br /><br />

      <select
        value={selectedCategory}
        onChange={(e) =>
          setSelectedCategory(e.target.value)
        }
      >
        <option value="All">
          All Categories
        </option>

        <option value="Food">
          Food
        </option>

        <option value="Travel">
          Travel
        </option>

        <option value="Entertainment">
          Entertainment
        </option>

        <option value="Shopping">
          Shopping
        </option>
      </select>
      <br /><br />

<select
  value={dateFilter}
  onChange={(e) => setDateFilter(e.target.value)}
>
  <option value="All">
    All Dates
  </option>

  <option value="Today">
    Today
  </option>

  <option value="ThisMonth">
    This Month
  </option>
</select>

<br /><br />

      <br /><br />

      {expenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        expenses
          .filter((expense) =>
            expense.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          )
          .filter((expense) =>
            selectedCategory === "All"
              ? true
              : expense.category ===
                selectedCategory
          )
          .filter((expense) => {
  if (dateFilter === "All") {
    return true;
  }

  const today = new Date();
  const expenseDate = new Date(expense.date);

  if (dateFilter === "ThisMonth") {
    return (
      expenseDate.getMonth() === today.getMonth() &&
      expenseDate.getFullYear() === today.getFullYear()
    );
  }

  return true;
})
          .map((expense) => (
            <div
              key={expense.id}
              style={{
                border:
                  "1px solid gray",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>{expense.title}</h3>

              <p>
                Id : {expense.id}
              </p>

              <p>
                Amount: ₹
                {expense.amount}
              </p>

              <p>
                Category:{" "}
                {expense.category}
              </p>
              <p>
  Date: {expense.date}
</p>

              <button
                onClick={() => {
                  setEditingId(
                    expense.id
                  );
                  setTitle(
                    expense.title
                  );
                  setAmount(
                    expense.amount
                  );
                  setCategory(
                    expense.category
                  );
                  setDate(expense.date);
                }}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteExpense(
                    expense.id
                  )
                }
              >
                Delete
              </button>
            </div>
          ))
      )}
    </div>
  );
}

export default App;