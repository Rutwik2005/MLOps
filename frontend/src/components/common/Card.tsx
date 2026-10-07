import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
