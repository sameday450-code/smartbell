import { Bell, Zap, Shield, Globe } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: Zap, text: 'Real-time bell automation' },
  { icon: Shield, text: 'Enterprise-grade security' },
  { icon: Globe, text: 'Works on any device' },
];

export default function AuthLayout({ children, wide = false }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-between w-[45%] xl:w-[40%] p-10 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 55%, #172554 100%)' }}>
        <div className="absolute inset-0 bg-dot-white pointer-events-none opacity-100" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}>
              <Bell className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">SmartBell</span>
          </div>
          <h2 className="text-3xl font-black text-white leading-tight mb-4 tracking-tight">
            Automate every<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">bell and announcements</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-xs">
            Join thousands of schools running their PA systems on SmartBell.
          </p>
          <ul className="space-y-3.5">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-blue-300" />
                </div>
                <span className="text-sm text-gray-300 font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-sm text-gray-300 italic leading-relaxed">
            &ldquo;SmartBell replaced our physical PA panel entirely. Scheduling is effortless.&rdquo;
          </p>
          <p className="text-xs text-gray-500 mt-2">— Mrs. Adaeze Okonkwo, Principal</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-gray-50 dark:bg-[#0a0f1e]">
        <div className="lg:hidden text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}>
            <Bell className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">SmartBell</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">School Bell Management</p>
        </div>
        <div className={`w-full ${wide ? 'max-w-3xl' : 'max-w-md'}`}>
          <div className="bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-100 dark:border-gray-800/60 p-8">
            {children}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            &copy; {new Date().getFullYear()} SmartBell SaaS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
