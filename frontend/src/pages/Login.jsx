import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 transition-colors group"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </Link>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sign in to your SmartBell account</p>

      <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@school.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline">Forgot password?</Link>
        </div>

        <Button type="submit" className="w-full justify-center" loading={isLoggingIn} size="lg">
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 font-medium hover:underline">Register here</Link>
      </p>
    </div>
  );
}
