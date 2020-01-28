import './SpendingView.css';
import React from 'react';
const severityNotNumber = 'not-number';
const severityNormal = 'normal';
const severityWarning = 'warning';
const severityOver = 'over';

function SpendingView(props) {
  const currentSpending = props.currentSpending;
  const spendingLimits = props.spendingLimits;
  if(!currentSpending) {
    return <p>No data...</p>;
  }
  if(!spendingLimits) {
    return <p>No data...</p>;
  }
  const otherTotal = calculateOtherTotal(currentSpending, spendingLimits);

  const headerRow = makeRow('Category', 'Amount', 'Limit', ['SpendingView-header'], false);
  const plannedSpendingHeaderRow = makeRow('', 'Planned Spending', '', ['SpendingView-header'], false);
  const unplannedSpendingHeaderRow = makeRow('', 'Unplanned Spending', '', ['SpendingView-header'], false);

  const totalRow = makeRow('Total', currentSpending['Total'], spendingLimits['Total'], ['SpendingView-header'], true);
  const otherRow = makeRow('Unplanned', otherTotal+'', spendingLimits['Other'], [], true);
  var plannedRows = [];
  for(const key in spendingLimits) {
    if(key === 'Total') {
      continue;
    }
    if(key === 'Other') {
      continue;
    }
    const limit = spendingLimits[key] ? spendingLimits[key] : '';
    plannedRows.push(makeRow(key, currentSpending[key], limit, [], true));
  }
  var unplannedRows = [];
  for(const key in currentSpending) {
    if(spendingLimits[key]) {
      continue;
    }
    const limit = spendingLimits[key] ? spendingLimits[key] : '';
    unplannedRows.push(makeRow(key, currentSpending[key], limit, [], true));
  }
  return ( 
    <div className="SpendingView-container">{
      [headerRow,
      plannedSpendingHeaderRow, totalRow, otherRow]
      .concat(plannedRows)
      .concat([unplannedSpendingHeaderRow]).concat(unplannedRows)
    }
    </div>
  );
}

function makeRow(category, amount, limit, additionalClasses, numberRow) {
  const key = category ? category : amount;
  const amountNum = parseFloat(amount.replace(',', ''));
  const limitNum = parseFloat(limit.replace(',', ''));
  const amountPrefix = numberRow ? '$' : '';
  const limitPrefix = numberRow && limit ? '$' : '';
  const severity = isNaN(amountNum) || isNaN(limitNum) ? severityNotNumber : calculateSeverity(amountNum, limitNum);
  const amountClasses = [ isNaN(amountNum) ? '' : 'SpendingView-number', severityClass(severity)];
  const limitClasses = [isNaN(limitNum) ? '' : 'SpendingView-number'];
  return (
    <div key={key} className="SpendingView-row">
      <label className={["SpendingView-category"].concat(additionalClasses).join(' ')}>{category}</label>
      <label className={["SpendingView-amount"].concat(additionalClasses).concat(amountClasses).join(' ')}>{amountPrefix + amount}</label>
      <label className={["SpendingView-limit"].concat(additionalClasses).concat(limitClasses).join(' ')}>{limitPrefix + limit}</label>
    </div>
  );
}

function severityClass(severity) {
  return `SpendingView-${severity}`;
}

function calculateSeverity(amount, limit) {
  const percentage = amount / limit;
  if(0.75 <= percentage && percentage <= 1) {
    return severityWarning;
  }
  if(percentage > 1) {
    return severityOver;
  }
  return severityNormal;
}

function calculateOtherTotal(currentSpending, spendingLimits) {
  var sum = 0;
  for(const key in currentSpending) {
    if(spendingLimits[key]) {
      continue;
    }
    sum += parseFloat(currentSpending[key].replace(',', ''));
  }
  return sum.toFixed(2);
}

export default SpendingView;
