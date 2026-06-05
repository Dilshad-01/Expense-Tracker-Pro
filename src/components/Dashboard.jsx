import { useState } from 'react';
import SummaryCards from './SummaryCards';
import Filters from './Filters';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import CategoryPieChart from './Charts/CategoryPieChart';
import MonthlyLineChart from './Charts/MonthlyLineChart';
import CategoryBarChart from './Charts/CategoryBarChart';
import ExpenseAreaChart from './Charts/ExpenseAreaChart';
import { CATEGORY_COLORS } from '../utils/constants';
import {
  filterAndSortExpenses,
  getMonthlyReport,
  getRecentTransactions,
  formatCurrency,
  formatDate,
} from '../utils/calculations';

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
      {children}
    </div>
  );
}

function RecentTransactions({ expenses }) {
  const recent = getRecentTransactions(expenses, 5);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-400">No transactions yet</p>
      ) : (
        <ul className="space-y-3">
          {recent.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center justify-between gap-3 rounded-lg p-2 transition hover:bg-gray-50 dark:hover:bg-gray-700/30"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {expense.title}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other
                    }`}
                  >
                    {expense.category}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(expense.date)}</span>
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(expense.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MonthlyReport({ expenses }) {
  const now = new Date();
  const [reportMonth, setReportMonth] = useState(now.getMonth() + 1);
  const [reportYear, setReportYear] = useState(now.getFullYear());

  const report = getMonthlyReport(expenses, reportMonth, reportYear);
  const monthName = new Date(reportYear, reportMonth - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Monthly Report</h3>
        <div className="flex gap-2">
          <select
            value={reportMonth}
            onChange={(e) => setReportMonth(Number(e.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            aria-label="Report month"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={reportYear}
            onChange={(e) => setReportYear(Number(e.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            aria-label="Report year"
          >
            {[reportYear, reportYear - 1, reportYear - 2].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{monthName}</p>

      {report.transactionCount === 0 ? (
        <p className="text-sm text-gray-400">No expenses recorded for this month</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(report.total)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Transactions</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{report.transactionCount}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Daily</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(report.avgDaily)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Largest Expense</p>
              <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                {report.largest ? formatCurrency(report.largest.amount) : '—'}
              </p>
              {report.largest && (
                <p className="truncate text-xs text-gray-400">{report.largest.title}</p>
              )}
            </div>
          </div>

          {report.categoryBreakdown.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Category Breakdown</p>
              <div className="space-y-2">
                {report.categoryBreakdown.map((cat) => {
                  const pct = report.total > 0 ? ((cat.value / report.total) * 100).toFixed(1) : 0;
                  return (
                    <div key={cat.name}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">{cat.name}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(cat.value)} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard({
  expenses,
  isLoading,
  filters,
  onFiltersChange,
  onAddExpense,
  onEditExpense,
  onEdit,
  onDeleteExpense,
  editingExpense,
  showForm,
  onCloseForm,
}) {
  const filteredExpenses = filterAndSortExpenses(expenses, filters);

  return (
    <div className="space-y-6">
      <SummaryCards expenses={expenses} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactions expenses={expenses} />
        </div>
        <div>
          <MonthlyReport expenses={expenses} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Category Distribution">
          <CategoryPieChart expenses={expenses} />
        </ChartCard>
        <ChartCard title="Monthly Spending Trend">
          <MonthlyLineChart expenses={expenses} />
        </ChartCard>
        <ChartCard title="Category Comparison">
          <CategoryBarChart expenses={expenses} />
        </ChartCard>
        <ChartCard title="Last 6 Months">
          <ExpenseAreaChart expenses={expenses} />
        </ChartCard>
      </div>

      {/* Expense Form */}
      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={editingExpense ? onEditExpense : onAddExpense}
          onCancel={onCloseForm}
          isOpen={showForm}
        />
      )}

      {/* Filters & Table */}
      <Filters filters={filters} onChange={onFiltersChange} expenses={expenses} />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Expenses</h3>
        </div>
        <ExpenseTable
          expenses={filteredExpenses}
          onEdit={onEdit}
          onDelete={onDeleteExpense}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
