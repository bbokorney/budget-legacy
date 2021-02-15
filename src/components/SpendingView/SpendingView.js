import "./SpendingView.css";
import React from "react";
import { FormatDollarAmount } from "../../utils/formatting.js";
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
  const otherTotal = calculateOtherTotal(currentSpending, spendingLimits);

  const headerRow = makeRow(
    "Category",
    "Amount",
    "Limit",
    ["SpendingView-header"],
  );
  const plannedSpendingHeaderRow = makeRow(
    "",
    "Planned Spending",
    "",
    ["SpendingView-header"],
  );
  const unplannedSpendingHeaderRow = makeRow(
    "",
    "Unplanned Spending",
    "",
    ["SpendingView-header"],
  );

  const totalRow = makeRow(
    "Total",
    currentSpending["Total"],
    spendingLimits["Total"],
    ["SpendingView-header"],
  );
  const otherRow = makeRow(
    "Unplanned",
    otherTotal,
    spendingLimits["Other"],
    [],
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
    plannedRows.push(makeRow(key, currentSpending[key], limit, []));
  }
  var unplannedRows = [];
  for (const key in currentSpending) {
    if (spendingLimits[key]) {
      continue;
    }
    const limit = spendingLimits[key] ? spendingLimits[key] : "";
    unplannedRows.push(makeRow(key, currentSpending[key], limit, []));
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

function makeRow(category, amount, limit, additionalClasses) {
  amount = amount ? amount : 0.0;
  const key = category ? category : amount;
  const amountNum = amount;
  const limitNum = limit;
  const severity =
    isNaN(amountNum) || isNaN(limitNum)
      ? severityNotNumber
      : calculateSeverity(amountNum, limitNum);
  var amountClasses = [
    isNaN(amountNum) ? "" : "SpendingView-number",
  ];
  if(limit !== "") {
    amountClasses.push(severityClass(severity))
  }
  const limitClasses = [isNaN(limitNum) ? "" : "SpendingView-number"];
  const amountFormatted =
    (Number.isFinite(amountNum) ? FormatDollarAmount(amountNum) : amount);
  const limitFormatted =
    (Number.isFinite(limitNum) ? FormatDollarAmount(limitNum) : limit);
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
  return sum;
}

function annualBudgetView(annualLimits) {
  var amounts = [];
  for(var limit in annualLimits) {
    if(limit != "Total") {
      amounts.push(limit);
    }
  }
  amounts.sort();
  return (
    <div>
      <h3>
        <b>Annual Budget</b>
      </h3>
      <p>
        This year we have spent
        {` ${FormatDollarAmount(annualLimits["Total"])}.`}
      </p>
        {amounts.map(amount => (
        <p key={amount}>
          For a ${amount} budget, we can have
          {` ${FormatDollarAmount(annualLimits[amount])} `}
          of unplanned spending each month.
        </p>
      ))}
    </div>
  );
}

export default SpendingView;
