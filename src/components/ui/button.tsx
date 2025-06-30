import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => {
  let base = 'px-6 py-2 rounded-lg font-bold transition focus:outline-none ';
  let style = '';
  let sizeClass = '';
  switch (variant) {
    case 'secondary':
      style = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
      break;
    case 'outline':
      style = 'border-2 border-indigo-600 text-indigo-700 bg-white hover:bg-indigo-50';
      break;
    default:
      style = 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white hover:from-indigo-700 hover:to-purple-600';
  }
  switch (size) {
    case 'sm':
      sizeClass = 'text-sm px-4 py-2';
      break;
    case 'lg':
      sizeClass = 'text-lg px-8 py-4';
      break;
    default:
      sizeClass = 'text-base px-6 py-2';
  }
  return (
    <button className={`${base} ${style} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
