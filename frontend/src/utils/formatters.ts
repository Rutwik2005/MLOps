export const getStatusStyle = (status: string): string => {
  const normalized = String(status || '').toLowerCase();

  if (
    normalized === 'completed' ||
    normalized === 'success' ||
    normalized === 'succeeded' ||
    normalized === 'active' ||
    normalized === 'running' ||
    normalized === 'deployed' ||
    normalized === 'healthy' ||
    normalized === 'production'
  ) {
    return 'bg-emerald-50 text-emerald-700';
  }

  if (
    normalized === 'pending' ||
    normalized === 'deploying' ||
    normalized === 'creating' ||
    normalized === 'queued'
  ) {
    return 'bg-blue-50 text-blue-700';
  }

  if (
    normalized === 'failed' ||
    normalized === 'error' ||
    normalized === 'stopped'
  ) {
    return 'bg-red-50 text-red-700';
  }

  return 'bg-slate-100 text-slate-600';
};

export const getStatusLabel = (status: string): string => {
  if (!status) return 'Unknown';

  const normalized = String(status).toLowerCase();

  if (normalized === 'success' || normalized === 'succeeded') {
    return 'Completed';
  }

  if (normalized === 'running') return 'Active';
  if (normalized === 'deployed') return 'Active';
  if (normalized === 'production') return 'Production';

  return String(status).charAt(0).toUpperCase() + String(status).slice(1);
};

export const formatLabel = (name: string): string => {
  if (!name) return '';
  if (name.toLowerCase() === 'bmi') return 'BMI';
  if (name.toLowerCase() === 'id') return 'ID';
  return name
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};
