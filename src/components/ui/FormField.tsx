
import React from 'react';
import { cn } from '@/utils';
import { FormFieldProps } from '@/types';

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  className,
  children,
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;
