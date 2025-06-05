
import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  name: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepClick, className = '' }) => {
  return (
    <nav aria-label="Progress" className={`mb-8 ${className}`}>
      <ol role="list" className="flex items-center justify-center space-x-2 sm:space-x-4">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative flex-1">
            {stepIdx < currentStep ? (
              // Completed step
              <div className="group flex items-center w-full cursor-pointer" onClick={() => onStepClick && onStepClick(stepIdx)}>
                <span className="flex items-center px-2 py-1 text-xs font-medium">
                  <span className="flex h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 group-hover:bg-primary-800">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hidden sm:inline-block">{step.name}</span>
                </span>
              </div>
            ) : stepIdx === currentStep ? (
              // Current step
              <div className="flex items-center px-2 py-1 text-xs font-medium" aria-current="step">
                <span className="flex h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-600">
                  <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-primary-600" />
                </span>
                <span className="ml-2 text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400 hidden sm:inline-block">{step.name}</span>
              </div>
            ) : (
              // Upcoming step
              <div className="group flex items-center w-full cursor-pointer" onClick={() => onStepClick && onStepClick(stepIdx)}>
                <span className="flex items-center px-2 py-1 text-xs font-medium">
                  <span className="flex h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-neutral-300 dark:border-neutral-600 group-hover:border-neutral-400 dark:group-hover:border-neutral-500">
                    {/* Placeholder for number or icon if needed */}
                  </span>
                  <span className="ml-2 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 hidden sm:inline-block">{step.name}</span>
                </span>
              </div>
            )}

            {/* Connector */}
            {stepIdx !== steps.length - 1 ? (
              <div className="absolute top-1/2 right-0 w-1/2 h-0.5 -translate-y-1/2 transform bg-neutral-300 dark:bg-neutral-600" />
            ) : null}
             {stepIdx !== 0 ? (
              <div className="absolute top-1/2 left-0 w-1/2 h-0.5 -translate-y-1/2 transform bg-neutral-300 dark:bg-neutral-600" />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepIndicator;
    