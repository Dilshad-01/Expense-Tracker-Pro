import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getCategoryBreakdown, formatCurrency } from '../../utils/calculations';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-600 dark:bg-gray-800">
      <p className="text-sm font-medium text-gray-900 dark:text-white">{data.name}</p>
      <p className="text-sm text-primary-600 dark:text-primary-400">
        {formatCurrency(data.value)} ({data.payload.percentage}%)
      </p>
    </div>
  );
};

export default function CategoryPieChart({ expenses }) {
  const data = getCategoryBreakdown(expenses);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const chartData = data.map((d) => ({
    ...d,
    percentage: total > 0 ? ((d.value / total) * 100).toFixed(1) : '0',
  }));

  if (!chartData.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        No expense data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
          animationBegin={0}
          animationDuration={800}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => (
            <span className="text-xs text-gray-600 dark:text-gray-300">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
