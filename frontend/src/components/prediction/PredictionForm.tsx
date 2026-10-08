import React from 'react';
import { BrainCircuit, Rocket, Activity, Play } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import type { FeatureSchema } from '../../types/deployment';
import { formatLabel } from '../../utils/formatters';

export interface PredictionFormProps {
  selectedDeploy: string;
  loadingSchema: boolean;
  featureList?: FeatureSchema[];
  featureNames?: string[];
  features: Record<string, any>;
  predicting: boolean;
  onFeatureChange: (feature: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({
  selectedDeploy,
  loadingSchema,
  featureList,
  featureNames,
  features,
  predicting,
  onFeatureChange,
  onSubmit,
}) => {
  const resolvedFeatures: FeatureSchema[] = React.useMemo(() => {
    if (featureList && featureList.length > 0) {
      return featureList;
    }
    if (featureNames && featureNames.length > 0) {
      return featureNames.map(name => ({
        name,
        type: 'string',
        required: true,
        options: [],
      }));
    }
    return [];
  }, [featureList, featureNames]);

  return (
    <Card className="xl:col-span-2 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
            <BrainCircuit size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">Model Input</h2>
            <p className="text-sm text-slate-500">
              Enter the feature values required by the deployed model.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-6">
        {!selectedDeploy ? (
          <div className="py-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Rocket size={30} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-800">
              Select a deployment
            </h3>

            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Choose a deployed model above to load its input schema.
            </p>
          </div>
        ) : loadingSchema ? (
          <div className="py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />

            <p className="mt-4 text-sm text-slate-500">
              Loading model schema...
            </p>
          </div>
        ) : resolvedFeatures.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Activity size={30} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-800">
              No input features found
            </h3>

            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              The selected deployment did not return a usable input schema.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {resolvedFeatures.map((feature: FeatureSchema) => {
                const isCategorical =
                  feature.type === 'categorical' &&
                  Array.isArray(feature.options) &&
                  feature.options.length > 0;
                const isBoolean =
                  feature.type === 'boolean' || feature.type === 'bool';
                const isNumber =
                  feature.type === 'number' ||
                  feature.type === 'numeric' ||
                  feature.type === 'float' ||
                  feature.type === 'int' ||
                  feature.type === 'integer';

                return (
                  <div key={feature.name}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {formatLabel(feature.name)}{' '}
                      {feature.required && <span className="text-red-500">*</span>}
                    </label>

                    {isCategorical ? (
                      <select
                        value={features[feature.name] ?? ''}
                        onChange={e => onFeatureChange(feature.name, e.target.value)}
                        required={feature.required}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                      >
                        <option value="">-- Select {formatLabel(feature.name)} --</option>
                        {feature.options!.map((opt: any) => (
                          <option key={String(opt)} value={String(opt)}>
                            {String(opt)}
                          </option>
                        ))}
                      </select>
                    ) : isBoolean ? (
                      <select
                        value={features[feature.name] ?? ''}
                        onChange={e => onFeatureChange(feature.name, e.target.value)}
                        required={feature.required}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                      >
                        <option value="">-- Select --</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    ) : (
                      <input
                        type={isNumber ? 'number' : 'text'}
                        step={isNumber ? 'any' : undefined}
                        value={features[feature.name] ?? ''}
                        onChange={e => onFeatureChange(feature.name, e.target.value)}
                        onWheel={isNumber ? e => e.currentTarget.blur() : undefined}
                        placeholder={`Enter ${formatLabel(feature.name)}`}
                        required={feature.required}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Input features detected</p>
              <p className="text-lg font-semibold text-slate-800 mt-1">
                {resolvedFeatures.length}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={predicting}>
                <Play size={18} className="mr-2" />
                {predicting ? 'Running Prediction...' : 'Run Prediction'}
              </Button>
            </div>
          </>
        )}
      </form>
    </Card>
  );
};

export default PredictionForm;
