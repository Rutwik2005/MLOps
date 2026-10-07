import React from 'react';
import { Rocket } from 'lucide-react';
import Card from '../common/Card';
import DeploymentCard from './DeploymentCard';
import type { Deployment } from '../../types/deployment';
import type { RegisteredModel } from '../../types/model';

export interface DeploymentListProps {
  deployments: Deployment[];
  models: RegisteredModel[];
  search: string;
  onSearchChange: (value: string) => void;
}

export const DeploymentList: React.FC<DeploymentListProps> = ({
  deployments,
  models,
  search,
  onSearchChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Active Deployments</h2>
          <p className="text-sm text-slate-500">
            Model endpoints currently managed by the platform.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search deployments..."
          className="w-full md:w-80 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {deployments.length > 0 ? (
        <div className="space-y-4">
          {deployments.map((deployment, index) => (
            <DeploymentCard
              key={deployment.id ?? index}
              deployment={deployment}
              index={index}
              models={models}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Rocket size={30} />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-800">
            {search ? 'No deployments found' : 'No deployments yet'}
          </h3>

          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            {search
              ? 'Try a different search term.'
              : 'Select a registered model and deploy it to create a prediction endpoint.'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default DeploymentList;
