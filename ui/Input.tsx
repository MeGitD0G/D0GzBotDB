
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  leftIcon?: React.ReactElement<{ className?: string }>;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  error,
  className = '', // This now applies to the main input element
  containerClassName = '',
  labelClassName = '',
  inputClassName = '', // Kept for additional input specific classes if needed, combined with className
  leftIcon,
  ...props
}) => {
  const baseInputClasses = "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm disabled:bg-neutral-200 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed";
  const errorInputClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const normalInputClasses = "border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-neutral-100";

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {React.cloneElement(leftIcon, {
              className: `${leftIcon.props.className || ''} h-5 w-5 text-neutral-400 dark:text-neutral-500`
            })}
          </div>
        )}
        <input
          id={id}
          className={`${baseInputClasses} ${error ? errorInputClasses : normalInputClasses} ${leftIcon ? 'pl-10' : ''} ${inputClassName} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Input;