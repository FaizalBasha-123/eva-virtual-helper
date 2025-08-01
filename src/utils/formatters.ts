
/**
 * Format a number as Indian currency (₹)
 * @param amount The amount to format
 * @returns Formatted currency string
 */
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date string or timestamp to a readable format
 * @param dateString The date string or timestamp to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | number): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};
