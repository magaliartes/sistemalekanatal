import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger';
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {

  const classes = {
    primary: 'btn btn-primary',
    outline: 'btn btn-outline',
    danger: 'btn bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      className={`${classes[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}