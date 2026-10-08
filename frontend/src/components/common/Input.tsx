import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', type, onWheel, ...props }) => (
  <input
    type={type}
    onWheel={e => {
      if (type === 'number') {
        e.currentTarget.blur();
      }
      onWheel?.(e);
    }}
    className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${className}`}
    {...props}
  />
);

export default Input;
