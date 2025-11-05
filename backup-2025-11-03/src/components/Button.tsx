import React from 'react';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  withArrow?: boolean;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  children,
  withArrow = false,
  variant = 'secondary',
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold tracking-wider rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-neumorphic-background focus:ring-brand-accent';

  const variantClasses = {
    primary: 'bg-brand-dark text-white shadow-lg hover:bg-opacity-90 active:scale-[0.98]',
    secondary: 'bg-neumorphic-background text-brand-gray-400 shadow-neumorphic-outset-sm hover:text-brand-accent active:shadow-neumorphic-inset-sm active:scale-[0.98]',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
      {withArrow && <ArrowRightIcon className="text-brand-accent"/>}
    </button>
  );
};

export default Button;
