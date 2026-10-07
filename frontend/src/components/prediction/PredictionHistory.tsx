import React from 'react';
import { CheckCircle2, BrainCircuit } from 'lucide-react';
import Card from '../common/Card';
import type { PredictionHistoryItem } from '../../types/prediction';

export interface PredictionResultCardProps {
  prediction: any;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({ prediction }) => {
  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Prediction Result</h2>
            <p className="text-sm text-slate-500">Latest inference output</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {prediction !== null ? (
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider font-medium text-slate-400">
              Predicted Value
            </div>

            <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-100 p-8">
              <p className="text-4xl font-bold text-emerald-700 break-words">
                {typeof prediction === 'object'
                  ? JSON.stringify(prediction)
                  : String(prediction)}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 size={17} />
              Prediction completed successfully
            </div>
          </div>
        ) : (
          <div className="py-10 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <BrainCircuit size={30} />
            </div>

            <h3 className="mt-5 font-semibold text-slate-800">
              No prediction yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Enter the model inputs and run a prediction.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export interface PredictionHistoryProps {
  history: PredictionHistoryItem[];
}

export const PredictionHistory: React.FC<PredictionHistoryProps> = ({ history }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Recent Predictions</h2>
        <p className="text-sm text-slate-500">
          Predictions generated during this session.
        </p>
      </div>

      {history.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="divide-y divide-slate-100">
            {history.map(item => (
              <div
                key={item.id}
                className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {item.deployment}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                  </div>
                </div>

                <div className="text-sm font-semibold text-slate-700 break-all">
                  {typeof item.prediction === 'object'
                    ? JSON.stringify(item.prediction)
                    : String(item.prediction)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">
            No predictions have been made during this session.
          </p>
        </Card>
      )}
    </div>
  );
};

export default PredictionHistory;
