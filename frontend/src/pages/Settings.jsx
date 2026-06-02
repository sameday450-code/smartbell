import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, Building2, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="card p-5 sm:p-6">
      <h2 className="font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2 text-sm">
        <Icon className="w-4.5 h-4.5 text-primary-600" />
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const { changePassword } = useAuth();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const profileForm = useForm({ defaultValues: { name: user?.name, email: user?.email } });
  const passwordForm = useForm();

  const profileMutation = useMutation({
    mutationFn: (data) => api.put('/users/profile', data),
    onSuccess: (res) => { updateUser(res.data.data); toast.success('Profile updated'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update'),
  });

  const passwordMutation = useMutation({
    mutationFn: (data) => changePassword(data),
    onSuccess: () => { toast.success('Password changed'); passwordForm.reset(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to change password'),
  });

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <Section icon={User} title="Profile">
        <form onSubmit={profileForm.handleSubmit((d) => profileMutation.mutate(d))} className="space-y-4">
          <Input label="Full Name" {...profileForm.register('name', { required: true })} />
          <Input label="Email" type="email" {...profileForm.register('email', { required: true })} />
          <div className="flex justify-end">
            <Button type="submit" size="sm" loading={profileMutation.isPending}>Save Profile</Button>
          </div>
        </form>
      </Section>

      {/* Change Password */}
      <Section icon={Lock} title="Change Password">
        <form onSubmit={passwordForm.handleSubmit((d) => passwordMutation.mutate(d))} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register('currentPassword', { required: 'Required' })}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Min 8 chars, uppercase, number, symbol"
            error={passwordForm.formState.errors.newPassword?.message}
            {...passwordForm.register('newPassword', {
              required: 'Required',
              minLength: { value: 8, message: 'Min 8 characters' },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                message: 'Include uppercase, lowercase, number, and symbol',
              },
            })}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" loading={passwordMutation.isPending}>Change Password</Button>
          </div>
        </form>
      </Section>

      {/* Appearance */}
      <Section icon={Sun} title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
          </div>
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 flex items-center justify-center ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}>
              {darkMode ? <Moon className="w-3 h-3 text-primary-600" /> : <Sun className="w-3 h-3 text-gray-400" />}
            </span>
          </button>
        </div>
      </Section>

      {/* Account Info */}
      <Section icon={Building2} title="Account Info">
        <div className="space-y-3">
          {[
            { label: 'Role', value: user?.role?.replace('_', ' ') },
            { label: 'School', value: user?.school?.name || '—' },
            { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{value}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
