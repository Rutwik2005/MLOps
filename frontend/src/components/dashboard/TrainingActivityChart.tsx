import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import Card from '../common/Card';

export interface TrainingActivityItem {
  month: string;
  jobs: number;
}

export interface TrainingActivityChartProps {
  data?: TrainingActivityItem[];
}

const defaultData: TrainingActivityItem[] = [
  { month: 'Jan', jobs: 3 },
  { month: 'Feb', jobs: 5 },
  { month: 'Mar', jobs: 4 },
  { month: 'Apr', jobs: 7 },
  { month: 'May', jobs: 6 },
  { month: 'Jun', jobs: 8 },
];

export const TrainingActivityChart: React.FC<TrainingActivityChartProps> = ({
  data = defaultData,
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Training Activity</h2>
          <p className="text-sm text-slate-500">
            Training jobs completed over time
          </p>
        </div>
        <TrendingUp size={20} className="text-indigo-600" />
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="jobs"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: '#4f46e5',
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TrainingActivityChart;
