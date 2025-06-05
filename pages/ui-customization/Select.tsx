import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string; // Added placeholder prop
  leftIcon?: React.ReactElement<{ className?: string }>; // Updated type for leftIcon
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  id,
  error,
  options,
  placeholder, // Destructured placeholder
  leftIcon,    // Destructured leftIcon
  className = '',
  containerClassName = '',
  labelClassName = '',
  selectClassName = '',
  ...props
}) => {
  const baseSelectClasses = "block w-full pl-3 pr-10 py-2 text-base border rounded-md shadow-sm focus:outline-none sm:text-sm disabled:bg-neutral-200 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed";
  const errorSelectClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const normalSelectClasses = "border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-neutral-100";
  
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
        <select
          id={id}
          className={`${baseSelectClasses} ${error ? errorSelectClasses : normalSelectClasses} ${leftIcon ? 'pl-10' : ''} ${selectClassName} ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Select;