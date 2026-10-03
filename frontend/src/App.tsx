import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { 
  LayoutDashboard, Database, BrainCircuit, Rocket, Activity, 
  LogOut, UploadCloud, Play, Plus, Box, CheckCircle2, ChevronRight,
  Sun, Moon
} from 'lucide-react';

const API_URL = 'http://localhost:8000/api/v1';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- UI Components ---
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = "primary", className = "", ...props }: any) => {
  const base = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants: any = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Input = (props: any) => (
  <input className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" {...props} />
);

// --- Pages ---
function Login({ setAuth }: { setAuth: (val: boolean) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await axios.post(`${API_URL}/auth/register`, { username, password });
        toast.success('Account created! Please log in.');
        setIsRegister(false);
      } else {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const res = await axios.post(`${API_URL}/auth/login`, formData);
        localStorage.setItem('token', res.data.access_token);
        setAuth(true);
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200">
            <BrainCircuit size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Nexus MLOps</h2>
          <p className="text-slate-500 mt-2">{isRegister ? 'Create your account' : 'Welcome back, please log in'}</p>
        </div>
        
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <Input placeholder="Enter username" value={username} onChange={(e: any) => setUsername(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full py-2.5 text-base" disabled={loading}>
              {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Database size={24} /></div>
          <div><p className="text-sm font-medium text-slate-500">Total Datasets</p><p className="text-2xl font-bold">Manage Data</p></div>
        </Card>
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><BrainCircuit size={24} /></div>
          <div><p className="text-sm font-medium text-slate-500">Experiments</p><p className="text-2xl font-bold">Train Models</p></div>
        </Card>
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Rocket size={24} /></div>
          <div><p className="text-sm font-medium text-slate-500">Deployments</p><p className="text-2xl font-bold">Serve APIs</p></div>
        </Card>
      </div>
      <Card className="p-8 text-center mt-8 bg-gradient-to-br from-indigo-50 to-white">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to your MLOps Workspace</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">Get started by uploading a dataset, training a new model, and deploying it into production. Use the sidebar to navigate through the ML lifecycle.</p>
      </Card>
    </div>
  );
}

function Datasets() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/datasets`).then(res => setDatasets(res.data)).catch(console.error);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a CSV file");
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', desc);
    try {
      const res = await axios.post(`${API_URL}/datasets`, formData);
      setDatasets([...datasets, res.data.dataset]);
      setFile(null); setName(''); setDesc('');
      toast.success("Dataset uploaded successfully!");
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Datasets</h1>
          <p className="text-slate-500 text-sm">Upload and manage your training data.</p>
        </div>
      </div>

      <Card className="p-6 bg-slate-50 border-dashed border-2">
        <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Dataset Name</label>
            <Input value={name} onChange={(e:any) => setName(e.target.value)} required placeholder="e.g. housing_data" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <Input value={desc} onChange={(e:any) => setDesc(e.target.value)} required placeholder="Short description" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">File (CSV)</label>
            <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={e => setFile(e.target.files?.[0] || null)} required accept=".csv" />
          </div>
          <Button type="submit" disabled={loading} className="whitespace-nowrap">
            <UploadCloud size={18} className="mr-2" /> {loading ? 'Uploading...' : 'Upload Data'}
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map(d => (
          <Card key={d.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Database size={20} /></div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">CSV</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">{d.name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4">{d.description}</p>
            <div className="text-xs text-slate-400">Uploaded ID: #{d.id}</div>
          </Card>
        ))}
        {datasets.length === 0 && <div className="col-span-full text-center py-12 text-slate-400">No datasets uploaded yet.</div>}
      </div>
    </div>
  );
}

function Training() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [targetCol, setTargetCol] = useState('');
  const [algorithm, setAlgorithm] = useState('Random Forest');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/datasets`).then(res => setDatasets(res.data)).catch(console.error);
  }, []);

  const handleTrain = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Training model...", { id: 'train' });
    try {
      await axios.post(`${API_URL}/training/jobs`, {
        dataset_id: parseInt(selectedDataset),
        target_column: targetCol,
        algorithm: algorithm
      });
      toast.success('Training completed successfully!', { id: 'train' });
    } catch (err) {
      toast.error('Training failed. Check target column.', { id: 'train' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Train Model</h1>
        <p className="text-slate-500 text-sm">Configure parameters and kick off a new ML experiment.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleTrain} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Dataset</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white" value={selectedDataset} onChange={e => setSelectedDataset(e.target.value)} required>
              <option value="">-- Choose a dataset --</option>
              {datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Target Column</label>
            <Input value={targetCol} onChange={(e:any) => setTargetCol(e.target.value)} required placeholder="e.g. target_variable" />
            <p className="text-xs text-slate-500 mt-1">Exact name of the column you want to predict.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Algorithm</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white" value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
              <option>Logistic Regression</option>
              <option>Random Forest</option>
              <option>XGBoost</option>
            </select>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <Button type="submit" disabled={loading} className="w-full py-3">
              <Play size={18} className="mr-2" /> {loading ? 'Training in progress...' : 'Start Training Job'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Registry() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [deployName, setDeployName] = useState('');
  const [activeModel, setActiveModel] = useState<number | null>(null);
  
  const fetchAll = () => {
    axios.get(`${API_URL}/experiments`).then(res => setExperiments(res.data)).catch(console.error);
    axios.get(`${API_URL}/models`).then(res => setModels(res.data)).catch(console.error);
    axios.get(`${API_URL}/deployments`).then(res => setDeployments(res.data)).catch(console.error);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleRegister = async (expId: number) => {
    try {
      await axios.post(`${API_URL}/models`, { experiment_id: expId, name: `Model_${expId}` });
      toast.success("Model registered!");
      fetchAll();
    } catch (e) { toast.error('Registration failed'); }
  };

  const handleDeploy = async (modelId: number) => {
    if (!deployName) return toast.error('Enter a deployment name first');
    const toastId = toast.loading('Deploying model...');
    try {
      await axios.post(`${API_URL}/models/${modelId}/deploy`, { model_id: modelId, name: deployName });
      toast.success('Model deployed successfully!', { id: toastId });
      fetchAll();
      setDeployName('');
      setActiveModel(null);
    } catch (e) { toast.error('Deploy failed', { id: toastId }); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Registry & Deployments</h1>
        <p className="text-slate-500 text-sm">Promote trained experiments to registered models, and deploy them to APIs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Experiments */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center"><Activity className="mr-2 text-indigo-500" size={20}/> Completed Experiments</h2>
          <Card className="divide-y divide-slate-100">
            {experiments.length === 0 && <div className="p-6 text-center text-slate-400">No experiments yet.</div>}
            {experiments.map(e => (
              <div key={e.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-800">{e.name}</h4>
                  <p className="text-sm text-slate-500">Acc: {(e.accuracy * 100).toFixed(2)}% | Alg: {e.algorithm}</p>
                </div>
                <Button variant="secondary" onClick={() => handleRegister(e.id)} className="text-xs px-3 py-1.5"><Plus size={14} className="mr-1"/> Register</Button>
              </div>
            ))}
          </Card>
        </div>
        
        {/* Registered Models */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center"><Box className="mr-2 text-indigo-500" size={20}/> Registered Models</h2>
          <Card className="divide-y divide-slate-100">
            {models.length === 0 && <div className="p-6 text-center text-slate-400">No registered models.</div>}
            {models.map(m => (
              <div key={m.id} className="p-4 flex flex-col hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-800">{m.name} <span className="text-xs font-normal text-slate-400 ml-2">{m.version}</span></h4>
                  <Button onClick={() => setActiveModel(activeModel === m.id ? null : m.id)} className="text-xs px-3 py-1.5">
                    Deploy <ChevronRight size={14} className="ml-1"/>
                  </Button>
                </div>
                {activeModel === m.id && (
                  <div className="mt-2 pt-3 border-t border-slate-200 flex gap-2">
                    <Input placeholder="Enter Deployment Name..." value={deployName} onChange={(e:any) => setDeployName(e.target.value)} className="text-sm py-1.5" />
                    <Button variant="primary" onClick={() => handleDeploy(m.id)} className="py-1.5 whitespace-nowrap text-sm">Launch</Button>
                  </div>
                )}
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Active Deployments */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center"><Rocket className="mr-2 text-indigo-500" size={20}/> Active Endpoints</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deployments.length === 0 && <div className="col-span-full p-6 text-center text-slate-400 border border-dashed rounded-xl">No active deployments.</div>}
          {deployments.map(d => (
            <Card key={d.id} className="p-5 border-l-4 border-l-green-500">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{d.name}</h4>
                <CheckCircle2 size={16} className="text-green-500"/>
              </div>
              <p className="text-xs font-mono text-slate-500 bg-slate-100 p-2 rounded mt-2 truncate" title={d.endpoint}>{d.endpoint}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Predict() {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [selectedDeploy, setSelectedDeploy] = useState('');
  const [featureList, setFeatureList] = useState<any[]>([]);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [schemaError, setSchemaError] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/deployments`).then(res => setDeployments(res.data)).catch(console.error);
  }, []);

  const getModelFeatures = (dep: any): string[] => {
    if (!dep) return [];

    const targetCol = (
      dep.target_column ||
      dep.target_col ||
      dep.target ||
      dep.output_column ||
      dep.output ||
      dep.label_column ||
      dep.model?.target_column ||
      dep.model?.target ||
      dep.model?.output_column ||
      ''
    ).toString().trim().toLowerCase();

    const candidates =
      dep.features ??
      dep.input_columns ??
      dep.input_features ??
      dep.columns ??
      dep.inputs ??
      dep.feature_names ??
      dep.feature_names_in_ ??
      dep.model?.features ??
      dep.model?.input_columns ??
      dep.model?.input_features ??
      dep.model?.columns ??
      dep.model?.inputs ??
      dep.model?.feature_names ??
      dep.schema?.inputs ??
      [];

    let list: string[] = [];

    if (Array.isArray(candidates)) {
      list = candidates.map((item: any) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          return item.name || item.field || item.column || item.feature || item.title || String(item);
        }
        return String(item);
      });
    } else if (candidates && typeof candidates === 'object') {
      list = Object.keys(candidates);
    } else if (typeof candidates === 'string') {
      try {
        const parsed = JSON.parse(candidates);
        if (Array.isArray(parsed)) {
          list = parsed.map(String);
        } else if (parsed && typeof parsed === 'object') {
          list = Object.keys(parsed);
        } else {
          list = candidates.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      } catch {
        list = candidates.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }

    if (targetCol) {
      list = list.filter(c => c.trim().toLowerCase() !== targetCol);
    }

    return list;
  };

  const formatLabel = (name: string) => {
    if (!name) return '';
    if (name.toLowerCase() === 'bmi') return 'BMI';
    if (name.toLowerCase() === 'id') return 'ID';
    return name
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleDeployChange = async (deployName: string) => {
    setSelectedDeploy(deployName);
    setSchemaError('');
    if (!deployName) {
      setFeatureList([]);
      setInputs({});
      return;
    }
    
    setLoadingSchema(true);
    try {
      const res = await axios.get(`${API_URL}/deployments/${deployName}/schema`);
      const schema = res.data;
      const features = schema.features || [];
      if (features.length > 0) {
        setFeatureList(features);
        const initial: Record<string, string> = {};
        features.forEach((f: any) => { initial[f.name] = ''; });
        setInputs(initial);
      } else {
        setFeatureList([]);
        setInputs({});
      }
    } catch (err: any) {
      setFeatureList([]);
      setInputs({});
      setSchemaError(err.response?.data?.detail || 'Unable to load model inputs.');
    } finally {
      setLoadingSchema(false);
    }
  };

  const handleInputChange = (featureName: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [featureName]: value
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeploy) return toast.error("Select a deployment");
    if (featureList.length === 0) return toast.error("No features defined for this model");

    setLoading(true);
    try {
      const payload: Record<string, any> = {};
      featureList.forEach(feature => {
        const col = feature.name;
        const val = inputs[col];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          const trimmed = String(val).trim();
          if (!isNaN(Number(trimmed))) {
            payload[col] = Number(trimmed);
          } else if (trimmed.toLowerCase() === 'true') {
            payload[col] = true;
          } else if (trimmed.toLowerCase() === 'false') {
            payload[col] = false;
          } else {
            payload[col] = trimmed;
          }
        } else {
          payload[col] = '';
        }
      });

      const res = await axios.post(`${API_URL}/predict/${selectedDeploy}`, { features: payload });
      setResult(res.data.prediction);
      toast.success("Prediction successful");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Run Inference</h1>
        <p className="text-slate-500 text-sm">Test your live model endpoints.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <form onSubmit={handlePredict} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Endpoint</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white" value={selectedDeploy} onChange={e => handleDeployChange(e.target.value)} required>
                <option value="">-- Select Deployment --</option>
                {deployments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Model Inputs</label>
              {!selectedDeploy ? (
                <div className="py-8 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
                  Select a deployment to view model inputs
                </div>
              ) : loadingSchema ? (
                <div className="py-6 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
                  Loading model inputs...
                </div>
              ) : schemaError ? (
                <div className="py-6 text-center text-red-400 text-sm border border-dashed border-red-200 rounded-lg">
                  {schemaError}
                  <button type="button" onClick={() => handleDeployChange(selectedDeploy)} className="ml-2 underline hover:text-red-600">Retry</button>
                </div>
              ) : featureList.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
                  No input features are available for this deployment.
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {featureList.map(feature => (
                    <div key={feature.name}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {formatLabel(feature.name)} {feature.required && <span className="text-red-500">*</span>}
                      </label>
                      {feature.type === 'categorical' && feature.options?.length > 0 ? (
                        <select
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          value={inputs[feature.name] ?? ''}
                          onChange={(e: any) => handleInputChange(feature.name, e.target.value)}
                          required={feature.required}
                        >
                          <option value="">-- Select {formatLabel(feature.name)} --</option>
                          {feature.options.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : feature.type === 'boolean' ? (
                        <select
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          value={inputs[feature.name] ?? ''}
                          onChange={(e: any) => handleInputChange(feature.name, e.target.value)}
                          required={feature.required}
                        >
                          <option value="">-- Select --</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : (
                        <Input
                          type={feature.type === 'number' ? 'number' : 'text'}
                          step={feature.type === 'number' ? 'any' : undefined}
                          placeholder={`Enter ${formatLabel(feature.name)}`}
                          value={inputs[feature.name] ?? ''}
                          onChange={(e: any) => handleInputChange(feature.name, e.target.value)}
                          required={feature.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading || featureList.length === 0} className="w-full py-2.5">
               {loading ? 'Processing...' : 'Run Prediction'}
            </Button>
          </form>
        </Card>

        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-2 uppercase tracking-wider">Output Result</h3>
          <Card className="p-6 h-64 flex flex-col items-center justify-center bg-slate-50 border-dashed border-2 text-center">
            {result !== null ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-500">Predicted Value</p>
                <div className="text-5xl font-black text-indigo-600 font-mono tracking-tighter">
                  {typeof result === 'number' ? result.toFixed(4) : result.toString()}
                </div>
              </div>
            ) : (
              <div className="text-slate-400 flex flex-col items-center">
                <Activity size={32} className="mb-2 opacity-50" />
                <p className="text-sm">Submit inputs to see results</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

const NavItem = ({ to, icon: Icon, children }: any) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
      <Icon size={20} className={`mr-3 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
      {children}
    </Link>
  );
};

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    toast("Logged out");
  };

  const renderThemeToggle = (fixed: boolean = false) => (
    <button 
      onClick={toggleTheme} 
      className={`theme-toggle ${fixed ? 'theme-toggle-fixed' : ''}`} 
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );

  if (!auth) {
    return <><Toaster position="top-right" />{renderThemeToggle(true)}<Router><Login setAuth={setAuth} /></Router></>;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-6 flex items-center font-black text-xl text-slate-900 tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mr-3 shadow-md shadow-indigo-200">
              <BrainCircuit size={20} />
            </div>
            Nexus<span className="text-indigo-600 font-normal ml-1">MLOps</span>
          </div>
          
          <nav className="flex-1 py-4 space-y-1">
            <NavItem to="/" icon={LayoutDashboard}>Dashboard</NavItem>
            <NavItem to="/datasets" icon={Database}>Datasets</NavItem>
            <NavItem to="/training" icon={Activity}>Training Jobs</NavItem>
            <NavItem to="/registry" icon={Box}>Registry & Deploy</NavItem>
            <NavItem to="/predict" icon={Rocket}>Predictions</NavItem>
          </nav>
          
          <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <button onClick={handleLogout} className="flex items-center flex-1 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              <LogOut size={18} className="mr-3" /> Logout
            </button>
            {renderThemeToggle(false)}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 md:p-12 pb-24 h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/training" element={<Training />} />
              <Route path="/registry" element={<Registry />} />
              <Route path="/predict" element={<Predict />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
