import React, { useState } from 'react';
import { BrainCircuit, CheckCircle2, Play } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import type { Dataset } from '../../types/dataset';
import type { TrainingRequest } from '../../types/training';

export interface TrainingConfigProps {
  datasets: Dataset[];
  onSubmit: (config: TrainingRequest) => Promise<boolean>;
  loading?: boolean;
}

export const TrainingConfig: React.FC<TrainingConfigProps> = ({
  datasets,
  onSubmit,
  loading = false,
}) => {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [targetCol, setTargetCol] = useState('');
  const [algorithm, setAlgorithm] = useState('Random Forest');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit({
      dataset_id: Number(selectedDataset),
      target_column: targetCol,
      algorithm,
    });

    if (success) {
      setSelectedDataset('');
      setTargetCol('');
      setAlgorithm('Random Forest');
    }
  };

  const selectedDatasetObj = datasets.find(
    d => String(d.id) === String(selectedDataset)
  );

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <BrainCircuit size={22} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Start New Training</h2>
            <p className="text-sm text-slate-500">
              Select a dataset and configure the model training job.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Dataset */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Dataset
            </label>
            <select
              value={selectedDataset}
              onChange={e => setSelectedDataset(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select dataset</option>
              {datasets.map(dataset => (
                <option key={dataset.id} value={dataset.id}>
                  {dataset.name} — #{dataset.id}
                </option>
              ))}
            </select>
            {datasets.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">
                Upload a dataset before starting training.
              </p>
            )}
          </div>

          {/* Target Column */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Target Column
            </label>
            <Input
              value={targetCol}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetCol(e.target.value)}
              required
              placeholder="e.g. target, price, label"
            />
            <p className="text-xs text-slate-400 mt-2">
              Column the model should learn to predict.
            </p>
          </div>

          {/* Algorithm */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Algorithm
            </label>
            <select
              value={algorithm}
              onChange={e => setAlgorithm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Logistic Regression">Logistic Regression</option>
              <option value="Random Forest">Random Forest</option>
              <option value="XGBoost">XGBoost</option>
            </select>
          </div>
        </div>

        {/* Selected configuration preview */}
        {selectedDataset && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Training Configuration
                </p>
                <p className="text-sm text-slate-700 mt-1">
                  Dataset:{' '}
                  <span className="font-semibold">
                    {selectedDatasetObj?.name || selectedDataset}
                  </span>
                </p>
                <p className="text-sm text-slate-700">
                  Target:{' '}
                  <span className="font-semibold">
                    {targetCol || 'Not specified'}
                  </span>
                </p>
                <p className="text-sm text-slate-700">
                  Algorithm: <span className="font-semibold">{algorithm}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-blue-700">
                <CheckCircle2 size={18} />
                Ready to train
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={loading || datasets.length === 0}>
            <Play size={18} className="mr-2" />
            {loading ? 'Starting Training...' : 'Start Training Job'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TrainingConfig;
