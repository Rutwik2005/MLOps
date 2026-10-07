import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { deploymentApi } from '../api/deploymentApi';
import type { Deployment, DeploymentCreateRequest } from '../types/deployment';

export const useDeployments = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchDeployments = useCallback(async () => {
    setFetching(true);
    try {
      const data = await deploymentApi.getDeployments();
      setDeployments(data);
    } catch {
      toast.error('Failed to load deployments');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  const deployModel = async (
    modelId: string | number,
    data: DeploymentCreateRequest
  ): Promise<boolean> => {
    if (!modelId) {
      toast.error('Please select a model');
      return false;
    }

    if (!data.name.trim()) {
      toast.error('Please enter a deployment name');
      return false;
    }

    setLoading(true);

    try {
      await deploymentApi.deployModel(modelId, data);
      toast.success('Model deployment started!');
      await fetchDeployments();
      return true;
    } catch {
      toast.error('Deployment failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const filteredDeployments = deployments.filter(deployment => {
    const query = search.toLowerCase();
    return (
      String(deployment.id ?? '')
        .toLowerCase()
        .includes(query) ||
      String(deployment.name ?? '')
        .toLowerCase()
        .includes(query) ||
      String(deployment.status ?? '')
        .toLowerCase()
        .includes(query) ||
      String(deployment.model_id ?? '')
        .toLowerCase()
        .includes(query)
    );
  });

  const activeDeployments = deployments.filter(deployment => {
    const status = String(deployment.status ?? '').toLowerCase();
    return (
      status === 'active' ||
      status === 'running' ||
      status === 'deployed' ||
      status === 'healthy'
    );
  }).length;

  const pendingDeployments = deployments.filter(deployment => {
    const status = String(deployment.status ?? '').toLowerCase();
    return (
      status === 'pending' ||
      status === 'deploying' ||
      status === 'creating'
    );
  }).length;

  return {
    deployments,
    filteredDeployments,
    search,
    setSearch,
    loading,
    fetching,
    activeDeployments,
    pendingDeployments,
    deployModel,
    refreshDeployments: fetchDeployments,
  };
};

export default useDeployments;
