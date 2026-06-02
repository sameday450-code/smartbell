import { NavLink } from 'react-router-dom';
import {
  Bell, LayoutDashboard, Calendar, Megaphone, MonitorSmartphone,
  BarChart3, CreditCard, Settings, LogOut, ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../hooks/useAuth';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/timetable', label: 'Timetable', icon: Calendar },
  { to: '/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/devices', label: 'Devices', icon: MonitorSmartphone },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/billing', label: 'Billing', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <>
      {/* Sidebar — desktop only; mobile nav is handled by the Navbar dropdown */}
      <aside
        className={clsx(
          'hidden lg:flex flex-col w-64 flex-shrink-0',
          'bg-white dark:bg-[#0d1117] border-r border-gray-100 dark:border-gray-800/60',
        )}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800/60">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
            >
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white text-[14px] tracking-tight">SmartBell</span>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5 font-medium tracking-wide uppercase">SaaS Platform</p>
            </div>
          </div>
        </div>

        {/* School info chip */}
        {user?.school && (
          <div className="px-4 pt-4 pb-1">
            <div className="px-3 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/40">
              <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 truncate">{user.school.name}</p>
              <p className="text-[10px] text-primary-500/70 dark:text-primary-500 mt-0.5 capitalize font-medium tracking-wide">
                {user.role?.replace('_', ' ').toLowerCase()}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto no-scrollbar">
          <p className="px-3 pt-1 pb-2 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Menu</p>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/70 hover:text-gray-900 dark:hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800/60">
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate leading-tight">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
