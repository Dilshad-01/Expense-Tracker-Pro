import { CATEGORIES, SORT_OPTIONS, MONTHS } from '../utils/constants';
import { getAvailableYears } from '../utils/calculations';

export default function Filters({ filters, onChange, expenses }) {
  const years = getAvailableYears(expenses);
  const currentYear = new Date().getFullYear();

  const yearOptions = years.length
    ? years
    : [currentYear, currentYear - 1];

  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    onChange({
      search: '',
      category: '',
      month: '',
      year: '',
      sort: 'date-desc',
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.month || filters.year;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters & Search</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-primary-600 transition hover:text-primary-700 dark:text-primary-400"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Search */}
        <div className="xl:col-span-1">
          <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search"
              type="text"
              placeholder="Search by title..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category-filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div>
          <label htmlFor="month-filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Month
          </label>
          <select
            id="month-filter"
            value={filters.month}
            onChange={(e) => handleChange('month', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year-filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Year
          </label>
          <select
            id="year-filter"
            value={filters.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Years</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort-filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort By
          </label>
          <select
            id="sort-filter"
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
