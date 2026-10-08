import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Card from '../common/Card';

export interface ModelPerformanceItem {
  metric: string;
  value: number;
}

export interface ModelPerformanceChartProps {
  data?: ModelPerformanceItem[];
}

const defaultData: ModelPerformanceItem[] = [
  { metric: 'Accuracy', value: 93.8 },
  { metric: 'Precision', value: 92.7 },
  { metric: 'Recall', value: 95.1 },
  { metric: 'F1 Score', value: 94.2 },
];

export const ModelPerformanceChart: React.FC<ModelPerformanceChartProps> = ({
  data = defaultData,
}) => {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Model Performance</h2>
        <p className="text-sm text-slate-500">
          Performance of the current best model
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
            <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ModelPerformanceChart;
