import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-primary text-on-primary hover:brightness-110 disabled:opacity-50',
    secondary: 'bg-surface-container text-on-surface border border-outline-variant/30 hover:border-primary/40 disabled:opacity-50',
    danger: 'bg-error/15 text-error border border-error/30 hover:bg-error/25 disabled:opacity-50',
    ghost: 'bg-transparent text-primary hover:underline underline-offset-4 disabled:opacity-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⏳</span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-surface-container-lowest p-6 ${className}`}>{children}</div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-surface-variant/80 backdrop-blur-[20px] flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-md shadow-luxury-ambient max-w-md w-full mx-4 border border-outline-variant/20">
        <div className="flex justify-between items-center p-6 border-b border-surface-container">
          <h2 className="headline text-2xl">{title}</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface text-2xl">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="p-6 bg-surface-container-low flex gap-4">{footer}</div>}
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-surface-container border-t-secondary rounded-full animate-spin`} />
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => (
  <div className="mb-6 relative">
    {label && <label className="block text-xs tracking-wider uppercase font-medium text-on-surface-variant mb-1">{label}</label>}
    <input
      className={`input-quiet w-full ${
        error ? 'border-error' : ''
      } ${className}`}
      {...props}
    />
    {error && <p className="text-error text-sm mt-1 absolute -bottom-5">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, ...props }) => (
  <div className="mb-6 relative">
    {label && <label className="block text-xs tracking-wider uppercase font-medium text-on-surface-variant mb-1">{label}</label>}
    <select
      className={`input-quiet w-full bg-surface-container-lowest ${
        error ? 'border-error' : ''
      } ${className}`}
      {...props}
    >
      <option value="">Select an option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-error text-sm mt-1 absolute -bottom-5">{error}</p>}
  </div>
);

export const Alert: React.FC<{ type: 'success' | 'error' | 'info'; message: string }> = ({ type, message }) => {
  const colors = {
    success: 'bg-surface-container text-on-surface border-l-4 border-l-secondary',
    error: 'bg-error-container text-on-error-container border-l-4 border-l-error',
    info: 'bg-primary-container text-on-primary-container border-l-4 border-l-primary',
  };

  return (
    <div className={`p-4 mb-4 ${colors[type]}`}>
      <span className="text-sm">{message}</span>
    </div>
  );
};
