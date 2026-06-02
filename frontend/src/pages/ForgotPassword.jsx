import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, MailCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    // TODO: wire up API endpoint
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    toast.success('Reset email sent (demo)');
  };

  return (
    <div>
      <Link to="/login" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to login
      </Link>

      {!sent ? (
        <>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Forgot password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your email and we'll send a reset link.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@school.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Button type="submit" className="w-full justify-center" loading={isSubmitting} size="lg">
              Send reset link
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MailCheck className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Check your email</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We've sent a password reset link to your email address.</p>
          <Link to="/login" className="btn-primary btn text-sm">Back to login</Link>
        </div>
      )}
    </div>
  );
}
