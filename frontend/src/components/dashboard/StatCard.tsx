import React from 'react';
import Card from '../common/Card';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  subtextColor?: string;
  icon: React.ElementType;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  subtextColor = 'text-green-600',
  icon: Icon,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
}) => {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {subtext && <p className={`text-xs mt-2 ${subtextColor}`}>{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor}`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
