import "./SpendingView.css";
import React from "react";
const severityNotNumber = "not-number";
const severityNormal = "normal";
const severityWarning = "warning";
const severityOver = "over";

function SpendingView(props) {
  const currentSpending = props.currentSpending;
  const spendingLimits = props.spendingLimits;
  const annualBudget = props.annualBudget;
  if (!currentSpending) {
    return <p>No data...</p>;
  }
  if (!spendingLimits) {
    return <p>No data...</p>;
  }
  if (!annualBudget) {
    return <p>No data...</p>;
  }
  console.log(currentSpending);
  console.log(spendingLimits);
  console.log(annualBudget);
  const otherTotal = calculateOtherTotal(currentSpending, spendingLimits);

  const headerRow = makeRow(
    "Category",
    "Amount",
    "Limit",
    ["SpendingView-header"],
    false
  );
  const plannedSpendingHeaderRow = makeRow(
    "",
    "Planned Spending",
    "",
    ["SpendingView-header"],
    false
  );
  const unplannedSpendingHeaderRow = makeRow(
    "",
    "Unplanned Spending",
    "",
    ["SpendingView-header"],
    false
  );

  const totalRow = makeRow(
    "Total",
    currentSpending["Total"],
    spendingLimits["Total"],
    ["SpendingView-header"],
    true
  );
  const otherRow = makeRow(
    "Unplanned",
    otherTotal + "",
    spendingLimits["Other"],
    [],
    true
  );
  var plannedRows = [];
  for (const key in spendingLimits) {
    if (key === "Total") {
      continue;
    }
    if (key === "Other") {
      continue;
    }
    const limit = spendingLimits[key] ? spendingLimits[key] : "";
    plannedRows.push(makeRow(key, currentSpending[key], limit, [], true));
  }
  var unplannedRows = [];
  for (const key in currentSpending) {
    if (spendingLimits[key]) {
      continue;
    }
    const limit = spendingLimits[key] ? spendingLimits[key] : "";
    unplannedRows.push(makeRow(key, currentSpending[key], limit, [], true));
  }
  return (
    <div className="SpendingView-container">
      <div>
        {[headerRow, plannedSpendingHeaderRow, totalRow, otherRow]
          .concat(plannedRows)
          .concat([unplannedSpendingHeaderRow])
          .concat(unplannedRows)}
      </div>
      <div>{annualBudgetView(annualBudget)}</div>
    </div>
  );
}

function makeRow(category, amount, limit, additionalClasses, numberRow) {
  amount = amount ? amount : 0.0;
  const key = category ? category : amount;
  const amountNum = amount;
  const limitNum = limit;
  const amountPrefix = numberRow ? "$" : "";
  const limitPrefix = numberRow && limit ? "$" : "";
  const severity =
    isNaN(amountNum) || isNaN(limitNum)
      ? severityNotNumber
      : calculateSeverity(amountNum, limitNum);
  const amountClasses = [
    isNaN(amountNum) ? "" : "SpendingView-number",
    severityClass(severity),
  ];
  const limitClasses = [isNaN(limitNum) ? "" : "SpendingView-number"];
  const amountFormatted =
    amountPrefix + (Number.isFinite(amountNum) ? amountNum.toFixed(2) : amount);
  const limitFormatted =
    limitPrefix + (Number.isFinite(limitNum) ? limitNum.toFixed(2) : limit);
  return (
    <div key={key} className="SpendingView-row">
      <label
        className={["SpendingView-category"]
          .concat(additionalClasses)
          .join(" ")}
      >
        {category}
      </label>
      <label
        className={["SpendingView-amount"]
          .concat(additionalClasses)
          .concat(amountClasses)
          .join(" ")}
      >
        {amountFormatted}
      </label>
      <label
        className={["SpendingView-limit"]
          .concat(additionalClasses)
          .concat(limitClasses)
          .join(" ")}
      >
        {limitFormatted}
      </label>
    </div>
  );
}

function severityClass(severity) {
  return `SpendingView-${severity}`;
}

function calculateSeverity(amount, limit) {
  const percentage = amount / limit;
  if (0.75 <= percentage && percentage <= 1) {
    return severityWarning;
  }
  if (percentage > 1) {
    return severityOver;
  }
  return severityNormal;
}

function calculateOtherTotal(currentSpending, spendingLimits) {
  var sum = 0;
  for (const key in currentSpending) {
    if (spendingLimits[key]) {
      continue;
    }
    sum += currentSpending[key];
  }
  return sum.toFixed(2);
}

function annualBudgetView(annualLimits) {
  return (
    <div>
      <h3>
        <b>Annual Budget</b>
      </h3>
      <p>This year we have spent {"$" + annualLimits["Total"].toFixed(2)}</p>
      <p>
        For a $30k budget, we can have {"$" + annualLimits["30k"].toFixed(2)} of
        unplanned spending each month.
      </p>
      <p>
        For a $35k budget, we can have {"$" + annualLimits["35k"].toFixed(2)} of
        unplanned spending each month.
      </p>
      <p>
        For a $40k budget, we can have {"$" + annualLimits["40k"].toFixed(2)} of
        unplanned spending each month.
      </p>
    </div>
  );
}

export default SpendingView;
