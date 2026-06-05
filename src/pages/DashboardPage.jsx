import { useState, useCallback, useRef } from 'react';
import Dashboard from '../components/Dashboard';
import { generateId, exportToCSV, importFromCSV, formatCurrency } from '../utils/calculations';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
      >
        <h3 id="confirm-title" className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage({
  expenses,
  setExpenses,
  isLoading,
  showToast,
  isDark,
  toggleDark,
}) {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    month: '',
    year: '',
    sort: 'date-desc',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddExpense = useCallback(
    (data) => {
      const newExpense = { ...data, id: generateId() };
      setExpenses((prev) => [newExpense, ...prev]);
      setShowForm(false);
      showToast('Expense added successfully', 'success');
    },
    [setExpenses, showToast]
  );

  const handleEditExpense = useCallback(
    (data) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === editingExpense.id ? { ...e, ...data } : e))
      );
      setEditingExpense(null);
      setShowForm(false);
      showToast('Expense updated successfully', 'success');
    },
    [editingExpense, setExpenses, showToast]
  );

  const handleEdit = useCallback((expense) => {
    setEditingExpense(expense);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    setExpenses((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    showToast('Expense deleted', 'success');
    setDeleteTarget(null);
  }, [deleteTarget, setExpenses, showToast]);

  const handleExport = useCallback(() => {
    if (!expenses.length) {
      showToast('No expenses to export', 'warning');
      return;
    }
    const csv = exportToCSV(expenses);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Expenses exported to CSV', 'success');
  }, [expenses, showToast]);

  const handleImport = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const { expenses: imported, errors } = importFromCSV(event.target.result);
        if (imported.length) {
          setExpenses((prev) => [...imported, ...prev]);
          showToast(`Imported ${imported.length} expense(s)`, 'success');
        }
        if (errors.length) {
          showToast(`Import warnings: ${errors.slice(0, 2).join('; ')}`, 'warning');
        }
        if (!imported.length && !errors.length) {
          showToast('No valid expenses found in file', 'error');
        }
      };
      reader.onerror = () => showToast('Failed to read file', 'error');
      reader.readAsText(file);
      e.target.value = '';
    },
    [setExpenses, showToast]
  );

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track and manage your personal finances
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleDark}
            className="rounded-lg border border-gray-300 p-2.5 text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => {
              setEditingExpense(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </button>
        </div>
      </div>

      <Dashboard
        expenses={expenses}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={setFilters}
        onAddExpense={handleAddExpense}
        onEditExpense={handleEditExpense}
        onEdit={handleEdit}
        onDeleteExpense={setDeleteTarget}
        editingExpense={editingExpense}
        showForm={showForm}
        onCloseForm={() => {
          setShowForm(false);
          setEditingExpense(null);
        }}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Expense"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}" (${formatCurrency(deleteTarget.amount)})? This action cannot be undone.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Quick Add FAB (mobile) */}
      <button
        type="button"
        onClick={() => {
          setEditingExpense(null);
          setShowForm(true);
        }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition hover:bg-primary-700 hover:shadow-xl sm:hidden"
        aria-label="Quick add expense"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </>
  );
}
