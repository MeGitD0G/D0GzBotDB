
import React from 'react';

interface CardProps {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
  icon?: React.ReactElement; // Added icon prop
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', bodyClassName = '', footer, icon }) => {
  return (
    <div className={`bg-white dark:bg-neutral-800 shadow-lg rounded-xl overflow-hidden ${className}`}>
      {title && (
        <div className={`px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center ${titleClassName}`}>
          {icon && <span className="mr-2 shrink-0">{icon}</span>}
          {typeof title === 'string' ? (
            <h3 className="text-lg font-semibold leading-6 text-neutral-900 dark:text-neutral-100">{title}</h3>
          ) : (
            <div className="text-lg font-semibold leading-6 text-neutral-900 dark:text-neutral-100">{title}</div>
          )}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-750 border-t border-neutral-200 dark:border-neutral-700">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
