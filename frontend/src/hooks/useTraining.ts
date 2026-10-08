import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { datasetApi } from '../api/datasetApi';
import { trainingApi } from '../api/trainingApi';
import type { Dataset } from '../types/dataset';
import type { TrainingJob, TrainingRequest } from '../types/training';

export const useTraining = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const datasetsData = await datasetApi.getDatasets();
      setDatasets(datasetsData);
    } catch {
      toast.error('Failed to load datasets');
    }

    try {
      const jobsData = await trainingApi.getTrainingJobs();
      setJobs(jobsData || []);
    } catch {
      // If backend does not yet expose job listing, keep empty
      setJobs([]);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startTrainingJob = async (config: TrainingRequest): Promise<boolean> => {
    if (!config.dataset_id) {
      toast.error('Please select a dataset');
      return false;
    }

    if (!config.target_column.trim()) {
      toast.error('Please enter the target column');
      return false;
    }

    setLoading(true);

    try {
      const res = await trainingApi.startTraining(config);
      if (res?.job) {
        setJobs(prev => [res.job, ...prev]);
      } else if (res) {
        setJobs(prev => [res, ...prev]);
      }

      toast.success('Training job started successfully!');
      return true;
    } catch {
      toast.error('Failed to start training job');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const query = search.toLowerCase();
    return (
      String(job.id ?? '')
        .toLowerCase()
        .includes(query) ||
      String(job.algorithm ?? '')
        .toLowerCase()
        .includes(query) ||
      String(job.status ?? '')
        .toLowerCase()
        .includes(query) ||
      String(job.target_column ?? '')
        .toLowerCase()
        .includes(query)
    );
  });

  const completedJobs = jobs.filter(
    job =>
      String(job.status ?? '').toLowerCase() === 'completed' ||
      String(job.status ?? '').toLowerCase() === 'success'
  ).length;

  const runningJobs = jobs.filter(
    job =>
      String(job.status ?? '').toLowerCase() === 'running' ||
      String(job.status ?? '').toLowerCase() === 'pending'
  ).length;

  const failedJobs = jobs.filter(
    job =>
      String(job.status ?? '').toLowerCase() === 'failed' ||
      String(job.status ?? '').toLowerCase() === 'error'
  ).length;

  return {
    datasets,
    jobs,
    filteredJobs,
    search,
    setSearch,
    loading,
    fetching,
    completedJobs,
    runningJobs,
    failedJobs,
    startTrainingJob,
    refreshTraining: fetchData,
  };
};

export default useTraining;
