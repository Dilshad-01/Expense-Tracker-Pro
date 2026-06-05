import { CURRENCY, CATEGORY_CHART_COLORS } from './constants';

/**
 * Format a number as currency.
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format date for display.
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(CURRENCY.locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get month key from date string (YYYY-MM).
 * @param {string} dateStr
 * @returns {string}
 */
export function getMonthKey(dateStr) {
  if (!dateStr) return '';
  return dateStr.slice(0, 7);
}

/**
 * Get month label from YYYY-MM key.
 * @param {string} monthKey
 * @returns {string}
 */
export function getMonthLabel(monthKey) {
  if (!monthKey) return '';
  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString(CURRENCY.locale, { month: 'short', year: 'numeric' });
}

/**
 * Calculate total amount from expenses array.
 * @param {Array} expenses
 * @returns {number}
 */
export function calculateTotal(expenses) {
  return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
}

/**
 * Get expenses for the current calendar month.
 * @param {Array} expenses
 * @returns {Array}
 */
export function getCurrentMonthExpenses(expenses) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return expenses.filter((e) => {
    const d = new Date(e.date + 'T00:00:00');
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
}

/**
 * Find category with highest total spending.
 * @param {Array} expenses
 * @returns {{ category: string, total: number } | null}
 */
export function getHighestCategory(expenses) {
  if (!expenses.length) return null;

  const totals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + (Number(e.amount) || 0);
    return acc;
  }, {});

  const entries = Object.entries(totals);
  const [category, total] = entries.reduce((max, curr) =>
    curr[1] > max[1] ? curr : max
  );

  return { category, total };
}

/**
 * Group expenses by category with totals.
 * @param {Array} expenses
 * @returns {Array<{ name: string, value: number, color: string }>}
 */
export function getCategoryBreakdown(expenses) {
  const totals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + (Number(e.amount) || 0);
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
      color: CATEGORY_CHART_COLORS[name] || '#6b7280',
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Get monthly spending totals sorted chronologically.
 * @param {Array} expenses
 * @returns {Array<{ month: string, label: string, total: number }>}
 */
export function getMonthlyTrends(expenses) {
  const totals = expenses.reduce((acc, e) => {
    const key = getMonthKey(e.date);
    acc[key] = (acc[key] || 0) + (Number(e.amount) || 0);
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([month, total]) => ({
      month,
      label: getMonthLabel(month),
      total: Math.round(total * 100) / 100,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Get last N months of spending data (including zero months).
 * @param {Array} expenses
 * @param {number} count
 * @returns {Array}
 */
export function getLastNMonthsTrend(expenses, count = 6) {
  const trends = getMonthlyTrends(expenses);
  const trendMap = Object.fromEntries(trends.map((t) => [t.month, t.total]));

  const result = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    result.push({
      month: key,
      label: getMonthLabel(key),
      total: trendMap[key] || 0,
    });
  }

  return result;
}

/**
 * Generate monthly report for a specific month/year.
 * @param {Array} expenses
 * @param {number} month - 1-12
 * @param {number} year
 * @returns {Object}
 */
export function getMonthlyReport(expenses, month, year) {
  const monthExpenses = expenses.filter((e) => {
    const d = new Date(e.date + 'T00:00:00');
    return d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
  });

  const total = calculateTotal(monthExpenses);
  const categoryBreakdown = getCategoryBreakdown(monthExpenses);
  const daysInMonth = new Date(year, month, 0).getDate();
  const avgDaily = total / daysInMonth;

  let largest = null;
  if (monthExpenses.length) {
    largest = monthExpenses.reduce((max, e) =>
      Number(e.amount) > Number(max.amount) ? e : max
    );
  }

  return {
    total,
    transactionCount: monthExpenses.length,
    categoryBreakdown,
    avgDaily: Math.round(avgDaily * 100) / 100,
    largest,
    monthExpenses,
  };
}

/**
 * Filter and sort expenses based on criteria.
 * @param {Array} expenses
 * @param {Object} filters
 * @returns {Array}
 */
export function filterAndSortExpenses(expenses, filters) {
  let result = [...expenses];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter((e) => e.title.toLowerCase().includes(q));
  }

  if (filters.category) {
    result = result.filter((e) => e.category === filters.category);
  }

  if (filters.month) {
    result = result.filter((e) => {
      const d = new Date(e.date + 'T00:00:00');
      return d.getMonth() + 1 === Number(filters.month);
    });
  }

  if (filters.year) {
    result = result.filter((e) => {
      const d = new Date(e.date + 'T00:00:00');
      return d.getFullYear() === Number(filters.year);
    });
  }

  const sort = filters.sort || 'date-desc';
  result.sort((a, b) => {
    switch (sort) {
      case 'date-asc':
        return a.date.localeCompare(b.date);
      case 'date-desc':
        return b.date.localeCompare(a.date);
      case 'amount-asc':
        return Number(a.amount) - Number(b.amount);
      case 'amount-desc':
        return Number(b.amount) - Number(a.amount);
      case 'category-asc':
        return a.category.localeCompare(b.category);
      case 'category-desc':
        return b.category.localeCompare(a.category);
      default:
        return b.date.localeCompare(a.date);
    }
  });

  return result;
}

/**
 * Get unique years from expenses for filter dropdown.
 * @param {Array} expenses
 * @returns {number[]}
 */
export function getAvailableYears(expenses) {
  const years = new Set(
    expenses.map((e) => new Date(e.date + 'T00:00:00').getFullYear())
  );
  return [...years].sort((a, b) => b - a);
}

/**
 * Validate expense form data.
 * @param {Object} data
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateExpense(data) {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length > 100) {
    errors.title = 'Title must be 100 characters or less';
  }

  const amount = Number(data.amount);
  if (!data.amount && data.amount !== 0) {
    errors.amount = 'Amount is required';
  } else if (isNaN(amount) || amount <= 0) {
    errors.amount = 'Amount must be a positive number';
  } else if (amount > 9999999) {
    errors.amount = 'Amount is too large';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  if (!data.date) {
    errors.date = 'Date is required';
  } else {
    const d = new Date(data.date + 'T00:00:00');
    if (isNaN(d.getTime())) {
      errors.date = 'Invalid date';
    }
  }

  if (data.notes && data.notes.length > 500) {
    errors.notes = 'Notes must be 500 characters or less';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Generate unique ID for new expenses.
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Export expenses to CSV string.
 * @param {Array} expenses
 * @returns {string}
 */
export function exportToCSV(expenses) {
  const headers = ['id', 'title', 'amount', 'category', 'date', 'notes'];
  const rows = expenses.map((e) =>
    headers.map((h) => {
      const val = e[h] ?? '';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Parse CSV string into expense objects.
 * @param {string} csvText
 * @returns {{ expenses: Array, errors: string[] }}
 */
export function importFromCSV(csvText) {
  const errors = [];
  const lines = csvText.trim().split(/\r?\n/);

  if (lines.length < 2) {
    return { expenses: [], errors: ['CSV file is empty or has no data rows'] };
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());
  const required = ['title', 'amount', 'category', 'date'];
  const missing = required.filter((r) => !headers.includes(r));

  if (missing.length) {
    return { expenses: [], errors: [`Missing required columns: ${missing.join(', ')}`] };
  }

  const expenses = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx]?.replace(/^"|"$/g, '').replace(/""/g, '"') ?? '';
    });

    const expense = {
      id: row.id || generateId(),
      title: row.title,
      amount: parseFloat(row.amount),
      category: row.category,
      date: row.date,
      notes: row.notes || '',
    };

    const { valid, errors: validationErrors } = validateExpense(expense);
    if (valid) {
      expenses.push(expense);
    } else {
      errors.push(`Row ${i + 1}: ${Object.values(validationErrors).join(', ')}`);
    }
  }

  return { expenses, errors };
}

/** Parse a single CSV line respecting quoted fields */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Get recent transactions sorted by date.
 * @param {Array} expenses
 * @param {number} limit
 * @returns {Array}
 */
export function getRecentTransactions(expenses, limit = 5) {
  return [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
