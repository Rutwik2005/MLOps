import React from 'react';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  action?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, category, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        {category && (
          <p className="text-sm font-medium text-blue-600 mb-1">{category}</p>
        )}
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default Header;
