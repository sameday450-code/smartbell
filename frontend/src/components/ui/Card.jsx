import clsx from 'clsx';

export default function Card({ children, className, ...props }) {
  return (
    <div className={clsx('card p-6', className)} {...props}>
      {children}
    </div>
  );
}

const colorMap = {
  blue:   { bg: 'bg-blue-500/10 dark:bg-blue-500/15',   icon: 'text-blue-500',   ring: 'ring-blue-500/20'   },
  green:  { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', icon: 'text-emerald-500', ring: 'ring-emerald-500/20' },
  purple: { bg: 'bg-violet-500/10 dark:bg-violet-500/15', icon: 'text-violet-500', ring: 'ring-violet-500/20'  },
  orange: { bg: 'bg-orange-500/10 dark:bg-orange-500/15', icon: 'text-orange-500', ring: 'ring-orange-500/20'  },
  red:    { bg: 'bg-red-500/10 dark:bg-red-500/15',     icon: 'text-red-500',    ring: 'ring-red-500/20'    },
};

export function StatCard({ title, value, icon: Icon, color = 'blue', subtitle, change }) {
  const c = colorMap[color] ?? colorMap.blue;
  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">{title}</p>
        <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ring-1', c.bg, c.ring)}>
          <Icon className={clsx('w-4.5 h-4.5', c.icon)} />
        </div>
      </div>
      <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value ?? '—'}</p>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">{subtitle}</p>}
    </div>
  );
}

