import React from 'react';

export const Badge: React.FC<{ className?: string; children: React.ReactNode; variant?: 'primary' | 'secondary' }> = ({ className = '', children, variant = 'primary' }) => {
  let style = '';
  switch (variant) {
    case 'secondary':
      style = 'bg-purple-100 text-purple-700';
      break;
    default:
      style = 'bg-indigo-100 text-indigo-700';
  }
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${style} ${className}`}>
      {children}
    </span>
  );
};
