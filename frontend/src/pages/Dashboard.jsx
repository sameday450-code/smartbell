import { useQuery } from '@tanstack/react-query';
import { Bell, MonitorSmartphone, Calendar, Megaphone, TrendingUp, Activity } from 'lucide-react';
import api from '../services/api';
import { StatCard } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/analytics/dashboard').then((r) => r.data.data),
    refetchInterval: 30000,
  });

  const { data: recentAnnouncements } = useQuery({
    queryKey: ['recent-announcements'],
    queryFn: () => api.get('/announcements?limit=5').then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="h-3 skeleton rounded w-1/2" />
                <div className="w-9 h-9 skeleton rounded-xl" />
              </div>
              <div className="h-7 skeleton rounded w-2/3" />
              <div className="h-2.5 skeleton rounded w-1/3 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
            <span className="mx-2 text-gray-300 dark:text-gray-700">·</span>
            <span className="font-medium text-primary-600 dark:text-primary-400">{isSuperAdmin ? 'Platform Overview' : user?.school?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isSuperAdmin ? (
          <>
            <StatCard title="Total Schools" value={stats?.totalSchools} icon={Bell} color="blue" />
            <StatCard title="Active Schools" value={stats?.activeSchools} icon={Activity} color="green" />
            <StatCard title="Total Users" value={stats?.totalUsers} icon={MonitorSmartphone} color="purple" />
            <StatCard title="All Announcements" value={stats?.totalAnnouncements} icon={Megaphone} color="orange" />
          </>
        ) : (
          <>
            <StatCard title="Today's Bells" value={stats?.todayAnnouncements} icon={Bell} color="blue" subtitle="Triggered today" />
            <StatCard title="Online Devices" value={`${stats?.onlineDevices ?? 0}/${stats?.totalDevices ?? 0}`} icon={MonitorSmartphone} color="green" subtitle="Connected now" />
            <StatCard title="Active Schedules" value={stats?.activeSchedules} icon={Calendar} color="purple" subtitle="Running schedules" />
            <StatCard title="Monthly Bells" value={stats?.monthlyAnnouncements} icon={TrendingUp} color="orange" subtitle="This month" />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Announcements */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <Megaphone className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            </div>
            Recent Announcements
          </h2>
          <div className="space-y-1">
            {(recentAnnouncements?.length > 0) ? recentAnnouncements.map((a) => (
              <div key={a.id} className="flex items-start gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${a.type === 'EMERGENCY' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{format(new Date(a.playedAt), 'MMM d, h:mm a')}</p>
                </div>
                {a.type === 'EMERGENCY' && (
                  <span className="badge-red text-[10px] flex-shrink-0">Emergency</span>
                )}
              </div>
            )) : (
              <div className="py-8 text-center">
                <Megaphone className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No announcements yet today</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            </div>
            Recent Activity
          </h2>
          <div className="space-y-1">
            {(stats?.recentActivity?.length > 0) ? stats.recentActivity.map((log) => (
              <div key={log.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate capitalize">{log.action.replace(/_/g, ' ').toLowerCase()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{format(new Date(log.createdAt), 'MMM d, h:mm a')}</p>
                </div>
              </div>
            )) : (
              <div className="py-8 text-center">
                <Activity className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
