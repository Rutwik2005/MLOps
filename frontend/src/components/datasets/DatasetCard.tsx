import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import type { Dataset } from '../../types/dataset';

export interface DatasetCardProps {
  dataset: Dataset;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
  const navigate = useNavigate();

  return (
    <Card className="p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
          <Database size={22} />
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
          Available
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-lg font-semibold text-slate-900 truncate">
          {dataset.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-[40px]">
          {dataset.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Dataset ID</span>
          <span className="font-semibold text-slate-700">#{dataset.id}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-2">
          <span className="text-slate-400">Format</span>
          <span className="font-semibold text-slate-700">CSV</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/training')}
        className="w-full mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-slate-800 transition"
      >
        Train Model
        <ChevronRight size={16} />
      </button>
    </Card>
  );
};

export default DatasetCard;
