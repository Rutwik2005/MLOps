import React from 'react';
import Card from '../common/Card';

export interface RecentActivityItem {
  type: 'success' | 'warning' | 'error';
  title: string;
  description: string;
  time: string;
}

export interface RecentActivityProps {
  activities?: RecentActivityItem[];
}

const defaultActivities: RecentActivityItem[] = [
  {
    type: 'success',
    title: 'Training completed',
    description: 'XGBoost — Customer Churn',
    time: '2 minutes ago',
  },
  {
    type: 'success',
    title: 'Model registered',
    description: 'Customer Churn v3',
    time: '8 minutes ago',
  },
  {
    type: 'warning',
    title: 'Model health warning',
    description: 'Fraud Detection v2',
    time: '15 minutes ago',
  },
  {
    type: 'success',
    title: 'Dataset uploaded',
    description: 'Customer Data v4',
    time: '20 minutes ago',
  },
];

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = defaultActivities,
}) => {
  return (
    <Card className="p-6 lg:col-span-2">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
        <p className="text-sm text-slate-500">
          Latest events in your ML lifecycle
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div
              className={`mt-1 w-2.5 h-2.5 rounded-full ${
                item.type === 'warning' ? 'bg-amber-500' : 'bg-green-500'
              }`}
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
            </div>
            <span className="text-xs text-slate-400">{item.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
