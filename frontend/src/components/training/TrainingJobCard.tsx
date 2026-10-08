import React from 'react';
import { BrainCircuit } from 'lucide-react';
import Card from '../common/Card';
import type { TrainingJob } from '../../types/training';
import type { Dataset } from '../../types/dataset';
import { getStatusStyle, getStatusLabel } from '../../utils/formatters';

export interface TrainingJobCardProps {
  job: TrainingJob;
  index: number;
  datasets: Dataset[];
}

export const TrainingJobCard: React.FC<TrainingJobCardProps> = ({
  job,
  index,
  datasets,
}) => {
  const status = job.status || 'Unknown';
  const dataset = datasets.find(d => String(d.id) === String(job.dataset_id));

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        {/* Job Information */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
            <BrainCircuit size={22} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900">
                Training Job #{job.id ?? index + 1}
              </h3>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(
                  status
                )}`}
              >
                {getStatusLabel(status)}
              </span>
            </div>

            <p className="text-sm text-slate-500 mt-1">
              {dataset?.name
                ? dataset.name
                : job.dataset_id
                ? `Dataset #${job.dataset_id}`
                : 'Dataset not specified'}
            </p>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-sm">
          <div>
            <p className="text-xs text-slate-400">Algorithm</p>
            <p className="font-medium text-slate-700 mt-1">
              {job.algorithm || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Target</p>
            <p className="font-medium text-slate-700 mt-1">
              {job.target_column || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Job ID</p>
            <p className="font-medium text-slate-700 mt-1">#{job.id ?? '—'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrainingJobCard;
