import React from 'react';
import { Database } from 'lucide-react';
import Card from '../common/Card';
import DatasetCard from './DatasetCard';
import type { Dataset } from '../../types/dataset';

export interface DatasetListProps {
  datasets: Dataset[];
  search: string;
  onSearchChange: (value: string) => void;
}

export const DatasetList: React.FC<DatasetListProps> = ({
  datasets,
  search,
  onSearchChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Dataset Library</h2>
          <p className="text-sm text-slate-500">
            Browse datasets currently available in the platform.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search datasets..."
            className="w-full rounded-xl border border-slate-200 bg-white
              px-4 py-2.5 text-sm outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {datasets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {datasets.map(dataset => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Database size={30} />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-slate-800">
            {search ? 'No datasets found' : 'No datasets uploaded yet'}
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            {search
              ? 'Try a different search term.'
              : 'Upload your first CSV dataset to start the ML training workflow.'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default DatasetList;
