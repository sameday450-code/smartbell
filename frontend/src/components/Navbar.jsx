import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bell, Sun, Moon, WifiOff, Volume2,
  LayoutDashboard, Calendar, Megaphone, MonitorSmartphone,
  BarChart3, CreditCard, Settings, LogOut,
} from 'lucide-react';
import clsx from 'clsx';
import { useSocketStore } from '../store/socketStore';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../hooks/useAuth';
import { unlockAudio } from '../services/socket';
import NotificationPanel from './NotificationPanel';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/timetable', label: 'Timetable', icon: Calendar },
  { to: '/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/devices', label: 'Devices', icon: MonitorSmartphone },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/billing', label: 'Billing', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Navbar({ onMenuClick, open }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { connected, notifications, audioUnlocked } = useSocketStore();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const unread = notifications.filter((n) => !n.read).length;

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <header className="relative flex-shrink-0">
      {/* Main bar */}
      <div className="h-14 bg-white/95 dark:bg-[#0d1117]/95 border-b border-gray-100 dark:border-gray-800/60 flex items-center justify-between px-4 lg:px-5 backdrop-blur-sm relative z-50">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {/* Animated hamburger → X */}
          <div className="w-[18px] h-[14px] relative flex flex-col justify-between">
            <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-in-out origin-center ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-in-out ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-in-out origin-center ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Enable Bell Sound — shown until user unlocks audio */}
        {connected && !audioUnlocked && (
          <button
            onClick={unlockAudio}
            title="Click to enable automatic bell sounds"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 hover:animate-none transition-all"
          >
            <Volume2 className="w-3 h-3" />
            <span className="hidden sm:inline">Enable Sound</span>
          </button>
        )}

        {/* Socket status pill */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
          connected
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40'
        }`}>
          {connected ? (
            <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /><span className="hidden sm:inline">Live</span></>
          ) : (
            <><WifiOff className="w-3 h-3" /><span className="hidden sm:inline">Offline</span></>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle theme"
        >
          <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
          <Moon className="w-4 h-4 block dark:hidden text-gray-500" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
          {showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ml-1 cursor-default ring-2 ring-white dark:ring-gray-800"
          style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
          title={user?.name}
        >
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
      </div>

      {/* ── Mobile dropdown backdrop ─────────────────────────────────── */}
      <div
        className={`fixed inset-0 top-14 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onMenuClick}
      />

      {/* ── Mobile dropdown panel ────────────────────────────────────── */}
      <div
        className={`absolute top-full left-0 right-0 z-50 lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800/60 shadow-2xl">

          {/* School / user chip */}
          {user?.school && (
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/40">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-primary-500 truncate font-medium">{user.school.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav items */}
          <nav className="px-3 pb-2 space-y-0.5">
            <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Menu</p>
            {NAV_ITEMS.map(({ to, label, icon: Icon }, i) => (
              <NavLink
                key={to}
                to={to}
                onClick={onMenuClick}
                style={{ transitionDelay: open ? `${i * 35}ms` : '0ms' }}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    'transform',
                    open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
                    isActive
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/70 hover:text-gray-900 dark:hover:text-white'
                  )
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Sign out */}
          <div className="px-3 pb-4 pt-1 border-t border-gray-100 dark:border-gray-800/60 mt-1">
            <button
              onClick={() => { logout(); onMenuClick(); }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
