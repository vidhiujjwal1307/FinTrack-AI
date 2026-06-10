function BudgetCards({
  budget,
  totalExpenses,
  remainingBudget,
  budgetUsedPercentage,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      <div className="card">
        <h4>Monthly Budget</h4>
        <h2>₹{budget}</h2>
      </div>

      <div className="card">
        <h4>Total Expenses</h4>
        <h2>₹{totalExpenses}</h2>
      </div>

      <div className="card">
        <h4>Remaining Budget</h4>
        <h2>₹{remainingBudget}</h2>
      </div>

      <div className="card">
        <h4>Budget Usage</h4>
        <h2>{budgetUsedPercentage}%</h2>
      </div>
    </div>
  );
}

export default BudgetCards;