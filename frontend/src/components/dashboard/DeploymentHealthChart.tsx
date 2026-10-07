import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';

export interface DeploymentHealthItem {
  name: string;
  value: number;
}

export interface DeploymentHealthChartProps {
  data?: DeploymentHealthItem[];
  colors?: string[];
}

const defaultData: DeploymentHealthItem[] = [
  { name: 'Healthy', value: 2 },
  { name: 'Warning', value: 1 },
  { name: 'Failed', value: 0 },
];

const defaultColors = ['#22c55e', '#f59e0b', '#ef4444'];

export const DeploymentHealthChart: React.FC<DeploymentHealthChartProps> = ({
  data = defaultData,
  colors = defaultColors,
}) => {
  return (
    <Card className="p-6">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-slate-900">Deployment Health</h2>
        <p className="text-sm text-slate-500">Current deployment status</p>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DeploymentHealthChart;
