import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({ label, error, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label">{label}</label>}
    <input
      ref={ref}
      className={clsx('input', error && 'border-red-400 dark:border-red-500 focus:ring-red-400/50', className)}
      {...props}
    />
    {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
