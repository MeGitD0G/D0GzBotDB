import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string; // Use 'textareaClassName' to avoid conflict with React's 'className'
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  id,
  error,
  className = '', // This will apply to the root container div
  containerClassName = '',
  labelClassName = '',
  textareaClassName = '', // Class for the textarea element itself
  rows = 3,
  ...props
}) => {
  const baseTextareaClasses = "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm disabled:bg-neutral-200 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed";
  const errorTextareaClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const normalTextareaClasses = "border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-neutral-100";

  return (
    <div className={`mb-4 ${containerClassName} ${className}`}>
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 ${labelClassName}`}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`${baseTextareaClasses} ${error ? errorTextareaClasses : normalTextareaClasses} ${textareaClassName}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Textarea;