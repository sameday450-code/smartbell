import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Zap, Building2, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const PLANS = [
  {
    id: 'STARTER',
    name: 'Starter',
    price: '$0',
    period: '/month',
    devices: 5,
    features: ['5 Devices', 'Default Bell Schedules', 'Basic Announcements', 'Email Support'],
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    price: '$49',
    period: '/month',
    devices: 25,
    popular: true,
    features: ['25 Devices', 'Custom Audio Uploads', 'Text-to-Speech', 'Analytics Dashboard', 'Priority Support'],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: '$149',
    period: '/month',
    devices: 'Unlimited',
    features: ['Unlimited Devices', 'Emergency Broadcasts', 'Advanced Analytics', 'API Access', 'Dedicated Support', 'SLA Guarantee'],
  },
];

export default function Billing() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.get('/subscriptions/current').then((r) => r.data.data),
  });

  const upgradeMutation = useMutation({
    mutationFn: (plan) => api.post('/subscriptions/upgrade', { plan }),
    onSuccess: (_, plan) => { toast.success(`Upgraded to ${plan}!`); qc.invalidateQueries({ queryKey: ['subscription'] }); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to upgrade'),
  });

  const currentPlan = data?.plan || 'STARTER';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription & Billing</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your SmartBell plan</p>
      </div>

      {/* Current Plan */}
      {!isLoading && data && (
        <div className="card p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Current Plan</p>
                <p className="font-bold text-gray-900 dark:text-white capitalize">{currentPlan.toLowerCase()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={data.status === 'ACTIVE' ? 'green' : 'red'}>{data.status}</Badge>
              {data.expiresAt && (
                <p className="text-xs text-gray-400">Renews {new Date(data.expiresAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">Devices used</p>
              <p className="font-bold text-gray-900 dark:text-white">{data.devicesUsed ?? 0} / {data.deviceLimit ?? 5}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">Announcements this month</p>
              <p className="font-bold text-gray-900 dark:text-white">{data.monthlyAnnouncements ?? 0}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">Features</p>
              <p className="font-bold text-gray-900 dark:text-white text-xs">{data.features?.join(', ') || 'Basic'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div key={plan.id} className={`card p-5 border-2 transition-colors ${isCurrent ? 'border-primary-500' : 'border-gray-100 dark:border-gray-800'} ${plan.popular ? 'shadow-lg shadow-primary-100 dark:shadow-primary-900/20' : ''}`}>
              {plan.popular && (
                <span className="inline-block bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-3">Most Popular</span>
              )}
              {isCurrent && !plan.popular && (
                <span className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-3">Current Plan</span>
              )}
              <div className="flex items-end gap-1 mb-1">
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-400 text-sm pb-0.5">{plan.period}</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">{plan.name}</h3>
              <ul className="space-y-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <button disabled className="btn btn-outline w-full justify-center text-sm opacity-50 cursor-default">Current Plan</button>
              ) : (
                <Button
                  className="w-full justify-center text-sm"
                  variant={plan.popular ? 'primary' : 'outline'}
                  loading={upgradeMutation.isPending && upgradeMutation.variables === plan.id}
                  onClick={() => upgradeMutation.mutate(plan.id)}
                >
                  <Zap className="w-4 h-4" />
                  {PLANS.indexOf(plan) > PLANS.findIndex((p) => p.id === currentPlan) ? 'Upgrade' : 'Downgrade'}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
