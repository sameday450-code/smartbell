import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../services/api';

const PERIODS = ['daily', 'weekly', 'monthly'];

export default function Analytics() {
  const [period, setPeriod] = useState('daily');

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', period],
    queryFn: () => api.get(`/analytics/usage?period=${period}`).then((r) => r.data.data),
  });

  const chartData = data?.usage || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bell and announcement usage statistics</p>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${period === p ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      {data?.summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Announcements', value: data.summary.totalAnnouncements },
            { label: 'Scheduled', value: data.summary.scheduled },
            { label: 'Manual', value: data.summary.manual },
            { label: 'Emergency', value: data.summary.emergency },
          ].map(({ label, value }) => (
            <div key={label} className="card p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value ?? 0}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-5">Announcements Over Time</h2>
          {isLoading ? (
            <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={264}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="scheduled" fill="#6366f1" name="Scheduled" radius={[2, 2, 0, 0]} />
                <Bar dataKey="manual" fill="#10b981" name="Manual" radius={[2, 2, 0, 0]} />
                <Bar dataKey="emergency" fill="#ef4444" name="Emergency" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-5">Total Trend</h2>
          {isLoading ? (
            <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={264}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Total" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
