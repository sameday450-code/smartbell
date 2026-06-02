import { Bell, X, CheckCheck, AlertTriangle, MonitorSmartphone, Megaphone } from 'lucide-react';
import { useSocketStore } from '../store/socketStore';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

const ICONS = {
  emergency: AlertTriangle,
  announcement: Megaphone,
  device: MonitorSmartphone,
  warning: AlertTriangle,
};

const COLORS = {
  emergency: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  announcement: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  device: 'text-green-500 bg-green-50 dark:bg-green-900/20',
  warning: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
};

export default function NotificationPanel({ onClose }) {
  const { notifications, markAllRead, clearNotifications } = useSocketStore();

  return (
    <div className="absolute right-0 mt-2 w-80 card shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary-600" />
          <span className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</span>
          {notifications.length > 0 && (
            <span className="badge badge-blue">{notifications.length}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <button
              onClick={markAllRead}
              className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
              title="Mark all read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-80">
        {notifications.length === 0 ? (
          <div className="py-10 text-center">
            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No notifications</p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = ICONS[n.type] || Bell;
            return (
              <div
                key={n.id}
                className={clsx(
                  'flex gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800/50',
                  !n.read && 'bg-blue-50/40 dark:bg-blue-900/10'
                )}
              >
                <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', COLORS[n.type])}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{n.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{n.message}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {formatDistanceToNow(new Date(n.id), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800">
          <button onClick={clearNotifications} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
