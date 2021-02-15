const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
});

function FormatDollarAmount(amount) {
  return formatter.format(amount);
}

export { FormatDollarAmount };
