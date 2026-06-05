import {
  calculateTotal,
  getCurrentMonthExpenses,
  getHighestCategory,
  formatCurrency,
} from '../utils/calculations';

const CARDS = [
  {
    id: 'total',
    title: 'Total Expenses',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'month',
    title: 'This Month',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'category',
    title: 'Top Category',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    gradient: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'count',
    title: 'Transactions',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    gradient: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
];

export default function SummaryCards({ expenses, isLoading }) {
  const total = calculateTotal(expenses);
  const monthExpenses = getCurrentMonthExpenses(expenses);
  const monthTotal = calculateTotal(monthExpenses);
  const topCategory = getHighestCategory(expenses);

  const values = {
    total: formatCurrency(total),
    month: formatCurrency(monthTotal),
    category: topCategory ? topCategory.category : '—',
    count: expenses.length.toString(),
  };

  const subtitles = {
    total: `${expenses.length} total records`,
    month: `${monthExpenses.length} this month`,
    category: topCategory ? formatCurrency(topCategory.total) : 'No data yet',
    count: 'All time',
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((card) => (
          <div
            key={card.id}
            className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="mb-2 h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((card, index) => (
        <div
          key={card.id}
          className="group animate-slide-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          style={{ animationDelay: `${index * 75}ms` }}
        >
          <div className="flex items-start justify-between">
            <div className={`rounded-xl p-3 ${card.bgLight}`}>
              <div className={card.iconColor}>{card.icon}</div>
            </div>
            <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${card.gradient} opacity-60 transition-opacity group-hover:opacity-100`} />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {card.id === 'category' ? (
              <span className="text-lg">{values[card.id]}</span>
            ) : (
              values[card.id]
            )}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{subtitles[card.id]}</p>
        </div>
      ))}
    </div>
  );
}
