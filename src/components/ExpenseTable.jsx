import { CATEGORY_COLORS } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/calculations';

function CategoryBadge({ category }) {
  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {category}
    </span>
  );
}

export default function ExpenseTable({ expenses, onEdit, onDelete, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded bg-gray-100 dark:bg-gray-700/50" />
          ))}
        </div>
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <svg
          className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No expenses found</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your filters or add a new expense to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/80">
              <th scope="col" className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 sm:px-6">
                Date
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 sm:px-6">
                Title
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 sm:px-6">
                Category
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 sm:px-6">
                Amount
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300 sm:px-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="transition hover:bg-gray-50 dark:hover:bg-gray-700/30"
              >
                <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300 sm:px-6">
                  {formatDate(expense.date)}
                </td>
                <td className="px-4 py-3 sm:px-6">
                  <div className="font-medium text-gray-900 dark:text-white">{expense.title}</div>
                  {expense.notes && (
                    <div className="mt-0.5 truncate text-xs text-gray-400 max-w-[200px]">{expense.notes}</div>
                  )}
                </td>
                <td className="px-4 py-3 sm:px-6">
                  <CategoryBadge category={expense.category} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900 dark:text-white sm:px-6">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right sm:px-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(expense)}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
                      aria-label={`Edit ${expense.title}`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(expense)}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      aria-label={`Delete ${expense.title}`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400 sm:px-6">
        Showing {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
