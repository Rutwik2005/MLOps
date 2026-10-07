import React from 'react';
import { Rocket } from 'lucide-react';
import Card from '../common/Card';
import type { Deployment } from '../../types/deployment';
import { getStatusStyle } from '../../utils/formatters';

export interface DeploymentSelectorProps {
  deployments: Deployment[];
  selectedDeploy: string;
  onSelectDeploy: (name: string) => void;
  deploymentStatus: string;
}

export const DeploymentSelector: React.FC<DeploymentSelectorProps> = ({
  deployments,
  selectedDeploy,
  onSelectDeploy,
  deploymentStatus,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Rocket size={22} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Select Deployment</h2>
            <p className="text-sm text-slate-500">
              Choose the deployed model you want to query.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Deployment Endpoint
            </label>
            <select
              value={selectedDeploy}
              onChange={e => onSelectDeploy(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select deployment</option>
              {deployments.map((deployment, index) => {
                const name =
                  deployment.name ||
                  deployment.deployment_name ||
                  `Deployment #${deployment.id || index + 1}`;

                return (
                  <option key={deployment.id || index} value={name}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-end">
            <div className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Endpoint Status</span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(
                    deploymentStatus
                  )}`}
                >
                  {deploymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DeploymentSelector;
