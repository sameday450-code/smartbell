import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeft } from 'lucide-react';

export default function Register() {
  const { register: registerUser, isRegistering } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 transition-colors group"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </Link>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Create account</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Join SmartBell and automate your school bells</p>

      <form onSubmit={handleSubmit((data) => registerUser(data))} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Personal details */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Your details</p>
            <Input
              label="Full name"
              placeholder="John Mensah"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="admin@yourschool.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min 8 chars, uppercase, number, symbol"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                  message: 'Include uppercase, lowercase, number, and symbol',
                },
              })}
            />
          </div>

          {/* School details */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">School details</p>
            <Input
              label="School name"
              placeholder="Springfield Academy"
              error={errors.schoolName?.message}
              {...register('schoolName', { required: 'School name is required' })}
            />
            <Input
              label="School email"
              type="email"
              placeholder="info@springfieldacademy.edu"
              error={errors.schoolEmail?.message}
              {...register('schoolEmail', { required: 'School email is required' })}
            />
          </div>
        </div>

        <Button type="submit" className="w-full justify-center" loading={isRegistering} size="lg">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
