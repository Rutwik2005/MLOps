import React from 'react';
import { BrainCircuit } from 'lucide-react';

export interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-slate-500 animate-pulse flex flex-col items-center">
          <BrainCircuit size={48} className="mb-4 text-indigo-400" />
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 text-center">
      <div className="mx-auto w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
      {message && <p className="mt-4 text-sm text-slate-500">{message}</p>}
    </div>
  );
};

export default Loading;
