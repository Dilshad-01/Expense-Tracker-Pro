/** Application-wide constants */

export const STORAGE_KEYS = {
  EXPENSES: 'expense-tracker-pro-expenses',
  DARK_MODE: 'expense-tracker-pro-dark-mode',
};

export const CATEGORIES = [
  'Food',
  'Transportation',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
];

/** Tailwind badge color classes per category */
export const CATEGORY_COLORS = {
  Food: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  Transportation: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Shopping: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
  Bills: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  Entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  Healthcare: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  Education: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  Travel: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  Other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

/** Chart hex colors per category (for Recharts) */
export const CATEGORY_CHART_COLORS = {
  Food: '#f97316',
  Transportation: '#3b82f6',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Entertainment: '#a855f7',
  Healthcare: '#22c55e',
  Education: '#6366f1',
  Travel: '#14b8a6',
  Other: '#6b7280',
};

export const CHART_COLORS = Object.values(CATEGORY_CHART_COLORS);

export const CURRENCY = {
  locale: 'en-US',
  currency: 'USD',
};

export const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date (Newest)' },
  { value: 'date-asc', label: 'Date (Oldest)' },
  { value: 'amount-desc', label: 'Amount (High to Low)' },
  { value: 'amount-asc', label: 'Amount (Low to High)' },
  { value: 'category-asc', label: 'Category (A-Z)' },
  { value: 'category-desc', label: 'Category (Z-A)' },
];

export const MONTHS = [
  { value: '', label: 'All Months' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export const CSV_HEADERS = ['id', 'title', 'amount', 'category', 'date', 'notes'];
