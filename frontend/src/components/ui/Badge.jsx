import clsx from 'clsx';

const variants = {
  green: 'badge-green',
  red: 'badge-red',
  yellow: 'badge-yellow',
  blue: 'badge-blue',
  gray: 'badge-gray',
};

export default function Badge({ children, variant = 'gray', className }) {
  return (
    <span className={clsx(variants[variant], 'badge', className)}>
      {children}
    </span>
  );
}
