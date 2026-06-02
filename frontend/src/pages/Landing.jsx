import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, Zap, Shield, Globe, BarChart3, ChevronRight, Star,
  ArrowRight, Volume2, Radio, Clock, Users, Sparkles,
  Play, ChevronDown, Monitor, CheckCircle, TrendingUp,
  MessageSquare, Mail, BookOpen, Wifi, CreditCard, Settings2,
  Rocket, HelpCircle, Plus, Minus,
  Smartphone, Tv, Laptop, Speaker, Lock, KeyRound, Activity,
  CalendarClock, Mic2, Layers, PlugZap, BellRing,
} from 'lucide-react';

/* ─── Data ────────────────────────────────────────────────── */
const CAPABILITY_PILLS = [
  { icon: CalendarClock, label: 'Term-based scheduling' },
  { icon: BellRing, label: 'Custom bell sounds' },
  { icon: Mic2, label: '50+ TTS voices' },
  { icon: PlugZap, label: 'Instant device sync' },
  { icon: Layers, label: 'Zone-based control' },
  { icon: Activity, label: 'Real-time health monitoring' },
  { icon: Lock, label: 'End-to-end encrypted' },
  { icon: Globe, label: 'Multi-school management' },
];

const STEPS = [
  {
    step: '01',
    title: 'Create Your School',
    description:
      'Sign up, add your school profile, and connect your first device in under 10 minutes — no hardware, no installation required.',
  },
  {
    step: '02',
    title: 'Build Bell Schedules',
    description:
      'Use our intuitive drag-and-drop builder to create daily, weekly, or custom recurring bell patterns for every term.',
  },
  {
    step: '03',
    title: 'Go Live Instantly',
    description:
      'Activate and every device rings in perfect sync — automatically, every day, without anyone pressing a single button.',
  },
];

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Perfect for small schools just getting started',
    features: [
      'Up to 5 devices',
      '1 bell schedule',
      'Basic announcements',
      'Email support',
      '99% uptime SLA',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$49',
    priceAnnual: '$39',
    period: '/month',
    description: 'For growing schools that need more power',
    features: [
      'Up to 50 devices',
      'Unlimited schedules',
      'AI voice announcements',
      'Priority support',
      '99.9% uptime SLA',
      'Advanced analytics',
      'Custom bell sounds',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large schools and entire districts',
    features: [
      'Unlimited devices',
      'Multi-school management',
      'Dedicated account manager',
      '24/7 phone support',
      '99.99% uptime SLA',
      'Custom integrations',
      'On-premise deployment',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const TESTIMONIALS = [
  {
    avatar: 'SJ',
    avatarGradient: 'from-blue-400 to-blue-600',
    name: 'Sarah Johnson',
    role: 'Principal, Greenwood High School',
    content:
      'SmartBell has completely transformed how we run our school day. Automated schedules have saved us countless hours and eliminated human error entirely.',
    rating: 5,
  },
  {
    avatar: 'MC',
    avatarGradient: 'from-violet-400 to-purple-600',
    name: 'Michael Chen',
    role: 'IT Director, Maple Valley District',
    content:
      'Managing 12 schools from a single dashboard is remarkable. Real-time device monitoring gives us complete peace of mind that every bell will ring on time.',
    rating: 5,
  },
  {
    avatar: 'PW',
    avatarGradient: 'from-emerald-400 to-green-600',
    name: 'Patricia Williams',
    role: "Head Teacher, St. Mary's Academy",
    content:
      'The AI voice announcement feature is exceptional. Parents and students appreciate the clear, professional-quality messages across our entire PA system.',
    rating: 5,
  },
];

const FAQ_CATEGORIES = [
  {
    id: 'all',
    label: 'All Questions',
    icon: HelpCircle,
  },
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: Rocket,
  },
  {
    id: 'devices',
    label: 'Devices & Connectivity',
    icon: Wifi,
  },
  {
    id: 'features',
    label: 'Features',
    icon: Settings2,
  },
  {
    id: 'billing',
    label: 'Billing & Security',
    icon: CreditCard,
  },
];

const FAQS = [
  {
    category: 'getting-started',
    q: 'How quickly can we get set up?',
    a: 'Most schools are fully operational within 30 minutes. Our onboarding wizard guides you through connecting devices, creating your first schedule, and running a test bell. No IT expertise required.',
  },
  {
    category: 'getting-started',
    q: 'Do we need to purchase any special hardware?',
    a: 'No hardware purchases required. SmartBell runs entirely in a web browser, so any existing Windows PC, Mac, Chromebook, or Android device becomes a SmartBell client instantly.',
  },
  {
    category: 'getting-started',
    q: 'Can we migrate from our existing bell system?',
    a: 'Yes. Our migration assistant imports schedules from common formats (CSV, Excel). Our onboarding team offers free assisted migration for Professional and Enterprise customers.',
  },
  {
    category: 'devices',
    q: 'What devices are compatible with SmartBell?',
    a: 'SmartBell works with Windows PCs, Macs, Chromebooks, Android devices, smart TVs, and any PA system with an AUX input. Our browser-based client requires no software installation.',
  },
  {
    category: 'devices',
    q: 'What happens if the internet goes down?',
    a: 'SmartBell devices cache the active schedule locally. Bells will continue to ring even without internet. Devices automatically resync when connectivity is restored — no manual intervention needed.',
  },
  {
    category: 'devices',
    q: 'How many devices can run simultaneously?',
    a: 'Starter supports up to 5 devices, Professional up to 50, and Enterprise is unlimited. All devices in a school ring in perfect sub-100ms synchronisation regardless of count.',
  },
  {
    category: 'features',
    q: 'Can we customise bell sounds and announcement voices?',
    a: 'Yes! Upload custom audio files for bells, choose from 50+ TTS voices, and create different sound profiles for different zones — corridors, classrooms, outdoor areas, and the main hall.',
  },
  {
    category: 'features',
    q: 'Can different buildings or zones have different schedules?',
    a: 'Absolutely. Zone-based scheduling lets you assign different bell patterns to different areas — primary wing, secondary wing, sports hall, etc. — all managed from one dashboard.',
  },
  {
    category: 'features',
    q: 'Does SmartBell support emergency override announcements?',
    a: 'Yes. The emergency broadcast feature lets authorised staff send an instant school-wide announcement from any device in seconds, overriding all scheduled events.',
  },
  {
    category: 'billing',
    q: 'Is there a free trial?',
    a: 'Every plan starts with a 30-day free trial — no credit card needed. At the end of the trial you choose a plan or your account moves to the free Starter tier automatically.',
  },
  {
    category: 'billing',
    q: 'Can we switch plans at any time?',
    a: 'Yes, upgrade or downgrade at any time. Upgrades take effect immediately. Downgrades apply at the end of your current billing cycle. Unused time is prorated as a credit.',
  },
  {
    category: 'billing',
    q: 'Is SmartBell FERPA and COPPA compliant?',
    a: "Absolutely. SmartBell doesn't collect or process student data. Our platform is fully FERPA compliant and we undergo regular third-party security audits to maintain compliance.",
  },
];

/* ─── Component ───────────────────────────────────────────── */
export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [annual, setAnnual] = useState(false);
  const [activeFaqCategory, setActiveFaqCategory] = useState('all');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-sans">

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Bell size={15} className="text-white" />
              </div>
              <span className={`font-bold text-[17px] transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                SmartBell
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-7">
              {['#features', '#how-it-works', '#pricing', '#faq'].map((href, i) => (
                <a
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-colors hover:text-blue-500 ${scrolled ? 'text-gray-600' : 'text-white/70'}`}
                >
                  {['Features', 'How It Works', 'Pricing', 'FAQ'][i]}
                </a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/70 hover:text-white'}`}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-px"
              >
                Get Started <ArrowRight size={14} />
              </Link>
            </div>

            {/* Mobile Toggle — animated hamburger → X */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-white/10 text-white'}`}
            >
              <div className="w-[20px] h-[16px] flex flex-col justify-between">
                <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-in-out origin-center ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-in-out ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-in-out origin-center ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu — slides down with staggered items */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-4 space-y-1">
            {[['#features', 'Features'], ['#how-it-works', 'How It Works'], ['#pricing', 'Pricing'], ['#faq', 'FAQ']].map(([href, label], i) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : '0ms' }}
                className={`block text-sm font-medium text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 transform ${
                  mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                }`}
              >
                {label}
              </a>
            ))}
            <div
              style={{ transitionDelay: mobileOpen ? '160ms' : '0ms' }}
              className={`flex gap-2 pt-2 transition-all duration-200 transform ${
                mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
              }`}
            >
              <Link to="/login" className="flex-1 text-center text-sm font-medium text-gray-700 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                Log in
              </Link>
              <Link to="/register" className="flex-1 text-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 rounded-xl shadow-md">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#060b18] text-white overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute -top-48 -left-48 w-[700px] h-[700px] bg-blue-700/20 rounded-full blur-[130px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-violet-700/15 rounded-full blur-[120px]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-blue-300 font-medium mb-8">
            <Sparkles size={13} className="text-yellow-400 flex-shrink-0" />
            <span>Now with AI-powered voice announcements</span>
            <ChevronRight size={13} className="text-blue-400/70" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-[76px] font-extrabold tracking-tight leading-[1.05] mb-6">
            <span className="text-white">Automate Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              School Bells
            </span>
            <br />
            <span className="text-white">&amp; PA System</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            SmartBell automates bell schedules and voice announcements across every device —
            computers, smart TVs, PA systems, and mobile — all in real time, all the time.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/register"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start Free Today
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl text-base font-medium text-gray-300 border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5">
              <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Play size={11} fill="white" className="text-white ml-0.5" />
              </span>
              Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'].map((bg, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#060b18] flex items-center justify-center text-[11px] font-bold text-white"
                  style={{ backgroundColor: bg }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="flex gap-px">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill="#f59e0b" className="text-yellow-400" />
                ))}
              </div>
              <span>
                Trusted by <strong className="text-white font-semibold">2,400+</strong> schools worldwide
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          {/* Glow halo */}
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/15 via-indigo-600/20 to-violet-600/15 blur-3xl rounded-3xl" />

          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Window Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/30">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-3">
                <div className="mx-auto max-w-xs bg-black/30 rounded-md px-3 py-1 text-[11px] text-gray-400 text-center tracking-wide">
                  app.smartbell.io/dashboard
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </div>
            </div>

            {/* Dashboard Body */}
            <div className="p-5 grid grid-cols-12 gap-4">
              {/* Sidebar */}
              <div className="col-span-2 space-y-0.5">
                {['Dashboard', 'Schedules', 'Devices', 'Announce', 'Analytics'].map((item, i) => (
                  <div
                    key={i}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium truncate ${
                      i === 0 ? 'bg-blue-600/20 text-blue-400' : 'text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Main Area */}
              <div className="col-span-10 space-y-3">
                {/* Stat Cards */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Active Devices', value: '48', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Bells Today', value: '12', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Announcements', value: '5', color: 'text-violet-400', bg: 'bg-violet-500/10' },
                    { label: 'Uptime', value: '100%', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                  ].map((s, i) => (
                    <div key={i} className={`${s.bg} border border-white/5 rounded-xl p-3`}>
                      <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Schedule Preview */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-300">Today's Bell Schedule</span>
                    <span className="text-[10px] text-blue-400 font-medium">Monday · Term 3</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { time: '08:00', label: 'School Start', status: 'done' },
                      { time: '10:30', label: 'Morning Break', status: 'done' },
                      { time: '13:00', label: 'Lunch Bell', status: 'active' },
                      { time: '15:30', label: 'End of School', status: 'upcoming' },
                    ].map((bell, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <span className="text-[11px] text-gray-500 w-10 flex-shrink-0">{bell.time}</span>
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            bell.status === 'done'
                              ? 'bg-emerald-500'
                              : bell.status === 'active'
                              ? 'bg-blue-500 animate-pulse'
                              : 'bg-gray-700'
                          }`}
                        />
                        <span className="text-[11px] text-gray-300 flex-1">{bell.label}</span>
                        {bell.status === 'active' && (
                          <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                            NOW
                          </span>
                        )}
                        {bell.status === 'done' && (
                          <CheckCircle size={12} className="text-emerald-500/60" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════
          TRUSTED BY BAR
      ══════════════════════════════════════════ */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
            Trusted by leading schools worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {[
              'Greenwood High School',
              'Maple Valley District',
              "St. Mary's Academy",
              'Riverside College',
              'Brighton International',
              'Northfield District',
            ].map((name, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-300 font-semibold text-sm">
                <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                  <Bell size={11} className="text-gray-400" />
                </div>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { value: '2,400+', label: 'Schools Worldwide', Icon: Globe },
              { value: '98.9%', label: 'Uptime SLA', Icon: Zap },
              { value: '< 120ms', label: 'Avg. Latency', Icon: TrendingUp },
              { value: '4.9 / 5', label: 'Customer Rating', Icon: Star },
            ].map(({ value, label, Icon }, i) => (
              <div key={i} className="group">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors mb-4 mx-auto">
                  <Icon size={20} className="text-white/80" />
                </div>
                <div className="text-4xl font-extrabold tracking-tight mb-1">{value}</div>
                <div className="text-sm text-blue-100/70 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section id="features" className="py-28 scroll-mt-16 bg-[#080d1a] relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-700/10 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Section Header ── */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles size={11} className="text-blue-400" />
              Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Everything your school needs
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Built for thousands of schools running simultaneously — enterprise-grade reliability
              wrapped in an interface your whole team will actually love.
            </p>
          </div>

          {/* ══════════════════════════════════
              BENTO ROW 1: Bell Scheduling + Voice
          ══════════════════════════════════ */}
          <div className="grid grid-cols-12 gap-4 mb-4">

            {/* Card 1: Bell Scheduling — large */}
            <div className="col-span-12 md:col-span-7 group bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-blue-500/30 rounded-2xl p-7 transition-all duration-300 flex flex-col">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 mb-4">
                    <Bell size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1.5">Automated Bell Scheduling</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                    Schedule bells for assembly, break, lunch, and closing times automatically.
                    Every school day. Zero manual triggers.
                  </p>
                </div>
              </div>

              {/* Bullets */}
              <div className="flex flex-wrap gap-2 mb-5">
                {['Daily, weekly & term patterns', 'Holiday overrides', 'Drag-and-drop builder'].map((b, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                    <CheckCircle size={10} /> {b}
                  </span>
                ))}
              </div>

              {/* Schedule mockup */}
              <div className="mt-auto bg-black/40 rounded-xl border border-white/[0.06] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-gray-400">Monday · Term 3</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Schedule Active
                  </span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { time: '08:00', label: 'School Start', status: 'done' },
                    { time: '10:30', label: 'Morning Break', status: 'done' },
                    { time: '13:00', label: 'Lunch Bell', status: 'active' },
                    { time: '15:30', label: 'End of School', status: 'upcoming' },
                    { time: '16:00', label: 'After-school Club', status: 'upcoming' },
                  ].map((bell, i) => (
                    <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      bell.status === 'active' ? 'bg-blue-500/10 border border-blue-500/20' : ''
                    }`}>
                      <span className="text-[11px] text-gray-600 w-10 flex-shrink-0 font-mono">{bell.time}</span>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        bell.status === 'done' ? 'bg-emerald-500' :
                        bell.status === 'active' ? 'bg-blue-400 animate-pulse' :
                        'bg-gray-700'
                      }`} />
                      <span className={`text-[12px] flex-1 ${
                        bell.status === 'active' ? 'text-blue-300 font-semibold' :
                        bell.status === 'done' ? 'text-gray-500' : 'text-gray-600'
                      }`}>{bell.label}</span>
                      {bell.status === 'active' && (
                        <span className="text-[9px] font-bold text-blue-400 bg-blue-500/15 px-1.5 py-0.5 rounded-md">NOW</span>
                      )}
                      {bell.status === 'done' && (
                        <CheckCircle size={11} className="text-emerald-500/50" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Voice Announcements — medium */}
            <div className="col-span-12 md:col-span-5 group bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-violet-500/30 rounded-2xl p-7 transition-all duration-300 flex flex-col">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30 mb-4">
                <Volume2 size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1.5">AI Voice Announcements</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-5">
                Crystal-clear TTS powered by ElevenLabs and Google Cloud — 50+ natural voices,
                broadcast to every device simultaneously.
              </p>

              {/* Voice selector mockup */}
              <div className="bg-black/40 rounded-xl border border-white/[0.06] p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-gray-400 font-medium">Announcement preview</span>
                  <span className="flex items-center gap-1 text-[10px] text-violet-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" /> Playing
                  </span>
                </div>
                {/* Waveform */}
                <div className="flex items-end gap-px h-9 mb-3">
                  {Array.from({ length: 44 }).map((_, i) => {
                    const h = 30 + Math.abs(Math.sin(i * 0.7 + 1) * Math.cos(i * 0.3)) * 70;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: i > 28 ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.7)',
                        }}
                      />
                    );
                  })}
                </div>
                <div className="text-[11px] text-gray-500 italic">"Attention: Lunch bell will ring in 5 minutes..."</div>
              </div>

              {/* Voice options */}
              <div className="space-y-2">
                <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Voice library</span>
                <div className="flex gap-2">
                  {[['British', 'violet'], ['American', ''], ['Australian', '']].map(([v, active], i) => (
                    <div
                      key={i}
                      className={`flex-1 text-center text-[11px] font-semibold py-2 rounded-xl border transition-colors ${
                        active ? 'bg-violet-500/15 border-violet-500/30 text-violet-300' : 'border-white/5 text-gray-600 bg-white/[0.02]'
                      }`}
                    >
                      {v}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-5 text-[12px] text-gray-600 flex items-center gap-1.5">
                <Sparkles size={11} className="text-violet-400" />
                50+ voices · 30+ languages · Custom uploads
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════
              BENTO ROW 2: 4 smaller cards
          ══════════════════════════════════ */}
          <div className="grid grid-cols-12 gap-4 mb-4">

            {/* Card 3: Real-Time Broadcasting */}
            <div className="col-span-12 sm:col-span-6 md:col-span-3 group bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25 mb-4">
                <Radio size={17} className="text-white" />
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">Real-Time Broadcasting</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-5">
                Instant sync via Socket.IO — sub-100ms latency across every device, every time.
              </p>
              {/* Device sync visual */}
              <div className="flex items-center justify-center gap-2 py-3">
                {[Monitor, Smartphone, Tv, Speaker].map((DevIcon, i) => (
                  <div key={i} className="relative">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <DevIcon size={14} className="text-indigo-400" />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#080d1a] animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="text-center text-[10px] text-emerald-400 font-semibold mt-1">48 devices in sync</div>
            </div>

            {/* Card 4: Multi-Device Support */}
            <div className="col-span-12 sm:col-span-6 md:col-span-3 group bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25 mb-4">
                <Monitor size={17} className="text-white" />
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">Multi-Device Support</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-5">
                Windows, Mac, Chromebook, Android, smart TVs, PA systems — no installs needed.
              </p>
              {/* Device type grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  [Monitor, 'Windows', 'bg-blue-500/10 border-blue-500/20 text-blue-400'],
                  [Laptop, 'Mac', 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'],
                  [Smartphone, 'Android', 'bg-green-500/10 border-green-500/20 text-green-400'],
                  [Tv, 'Smart TV', 'bg-purple-500/10 border-purple-500/20 text-purple-400'],
                  [Speaker, 'PA System', 'bg-orange-500/10 border-orange-500/20 text-orange-400'],
                  [Globe, 'Browser', 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'],
                ].map(([DevIcon, label, colors], i) => (
                  <div key={i} className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center ${colors}`}>
                    <DevIcon size={13} />
                    <span className="text-[9px] font-semibold opacity-80">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 5: Analytics */}
            <div className="col-span-12 sm:col-span-6 md:col-span-3 group bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25 mb-4">
                <BarChart3 size={17} className="text-white" />
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">Powerful Analytics</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-5">
                Bell history, device health, announcement logs — all in a real-time dashboard.
              </p>
              {/* Mini bar chart */}
              <div className="flex items-end gap-1 h-12">
                {[65, 80, 55, 90, 70, 95, 85].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? 'rgba(52,211,153,0.8)' : 'rgba(52,211,153,0.25)' }} />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <span key={i} className="flex-1 text-center text-[9px] text-gray-700">{d}</span>
                ))}
              </div>
              <div className="mt-3 text-[10px] text-emerald-400 font-semibold">↑ 12% bell accuracy this week</div>
            </div>

            {/* Card 6: Enterprise Security */}
            <div className="col-span-12 sm:col-span-6 md:col-span-3 group bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-orange-500/30 rounded-2xl p-6 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25 mb-4">
                <Shield size={17} className="text-white" />
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">Enterprise Security</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-5">
                RBAC, end-to-end encryption, SOC 2-ready. Your data, fully protected.
              </p>
              {/* Compliance badges */}
              <div className="space-y-2">
                {[
                  [KeyRound, 'End-to-end encrypted', 'text-orange-400'],
                  [Lock, 'FERPA & COPPA compliant', 'text-orange-400'],
                  [Shield, 'SOC 2 Type II ready', 'text-orange-400'],
                ].map(([Icon2, label, color], i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Icon2 size={11} className={color} />
                    <span className="text-[11px] text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════
              Capability pills strip
          ══════════════════════════════════ */}
          <div className="mt-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-6 py-5">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {CAPABILITY_PILLS.map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors">
                  <Icon size={13} className="text-blue-400/70" />
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section id="how-it-works" className="py-28 bg-gray-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-5">
              <Clock size={11} />
              Quick Setup
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Up and running in minutes
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              No hardware to purchase, no software to install. Sign up, configure, and your school
              bells start running on autopilot.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px"
              style={{ background: 'linear-gradient(90deg, #93c5fd, #a5b4fc, #c4b5fd)' }}
            />

            {STEPS.map(({ step, title, description }, i) => (
              <div key={i} className="relative text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl font-black shadow-2xl shadow-blue-500/25 mb-7 mx-auto group-hover:-translate-y-1 transition-transform duration-300">
                  {step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-px"
            >
              Get Started Free <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════ */}
      <section id="pricing" className="py-28 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-semibold uppercase tracking-wider mb-5">
              Simple Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Plans for every school
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
              Start free, scale as you grow. No hidden fees, no long-term contracts required.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  !annual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  annual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Annual
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  –20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {PLANS.map(({ name, price, priceAnnual, period, description, features, cta, popular }, i) => {
              const displayPrice = annual && priceAnnual ? priceAnnual : price;
              return (
                <div
                  key={i}
                  className={`relative rounded-2xl p-8 flex flex-col ${
                    popular
                      ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-500/30 md:-translate-y-4'
                      : 'bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow'
                  }`}
                >
                  {popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-lg">
                        <Star size={10} fill="currentColor" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${popular ? 'text-blue-200' : 'text-gray-400'}`}>
                    {name}
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-5xl font-extrabold tracking-tight ${popular ? 'text-white' : 'text-gray-900'}`}>
                      {displayPrice}
                    </span>
                    {period && (
                      <span className={`text-sm font-medium ${popular ? 'text-blue-200' : 'text-gray-400'}`}>
                        {period}
                      </span>
                    )}
                  </div>

                  <p className={`text-sm mb-7 ${popular ? 'text-blue-100' : 'text-gray-500'}`}>
                    {description}
                  </p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle
                          size={15}
                          className={`mt-0.5 flex-shrink-0 ${popular ? 'text-blue-300' : 'text-blue-600'}`}
                        />
                        <span className={`text-sm leading-snug ${popular ? 'text-blue-50' : 'text-gray-600'}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`text-center py-3 px-6 rounded-xl text-sm font-semibold transition-all hover:-translate-y-px ${
                      popular
                        ? 'bg-white text-indigo-700 hover:bg-blue-50 shadow-lg shadow-black/10'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40'
                    }`}
                  >
                    {cta}
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-gray-400 mt-10">
            All plans include a <strong className="text-gray-600">30-day free trial</strong>. No credit card required.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-5">
              <Users size={11} />
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Loved by school leaders
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Join thousands of principals, IT directors, and administrators who rely on SmartBell
              every single school day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ avatar, avatarGradient, name, role, content, rating }, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} size={14} fill="#f59e0b" className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">"{content}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                  >
                    {avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════ */}
      <section id="faq" className="py-28 scroll-mt-16 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f8faff 0%, #f0f4ff 40%, #fafaff 100%)' }}>
        {/* Subtle background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[90px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Header ── */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-5">
              <HelpCircle size={11} />
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              Everything you want to know
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Quick answers to the questions we hear most. Still stuck?{' '}
              <a href="mailto:hello@smartbell.io" className="text-blue-600 hover:underline font-semibold">
                We reply within an hour.
              </a>
            </p>
          </div>

          {/* ── Category Tabs ── */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {FAQ_CATEGORIES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveFaqCategory(id); setOpenFaq(null); }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeFaqCategory === id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* ── Two-column layout: accordion + sidebar ── */}
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Accordion — takes 2/3 */}
            <div className="lg:col-span-2 space-y-3">
              {FAQS.filter(f => activeFaqCategory === 'all' || f.category === activeFaqCategory).map(({ q, a, category }, i) => {
                const isOpen = openFaq === i;
                const catMeta = FAQ_CATEGORIES.find(c => c.id === category);
                const CatIcon = catMeta?.icon ?? HelpCircle;
                return (
                  <div
                    key={i}
                    className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? 'bg-white shadow-xl shadow-blue-50/80 border border-blue-100'
                        : 'bg-white/70 border border-gray-100 hover:border-blue-100 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center gap-4 px-6 py-5 text-left"
                    >
                      {/* Icon badge */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/30' : 'bg-gray-100 group-hover:bg-blue-50'
                      }`}>
                        <CatIcon size={15} className={isOpen ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'} />
                      </div>

                      <span className={`flex-1 text-[15px] font-semibold leading-snug transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
                        {q}
                      </span>

                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isOpen ? 'bg-blue-600 rotate-45' : 'bg-gray-100 group-hover:bg-blue-50'
                      }`}>
                        <Plus size={13} className={isOpen ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5">
                        <div className="pl-13 border-l-2 border-blue-100 ml-[52px] pl-4">
                          <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Empty state */}
              {FAQS.filter(f => activeFaqCategory === 'all' || f.category === activeFaqCategory).length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No questions in this category yet.
                </div>
              )}
            </div>

            {/* Sidebar — takes 1/3 */}
            <div className="space-y-4">
              {/* Stats card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-2xl shadow-blue-500/25">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                    <Bell size={15} className="text-white" />
                  </div>
                  <span className="font-bold text-sm">SmartBell at a glance</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Schools live right now', value: '2,400+' },
                    { label: 'Bells triggered today', value: '28,800+' },
                    { label: 'Avg. setup time', value: '< 30 min' },
                    { label: 'Customer satisfaction', value: '4.9 / 5 ★' },
                  ].map(({ label, value }, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                      <span className="text-xs text-blue-100">{label}</span>
                      <span className="text-sm font-bold text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact support card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-1">Still have questions?</h3>
                <p className="text-xs text-gray-400 mb-5 leading-relaxed">
                  Our support team is online Monday–Friday, 8am–6pm. We typically reply within an hour.
                </p>
                <div className="space-y-2.5">
                  <a
                    href="mailto:hello@smartbell.io"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-100 border border-transparent transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Mail size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 group-hover:text-blue-700">Email support</div>
                      <div className="text-[11px] text-gray-400">hello@smartbell.io</div>
                    </div>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-blue-400 ml-auto" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-violet-50 hover:border-violet-100 border border-transparent transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare size={14} className="text-violet-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 group-hover:text-violet-700">Live chat</div>
                      <div className="text-[11px] text-gray-400">Usually replies instantly</div>
                    </div>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-violet-400 ml-auto" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:border-emerald-100 border border-transparent transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={14} className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 group-hover:text-emerald-700">Documentation</div>
                      <div className="text-[11px] text-gray-400">Guides, API reference &amp; more</div>
                    </div>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-emerald-400 ml-auto" />
                  </a>
                </div>
              </div>

              {/* Trust badge */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/25">
                  <Shield size={17} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-1">Enterprise-grade security</div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    SOC 2 Type II · FERPA compliant · End-to-end encryption · 99.99% uptime SLA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="relative py-28 bg-[#060b18] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[110px]" />
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8">
            <Zap size={11} className="text-yellow-400" />
            Ready to get started?
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Ring into a smarter
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              school day
            </span>
          </h2>

          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
            Join 2,400+ schools already on SmartBell. Setup takes under 30 minutes and your
            first month is completely free — no card needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5"
            >
              Start Free Today
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-medium text-gray-300 border border-white/10 hover:bg-white/5 transition-all hover:-translate-y-0.5"
            >
              Log in to your account
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-600">
            No credit card required · 30-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-[#030509] text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Bell size={15} className="text-white" />
                </div>
                <span className="font-bold text-[17px] text-white">SmartBell</span>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-xs text-gray-500">
                Automating school bells and PA announcements for over 2,400 schools worldwide.
              </p>
              <div className="flex gap-2">
                {['TW', 'GH', 'LI'].map((s, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center text-[10px] font-bold text-gray-500 hover:text-gray-300"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {[
              { heading: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { heading: 'Resources', links: ['Documentation', 'API Reference', 'Blog', 'Status'] },
              { heading: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
            ].map(({ heading, links }, i) => (
              <div key={i}>
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-4">
                  {heading}
                </div>
                <ul className="space-y-2.5">
                  {links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <span>© {new Date().getFullYear()} SmartBell Technologies Ltd. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
