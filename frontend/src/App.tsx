import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import {
  LayoutDashboard,
  Database,
  BrainCircuit,
  Rocket,
  Activity,
  LogOut,
  UploadCloud,
  Play,
  Plus,
  Box,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  TrendingUp,
  Server,
  AlertTriangle,
  Clock,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API_URL = "http://localhost:8000/api/v1";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- UI Components ---
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: any) => {
  const base =
    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants: any = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = (props: any) => (
  <input
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
    {...props}
  />
);

// --- Pages ---
function Login({ setAuth }: { setAuth: (val: boolean) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await axios.post(`${API_URL}/auth/register`, { username, password });
        toast.success("Account created! Please log in.");
        setIsRegister(false);
      } else {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        const res = await axios.post(`${API_URL}/auth/login`, formData);
        localStorage.setItem("token", res.data.access_token);
        setAuth(true);
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Authentication failed");
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
          <p className="text-slate-500 mt-2">
            {isRegister ? "Create your account" : "Welcome back, please log in"}
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e: any) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full py-2.5 text-base"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Don't have an account? Register"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Dashboard() {
  // Temporary dashboard data.
  // We will replace these with real backend data later.
  const trainingActivity = [
    { month: "Jan", jobs: 3 },
    { month: "Feb", jobs: 5 },
    { month: "Mar", jobs: 4 },
    { month: "Apr", jobs: 7 },
    { month: "May", jobs: 6 },
    { month: "Jun", jobs: 8 },
  ];

  const modelPerformance = [
    { metric: "Accuracy", value: 93.8 },
    { metric: "Precision", value: 92.7 },
    { metric: "Recall", value: 95.1 },
    { metric: "F1 Score", value: 94.2 },
  ];

  const deploymentHealth = [
    { name: "Healthy", value: 2 },
    { name: "Warning", value: 1 },
    { name: "Failed", value: 0 },
  ];

  const recentActivity = [
    {
      type: "success",
      title: "Training completed",
      description: "XGBoost — Customer Churn",
      time: "2 minutes ago",
    },
    {
      type: "success",
      title: "Model registered",
      description: "Customer Churn v3",
      time: "8 minutes ago",
    },
    {
      type: "warning",
      title: "Model health warning",
      description: "Fraud Detection v2",
      time: "15 minutes ago",
    },
    {
      type: "success",
      title: "Dataset uploaded",
      description: "Customer Data v4",
      time: "20 minutes ago",
    },
  ];

  const activeDeployments = [
    {
      name: "Customer Churn",
      version: "v3",
      status: "Healthy",
      latency: "32 ms",
    },
    {
      name: "Fraud Detection",
      version: "v2",
      status: "Healthy",
      latency: "41 ms",
    },
    {
      name: "House Prices",
      version: "v1",
      status: "Warning",
      latency: "78 ms",
    },
  ];

  const pieColors = ["#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Overview
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Monitor your machine learning lifecycle from data to deployment.
        </p>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Datasets */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Datasets</p>

              <p className="text-3xl font-bold text-slate-900 mt-1">12</p>

              <p className="text-xs text-green-600 mt-2">↑ 2 this week</p>
            </div>

            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Database size={24} />
            </div>
          </div>
        </Card>

        {/* Training Jobs */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Training Jobs
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">8</p>

              <p className="text-xs text-green-600 mt-2">6 completed</p>
            </div>

            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <BrainCircuit size={24} />
            </div>
          </div>
        </Card>

        {/* Models */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Registered Models
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">6</p>

              <p className="text-xs text-indigo-600 mt-2">2 in production</p>
            </div>

            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Box size={24} />
            </div>
          </div>
        </Card>

        {/* Deployments */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Deployments</p>

              <p className="text-3xl font-bold text-slate-900 mt-1">3</p>

              <p className="text-xs text-green-600 mt-2">2 healthy</p>
            </div>

            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <Rocket size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Training Activity
              </h2>

              <p className="text-sm text-slate-500">
                Training jobs completed over time
              </p>
            </div>

            <TrendingUp size={20} className="text-indigo-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                <XAxis dataKey="month" tick={{ fontSize: 12 }} />

                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="jobs"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#4f46e5",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Model Performance */}
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Model Performance
            </h2>

            <p className="text-sm text-slate-500">
              Performance of the current best model
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                <XAxis dataKey="metric" tick={{ fontSize: 11 }} />

                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />

                <Tooltip formatter={(value) => [`${value}%`, "Score"]} />

                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Deployment Health + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deployment Health */}
        <Card className="p-6">
          <div className="mb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Deployment Health
            </h2>

            <p className="text-sm text-slate-500">Current deployment status</p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deploymentHealth}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {deploymentHealth.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 lg:col-span-2">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="text-sm text-slate-500">
              Latest events in your ML lifecycle
            </p>
          </div>

          <div className="space-y-4">
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`mt-1 w-2.5 h-2.5 rounded-full ${
                    item.type === "warning" ? "bg-amber-500" : "bg-green-500"
                  }`}
                />

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {item.title}
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.description}
                  </p>
                </div>

                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active Deployments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Active Deployments
            </h2>

            <p className="text-sm text-slate-500">
              Currently running model endpoints
            </p>
          </div>

          <Server size={20} className="text-indigo-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeDeployments.map((deployment, index) => (
            <div key={index} className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {deployment.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Model {deployment.version}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    deployment.status === "Healthy"
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {deployment.status === "Healthy" ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <AlertTriangle size={15} />
                  )}

                  {deployment.status}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                <Clock size={14} />
                Latency: {deployment.latency}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
function Datasets() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/datasets`)
      .then(res => setDatasets(res.data))
      .catch(() => toast.error('Failed to load datasets'));
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      return toast.error('Please select a CSV file');
    }

    if (!name.trim()) {
      return toast.error('Please enter a dataset name');
    }

    if (!desc.trim()) {
      return toast.error('Please enter a description');
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', desc);

    try {
      const res = await axios.post(`${API_URL}/datasets`, formData);

      setDatasets(prev => [...prev, res.data.dataset]);

      setFile(null);
      setName('');
      setDesc('');

      toast.success('Dataset uploaded successfully!');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredDatasets = datasets.filter(dataset => {
    const query = search.toLowerCase();

    return (
      dataset.name?.toLowerCase().includes(query) ||
      dataset.description?.toLowerCase().includes(query) ||
      String(dataset.id).includes(query)
    );
  });

  const latestId =
    datasets.length > 0
      ? Math.max(...datasets.map(d => Number(d.id) || 0))
      : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Data Management
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Datasets
          </h1>

          <p className="text-slate-500 mt-1">
            Upload, manage and prepare datasets for model training.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          {datasets.length} dataset{datasets.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Datasets
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {datasets.length}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Uploaded to the platform
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Database size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Available for Training
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {datasets.length}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Dataset records currently available
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Latest Dataset
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {latestId > 0 ? `#${latestId}` : '—'}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Most recent dataset ID
              </p>
            </div>

            <div className="p-3 rounded-xl bg-violet-50 text-violet-600">
              <Activity size={24} />
            </div>
          </div>
        </Card>

      </div>

      {/* Upload Section */}
      <Card className="overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">

            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <UploadCloud size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Upload New Dataset
              </h2>

              <p className="text-sm text-slate-500">
                Add a CSV dataset to your MLOps workflow.
              </p>
            </div>

          </div>
        </div>

        <form
          onSubmit={handleUpload}
          className="p-6"
        >

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Dataset Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Dataset Name
              </label>

              <Input
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                required
                placeholder="e.g. customer_churn"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>

              <Input
                value={desc}
                onChange={(e: any) => setDesc(e.target.value)}
                required
                placeholder="Short description of the dataset"
              />
            </div>

            {/* File */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CSV File
              </label>

              <input
                type="file"
                accept=".csv"
                required
                onChange={e => {
                  setFile(e.target.files?.[0] || null);
                }}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer"
              />
            </div>

          </div>

          {/* Selected file */}
          {file && (
            <div className="mt-5 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

              <div className="flex items-center gap-3">

                <div className="p-2 rounded-lg bg-white text-blue-600">
                  <Database size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {file.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

              </div>

              <CheckCircle2
                size={20}
                className="text-emerald-500"
              />

            </div>
          )}

          {/* Upload button */}
          <div className="flex justify-end mt-6">

            <Button
              type="submit"
              disabled={loading}
            >
              <UploadCloud size={18} className="mr-2" />

              {loading ? 'Uploading...' : 'Upload Dataset'}
            </Button>

          </div>

        </form>
      </Card>

      {/* Dataset Library */}
      <div className="space-y-4">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Dataset Library
            </h2>

            <p className="text-sm text-slate-500">
              Browse datasets currently available in the platform.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">

            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search datasets..."
              className="w-full rounded-xl border border-slate-200 bg-white
                px-4 py-2.5 text-sm outline-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>

        {/* Dataset Cards */}
        {filteredDatasets.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {filteredDatasets.map(dataset => (

              <Card
                key={dataset.id}
                className="p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >

                {/* Top */}
                <div className="flex items-start justify-between">

                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Database size={22} />
                  </div>

                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    Available
                  </span>

                </div>

                {/* Name */}
                <div className="mt-5">

                  <h3 className="text-lg font-semibold text-slate-900 truncate">
                    {dataset.name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-[40px]">
                    {dataset.description || 'No description provided.'}
                  </p>

                </div>

                {/* Metadata */}
                <div className="mt-5 pt-4 border-t border-slate-100">

                  <div className="flex items-center justify-between text-xs">

                    <span className="text-slate-400">
                      Dataset ID
                    </span>

                    <span className="font-semibold text-slate-700">
                      #{dataset.id}
                    </span>

                  </div>

                  <div className="flex items-center justify-between text-xs mt-2">

                    <span className="text-slate-400">
                      Format
                    </span>

                    <span className="font-semibold text-slate-700">
                      CSV
                    </span>

                  </div>

                </div>

                {/* Action */}
                <button
                  type="button"
                  onClick={() => navigate('/training')}
                  className="w-full mt-5 flex items-center justify-center gap-2
                    rounded-xl bg-slate-900 text-white py-2.5
                    text-sm font-medium hover:bg-slate-800 transition"
                >
                  Train Model
                  <ChevronRight size={16} />
                </button>

              </Card>

            ))}

          </div>

        ) : (

          <Card className="p-12 text-center">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100
              flex items-center justify-center text-slate-400">

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

    </div>
  );
}
function Training() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  const [selectedDataset, setSelectedDataset] = useState('');
  const [targetCol, setTargetCol] = useState('');
  const [algorithm, setAlgorithm] = useState('Random Forest');

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/datasets`)
      .then(res => setDatasets(res.data))
      .catch(() => toast.error('Failed to load datasets'));

    axios
      .get(`${API_URL}/training/jobs`)
      .then(res => setJobs(res.data))
      .catch(() => {
        // If backend does not yet expose job listing,
        // the training page will still work.
        setJobs([]);
      });
  }, []);

  const handleTrain = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDataset) {
      return toast.error('Please select a dataset');
    }

    if (!targetCol.trim()) {
      return toast.error('Please enter the target column');
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/training/jobs`, {
        dataset_id: Number(selectedDataset),
        target_column: targetCol,
        algorithm: algorithm,
      });

      /*
       * Add returned job to the beginning of the local list.
       * This assumes the backend returns the created job directly.
       */
      if (res.data?.job) {
        setJobs(prev => [res.data.job, ...prev]);
      } else if (res.data) {
        setJobs(prev => [res.data, ...prev]);
      }

      toast.success('Training job started successfully!');

      setSelectedDataset('');
      setTargetCol('');
      setAlgorithm('Random Forest');

    } catch (err) {
      toast.error('Failed to start training job');
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

  const getStatusStyle = (status: string) => {
    const normalized = String(status || '').toLowerCase();

    if (
      normalized === 'completed' ||
      normalized === 'success' ||
      normalized === 'succeeded'
    ) {
      return 'bg-emerald-50 text-emerald-700';
    }

    if (
      normalized === 'running' ||
      normalized === 'pending' ||
      normalized === 'queued'
    ) {
      return 'bg-blue-50 text-blue-700';
    }

    if (
      normalized === 'failed' ||
      normalized === 'error'
    ) {
      return 'bg-red-50 text-red-700';
    }

    return 'bg-slate-100 text-slate-600';
  };

  const getStatusLabel = (status: string) => {
    if (!status) return 'Unknown';

    const normalized = String(status).toLowerCase();

    if (normalized === 'success' || normalized === 'succeeded') {
      return 'Completed';
    }

    return String(status).charAt(0).toUpperCase() + String(status).slice(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Machine Learning
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Training Jobs
          </h1>

          <p className="text-slate-500 mt-1">
            Configure, launch and monitor your model training experiments.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          {jobs.length} training job{jobs.length !== 1 ? 's' : ''}
        </div>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <Card className="p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Jobs
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {jobs.length}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Training executions
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Activity size={24} />
            </div>

          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {completedJobs}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Successful training jobs
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={24} />
            </div>

          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Running
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {runningJobs}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Active or queued jobs
              </p>
            </div>

            <div className="p-3 rounded-xl bg-violet-50 text-violet-600">
              <Play size={24} />
            </div>

          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Failed
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {failedJobs}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Jobs requiring attention
              </p>
            </div>

            <div className="p-3 rounded-xl bg-red-50 text-red-600">
              <Rocket size={24} />
            </div>

          </div>
        </Card>

      </div>

      {/* Training Configuration */}
      <Card className="overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <BrainCircuit size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Start New Training
              </h2>

              <p className="text-sm text-slate-500">
                Select a dataset and configure the model training job.
              </p>
            </div>

          </div>

        </div>

        <form
          onSubmit={handleTrain}
          className="p-6"
        >

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
                className="w-full rounded-xl border border-slate-200
                  bg-white px-4 py-2.5 text-sm text-slate-700
                  outline-none focus:border-blue-500
                  focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Select dataset
                </option>

                {datasets.map(dataset => (
                  <option
                    key={dataset.id}
                    value={dataset.id}
                  >
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
                onChange={(e: any) => setTargetCol(e.target.value)}
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
                className="w-full rounded-xl border border-slate-200
                  bg-white px-4 py-2.5 text-sm text-slate-700
                  outline-none focus:border-blue-500
                  focus:ring-2 focus:ring-blue-100"
              >

                <option value="Logistic Regression">
                  Logistic Regression
                </option>

                <option value="Random Forest">
                  Random Forest
                </option>

                <option value="XGBoost">
                  XGBoost
                </option>

              </select>

            </div>

          </div>

          {/* Selected configuration */}
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
                      {datasets.find(
                        d => String(d.id) === String(selectedDataset)
                      )?.name || selectedDataset}
                    </span>
                  </p>

                  <p className="text-sm text-slate-700">
                    Target:{' '}
                    <span className="font-semibold">
                      {targetCol || 'Not specified'}
                    </span>
                  </p>

                  <p className="text-sm text-slate-700">
                    Algorithm:{' '}
                    <span className="font-semibold">
                      {algorithm}
                    </span>
                  </p>

                </div>

                <div className="flex items-center gap-2 text-sm text-blue-700">

                  <CheckCircle2 size={18} />

                  Ready to train

                </div>

              </div>

            </div>
          )}

          {/* Start button */}
          <div className="flex justify-end mt-6">

            <Button
              type="submit"
              disabled={loading || datasets.length === 0}
            >

              <Play size={18} className="mr-2" />

              {loading
                ? 'Starting Training...'
                : 'Start Training Job'}

            </Button>

          </div>

        </form>

      </Card>

      {/* Training Job History */}
      <div className="space-y-4">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Training Job History
            </h2>

            <p className="text-sm text-slate-500">
              Track previous model training executions.
            </p>

          </div>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search training jobs..."
            className="w-full md:w-80 rounded-xl border border-slate-200
              bg-white px-4 py-2.5 text-sm outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {filteredJobs.length > 0 ? (

          <div className="space-y-4">

            {filteredJobs.map((job, index) => {

              const status = job.status || 'Unknown';

              const dataset = datasets.find(
                d =>
                  String(d.id) ===
                  String(job.dataset_id)
              );

              return (

                <Card
                  key={job.id ?? index}
                  className="p-5 hover:shadow-md transition-shadow"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* Job Information */}
                    <div className="flex items-start gap-4">

                      <div className="p-3 rounded-xl bg-slate-100 text-slate-600">

                        <BrainCircuit size={22} />

                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-semibold text-slate-900">
                            Training Job #{job.id ?? index + 1}
                          </h3>

                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(
                              status
                            )}`}
                          >
                            {getStatusLabel(status)}
                          </span>

                        </div>

                        <p className="text-sm text-slate-500 mt-1">
                          {dataset?.name
                            ? dataset.name
                            : job.dataset_id
                              ? `Dataset #${job.dataset_id}`
                              : 'Dataset not specified'}
                        </p>

                      </div>

                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-sm">

                      <div>

                        <p className="text-xs text-slate-400">
                          Algorithm
                        </p>

                        <p className="font-medium text-slate-700 mt-1">
                          {job.algorithm || '—'}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-slate-400">
                          Target
                        </p>

                        <p className="font-medium text-slate-700 mt-1">
                          {job.target_column || '—'}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-slate-400">
                          Job ID
                        </p>

                        <p className="font-medium text-slate-700 mt-1">
                          #{job.id ?? '—'}
                        </p>

                      </div>

                    </div>

                  </div>

                </Card>

              );

            })}

          </div>

        ) : (

          <Card className="p-12 text-center">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100
              flex items-center justify-center text-slate-400">

              <BrainCircuit size={30} />

            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-800">
              {search
                ? 'No training jobs found'
                : 'No training jobs yet'}
            </h3>

            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              {search
                ? 'Try a different search term.'
                : 'Configure a dataset, target column and algorithm above to start your first training job.'}
            </p>

          </Card>

        )}

      </div>

    </div>
  );
}

function Registry() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);

  const [modelName, setModelName] = useState('');
  const [experimentId, setExperimentId] = useState('');

  const [deploymentName, setDeploymentName] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const [modelSearch, setModelSearch] = useState('');
  const [deploymentSearch, setDeploymentSearch] = useState('');

  const [registerLoading, setRegisterLoading] = useState(false);
  const [deployLoading, setDeployLoading] = useState(false);

  const loadRegistryData = async () => {
    try {
      const [experimentsRes, modelsRes, deploymentsRes] =
        await Promise.all([
          axios.get(`${API_URL}/experiments`),
          axios.get(`${API_URL}/models`),
          axios.get(`${API_URL}/deployments`),
        ]);

      setExperiments(experimentsRes.data);
      setModels(modelsRes.data);
      setDeployments(deploymentsRes.data);
    } catch (err) {
      toast.error('Failed to load registry data');
    }
  };

  useEffect(() => {
    loadRegistryData();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modelName.trim()) {
      return toast.error('Please enter a model name');
    }

    if (!experimentId) {
      return toast.error('Please select an experiment');
    }

    setRegisterLoading(true);

    try {
      await axios.post(`${API_URL}/models`, {
        name: modelName,
        experiment_id: Number(experimentId),
      });

      toast.success('Model registered successfully!');

      setModelName('');
      setExperimentId('');

      await loadRegistryData();
    } catch (err) {
      toast.error('Failed to register model');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedModel) {
      return toast.error('Please select a model');
    }

    if (!deploymentName.trim()) {
      return toast.error('Please enter a deployment name');
    }

    setDeployLoading(true);

    try {
      await axios.post(
        `${API_URL}/models/${selectedModel}/deploy`,
        {
          name: deploymentName,
        }
      );

      toast.success('Model deployment started!');

      setSelectedModel('');
      setDeploymentName('');

      await loadRegistryData();
    } catch (err) {
      toast.error('Deployment failed');
    } finally {
      setDeployLoading(false);
    }
  };

  const filteredModels = models.filter(model => {
    const query = modelSearch.toLowerCase();

    return (
      String(model.id ?? '')
        .toLowerCase()
        .includes(query) ||
      String(model.name ?? '')
        .toLowerCase()
        .includes(query) ||
      String(model.status ?? '')
        .toLowerCase()
        .includes(query)
    );
  });

  const filteredDeployments = deployments.filter(deployment => {
    const query = deploymentSearch.toLowerCase();

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

  const getStatusStyle = (status: string) => {
    const normalized = String(status || '').toLowerCase();

    if (
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
      normalized === 'creating'
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

  const getStatusLabel = (status: string) => {
    if (!status) return 'Unknown';

    const normalized = String(status).toLowerCase();

    if (normalized === 'running') return 'Active';
    if (normalized === 'deployed') return 'Active';
    if (normalized === 'production') return 'Production';
    if (normalized === 'succeeded') return 'Completed';

    return (
      String(status).charAt(0).toUpperCase() +
      String(status).slice(1)
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Model Lifecycle
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Registry & Deploy
          </h1>

          <p className="text-slate-500 mt-1">
            Register trained models and deploy selected versions as APIs.
          </p>
        </div>

        <button
          type="button"
          onClick={loadRegistryData}
          className="px-4 py-2.5 rounded-xl border border-slate-200
            bg-white text-sm font-medium text-slate-700
            hover:bg-slate-50 transition"
        >
          Refresh Registry
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Experiments */}
        <Card className="p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Experiments
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {experiments.length}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Training experiments
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Activity size={24} />
            </div>

          </div>
        </Card>

        {/* Models */}
        <Card className="p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Registered Models
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {models.length}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Models in registry
              </p>
            </div>

            <div className="p-3 rounded-xl bg-violet-50 text-violet-600">
              <Box size={24} />
            </div>

          </div>
        </Card>

        {/* Active deployments */}
        <Card className="p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Active Deployments
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {activeDeployments}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Serving model APIs
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Rocket size={24} />
            </div>

          </div>
        </Card>

        {/* Pending */}
        <Card className="p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Deploying
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {pendingDeployments}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Pending deployments
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <Activity size={24} />
            </div>

          </div>
        </Card>

      </div>

      {/* Register Model */}
      <Card className="overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
              <Box size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Register Model
              </h2>

              <p className="text-sm text-slate-500">
                Add a trained experiment result to the model registry.
              </p>
            </div>

          </div>

        </div>

        <form
          onSubmit={handleRegister}
          className="p-6"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Model name */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Model Name
              </label>

              <Input
                value={modelName}
                onChange={(e: any) => setModelName(e.target.value)}
                required
                placeholder="e.g. customer_churn_model"
              />

            </div>

            {/* Experiment */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Source Experiment
              </label>

              <select
                value={experimentId}
                onChange={e => setExperimentId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200
                  bg-white px-4 py-2.5 text-sm text-slate-700
                  outline-none focus:border-blue-500
                  focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Select experiment
                </option>

                {experiments.map(experiment => (
                  <option
                    key={experiment.id}
                    value={experiment.id}
                  >
                    {experiment.name ||
                      experiment.experiment_name ||
                      `Experiment #${experiment.id}`}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* Register info */}
          <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50 p-4">

            <div className="flex items-start gap-3">

              <CheckCircle2
                size={20}
                className="text-violet-600 mt-0.5"
              />

              <div>

                <p className="text-sm font-medium text-violet-900">
                  Model lifecycle
                </p>

                <p className="text-xs text-violet-700 mt-1">
                  A trained experiment can be registered as a model
                  and then selected for deployment.
                </p>

              </div>

            </div>

          </div>

          <div className="flex justify-end mt-6">

            <Button
              type="submit"
              disabled={registerLoading}
            >

              <Plus size={18} className="mr-2" />

              {registerLoading
                ? 'Registering...'
                : 'Register Model'}

            </Button>

          </div>

        </form>

      </Card>

      {/* Registered Models */}
      <div className="space-y-4">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Registered Models
            </h2>

            <p className="text-sm text-slate-500">
              Models available for deployment.
            </p>
          </div>

          <input
            type="text"
            value={modelSearch}
            onChange={e => setModelSearch(e.target.value)}
            placeholder="Search models..."
            className="w-full md:w-80 rounded-xl border border-slate-200
              bg-white px-4 py-2.5 text-sm outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {filteredModels.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {filteredModels.map(model => {

              const status = model.status || 'Registered';

              return (
                <Card
                  key={model.id}
                  className="p-5 hover:shadow-lg
                    hover:-translate-y-0.5 transition-all"
                >

                  <div className="flex items-start justify-between">

                    <div className="p-3 rounded-xl bg-violet-50 text-violet-600">
                      <Box size={22} />
                    </div>

                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(
                        status
                      )}`}
                    >
                      {getStatusLabel(status)}
                    </span>

                  </div>

                  <div className="mt-5">

                    <h3 className="text-lg font-semibold text-slate-900 truncate">
                      {model.name || `Model #${model.id}`}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Registered Model
                    </p>

                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">

                    <div className="flex items-center justify-between text-xs">

                      <span className="text-slate-400">
                        Model ID
                      </span>

                      <span className="font-semibold text-slate-700">
                        #{model.id}
                      </span>

                    </div>

                    <div className="flex items-center justify-between text-xs">

                      <span className="text-slate-400">
                        Experiment
                      </span>

                      <span className="font-semibold text-slate-700">
                        {model.experiment_id
                          ? `#${model.experiment_id}`
                          : '—'}
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedModel(String(model.id));
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth',
                      });
                    }}
                    className="w-full mt-5 flex items-center justify-center gap-2
                      rounded-xl bg-slate-900 text-white py-2.5
                      text-sm font-medium hover:bg-slate-800 transition"
                  >

                    <Rocket size={16} />

                    Select for Deployment

                  </button>

                </Card>
              );
            })}

          </div>

        ) : (

          <Card className="p-12 text-center">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100
              flex items-center justify-center text-slate-400">

              <Box size={30} />

            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-800">
              {modelSearch
                ? 'No models found'
                : 'No registered models yet'}
            </h3>

            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              {modelSearch
                ? 'Try a different search term.'
                : 'Register a trained experiment above to make it available for deployment.'}
            </p>

          </Card>

        )}

      </div>

      {/* Deployment Section */}
      <Card className="overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Rocket size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Deploy Model
              </h2>

              <p className="text-sm text-slate-500">
                Create a serving endpoint for a registered model.
              </p>
            </div>

          </div>

        </div>

        <form
          onSubmit={handleDeploy}
          className="p-6"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Model */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Registered Model
              </label>

              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200
                  bg-white px-4 py-2.5 text-sm text-slate-700
                  outline-none focus:border-blue-500
                  focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Select model
                </option>

                {models.map(model => (
                  <option
                    key={model.id}
                    value={model.id}
                  >
                    {model.name || `Model #${model.id}`}
                  </option>
                ))}

              </select>

            </div>

            {/* Deployment name */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deployment Name
              </label>

              <Input
                value={deploymentName}
                onChange={(e: any) =>
                  setDeploymentName(e.target.value)
                }
                required
                placeholder="e.g. churn-api-prod"
              />

            </div>

          </div>

          {selectedModel && (
            <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

              <div className="flex items-center gap-3">

                <Rocket
                  size={20}
                  className="text-emerald-600"
                />

                <div>

                  <p className="text-sm font-medium text-emerald-900">
                    Model selected for deployment
                  </p>

                  <p className="text-xs text-emerald-700 mt-1">
                    {
                      models.find(
                        model =>
                          String(model.id) ===
                          String(selectedModel)
                      )?.name ||
                      `Model #${selectedModel}`
                    }
                  </p>

                </div>

              </div>

            </div>
          )}

          <div className="flex justify-end mt-6">

            <Button
              type="submit"
              disabled={
                deployLoading ||
                models.length === 0
              }
            >

              <Rocket size={18} className="mr-2" />

              {deployLoading
                ? 'Deploying...'
                : 'Deploy Model'}

            </Button>

          </div>

        </form>

      </Card>

      {/* Deployments */}
      <div className="space-y-4">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Active Deployments
            </h2>

            <p className="text-sm text-slate-500">
              Model endpoints currently managed by the platform.
            </p>

          </div>

          <input
            type="text"
            value={deploymentSearch}
            onChange={e =>
              setDeploymentSearch(e.target.value)
            }
            placeholder="Search deployments..."
            className="w-full md:w-80 rounded-xl border border-slate-200
              bg-white px-4 py-2.5 text-sm outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {filteredDeployments.length > 0 ? (

          <div className="space-y-4">

            {filteredDeployments.map((deployment, index) => {

              const status =
                deployment.status || 'Unknown';

              const model = models.find(
                m =>
                  String(m.id) ===
                  String(deployment.model_id)
              );

              return (

                <Card
                  key={deployment.id ?? index}
                  className="p-5 hover:shadow-md transition-shadow"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* Deployment identity */}
                    <div className="flex items-start gap-4">

                      <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">

                        <Rocket size={22} />

                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-semibold text-slate-900">
                            {deployment.name ||
                              `Deployment #${deployment.id}`}
                          </h3>

                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(
                              status
                            )}`}
                          >
                            {getStatusLabel(status)}
                          </span>

                        </div>

                        <p className="text-sm text-slate-500 mt-1">

                          {model?.name
                            ? model.name
                            : deployment.model_id
                              ? `Model #${deployment.model_id}`
                              : 'Model not specified'}

                        </p>

                      </div>

                    </div>

                    {/* Deployment details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-sm">

                      <div>

                        <p className="text-xs text-slate-400">
                          Deployment ID
                        </p>

                        <p className="font-medium text-slate-700 mt-1">
                          #{deployment.id ?? '—'}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-slate-400">
                          Model ID
                        </p>

                        <p className="font-medium text-slate-700 mt-1">
                          {deployment.model_id
                            ? `#${deployment.model_id}`
                            : '—'}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-slate-400">
                          Status
                        </p>

                        <p className="font-medium text-slate-700 mt-1">
                          {getStatusLabel(status)}
                        </p>

                      </div>

                    </div>

                  </div>

                </Card>

              );
            })}

          </div>

        ) : (

          <Card className="p-12 text-center">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100
              flex items-center justify-center text-slate-400">

              <Rocket size={30} />

            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-800">
              {deploymentSearch
                ? 'No deployments found'
                : 'No deployments yet'}
            </h3>

            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              {deploymentSearch
                ? 'Try a different search term.'
                : 'Select a registered model and deploy it to create a prediction endpoint.'}
            </p>

          </Card>

        )}

      </div>

    </div>
  );
}
function Predict() {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [selectedDeploy, setSelectedDeploy] = useState('');
  const [schema, setSchema] = useState<any>(null);
  const [features, setFeatures] = useState<Record<string, any>>({});
  const [prediction, setPrediction] = useState<any>(null);
  const [predictionHistory, setPredictionHistory] = useState<any[]>([]);

  const [loadingDeployments, setLoadingDeployments] = useState(false);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [predicting, setPredicting] = useState(false);

  const loadDeployments = async () => {
    setLoadingDeployments(true);

    try {
      const res = await axios.get(`${API_URL}/deployments`);
      setDeployments(res.data);

      if (res.data.length > 0 && !selectedDeploy) {
        setSelectedDeploy(
          res.data[0].name || res.data[0].deployment_name
        );
      }
    } catch (err) {
      toast.error('Failed to load deployments');
    } finally {
      setLoadingDeployments(false);
    }
  };

  useEffect(() => {
    loadDeployments();
  }, []);

  useEffect(() => {
    if (!selectedDeploy) {
      setSchema(null);
      setFeatures({});
      setPrediction(null);
      return;
    }

    const loadSchema = async () => {
      setLoadingSchema(true);
      setPrediction(null);

      try {
        const res = await axios.get(
          `${API_URL}/deployments/${selectedDeploy}/schema`
        );

        setSchema(res.data);

        /*
         * The backend may return schema in different forms.
         * We try to extract the feature names without assuming
         * unsupported backend fields.
         */
        let featureNames: string[] = [];

        if (Array.isArray(res.data)) {
          featureNames = res.data;
        } else if (Array.isArray(res.data?.features)) {
          featureNames = res.data.features;
        } else if (Array.isArray(res.data?.columns)) {
          featureNames = res.data.columns;
        } else if (res.data?.properties) {
          featureNames = Object.keys(res.data.properties);
        } else if (res.data && typeof res.data === 'object') {
          featureNames = Object.keys(res.data);
        }

        const initialFeatures: Record<string, any> = {};

        featureNames.forEach(name => {
          initialFeatures[name] = '';
        });

        setFeatures(initialFeatures);

      } catch (err) {
        toast.error('Failed to load model input schema');
        setSchema(null);
        setFeatures({});
      } finally {
        setLoadingSchema(false);
      }
    };

    loadSchema();
  }, [selectedDeploy]);

  const getFeatureNames = () => {
    if (!schema) return [];

    if (Array.isArray(schema)) {
      return schema;
    }

    if (Array.isArray(schema?.features)) {
      return schema.features;
    }

    if (Array.isArray(schema?.columns)) {
      return schema.columns;
    }

    if (schema?.properties) {
      return Object.keys(schema.properties);
    }

    if (schema && typeof schema === 'object') {
      return Object.keys(schema);
    }

    return [];
  };

  const featureNames = getFeatureNames();

  const handleFeatureChange = (
    feature: string,
    value: string
  ) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: value,
    }));
  };

  const convertValue = (value: any) => {
    if (value === '') return value;

    const trimmed = String(value).trim();

    if (trimmed === '') return '';

    if (trimmed.toLowerCase() === 'true') {
      return true;
    }

    if (trimmed.toLowerCase() === 'false') {
      return false;
    }

    const numericValue = Number(trimmed);

    if (!Number.isNaN(numericValue)) {
      return numericValue;
    }

    return value;
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDeploy) {
      return toast.error('Please select a deployment');
    }

    if (featureNames.length === 0) {
      return toast.error('No model input features available');
    }

    const missingFeature = featureNames.find(
      feature =>
        features[feature] === undefined ||
        String(features[feature]).trim() === ''
    );

    if (missingFeature) {
      return toast.error(
        `Please provide a value for ${missingFeature}`
      );
    }

    setPredicting(true);

    try {
      const payload: Record<string, any> = {};

      featureNames.forEach(feature => {
        payload[feature] = convertValue(features[feature]);
      });

      const res = await axios.post(
        `${API_URL}/predict/${selectedDeploy}`,
        {
          features: payload,
        }
      );

      const result =
        res.data?.prediction ??
        res.data?.predicted_value ??
        res.data?.result ??
        res.data;

      setPrediction(result);

      const historyItem = {
        id: Date.now(),
        deployment: selectedDeploy,
        prediction: result,
        time: new Date().toLocaleTimeString(),
      };

      setPredictionHistory(prev => [
        historyItem,
        ...prev,
      ].slice(0, 10));

      toast.success('Prediction completed');

    } catch (err) {
      toast.error('Prediction failed');
      setPrediction(null);
    } finally {
      setPredicting(false);
    }
  };

  const selectedDeployment = deployments.find(
    deployment =>
      (deployment.name ||
        deployment.deployment_name) === selectedDeploy
  );

  const deploymentStatus =
    selectedDeployment?.status || 'Active';

  const getStatusStyle = (status: string) => {
    const normalized = String(status || '').toLowerCase();

    if (
      normalized === 'active' ||
      normalized === 'running' ||
      normalized === 'deployed' ||
      normalized === 'healthy'
    ) {
      return 'bg-emerald-50 text-emerald-700';
    }

    if (
      normalized === 'pending' ||
      normalized === 'deploying'
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Model Inference
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Predictions
          </h1>

          <p className="text-slate-500 mt-1">
            Send input data to a deployed model and view its prediction.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDeployments}
          disabled={loadingDeployments}
          className="px-4 py-2.5 rounded-xl border border-slate-200
            bg-white text-sm font-medium text-slate-700
            hover:bg-slate-50 transition"
        >
          {loadingDeployments
            ? 'Refreshing...'
            : 'Refresh Endpoints'}
        </button>

      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <Card className="p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Available Endpoints
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {deployments.length}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Deployed model APIs
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Rocket size={24} />
            </div>

          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Selected Endpoint
              </p>

              <p className="text-lg font-bold text-slate-900 mt-2 truncate max-w-[180px]">
                {selectedDeploy || 'None'}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Current inference target
              </p>
            </div>

            <div className="p-3 rounded-xl bg-violet-50 text-violet-600">
              <Box size={24} />
            </div>

          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Predictions This Session
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {predictionHistory.length}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Recent inference requests
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Activity size={24} />
            </div>

          </div>
        </Card>

      </div>

      {/* Endpoint Selection */}
      <Card className="overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Rocket size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Select Deployment
              </h2>

              <p className="text-sm text-slate-500">
                Choose the deployed model you want to query.
              </p>
            </div>

          </div>

        </div>

        <div className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deployment Endpoint
              </label>

              <select
                value={selectedDeploy}
                onChange={e =>
                  setSelectedDeploy(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200
                  bg-white px-4 py-2.5 text-sm text-slate-700
                  outline-none focus:border-blue-500
                  focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Select deployment
                </option>

                {deployments.map((deployment, index) => {

                  const name =
                    deployment.name ||
                    deployment.deployment_name ||
                    `Deployment #${deployment.id || index + 1}`;

                  return (
                    <option
                      key={deployment.id || index}
                      value={name}
                    >
                      {name}
                    </option>
                  );
                })}

              </select>

            </div>

            <div className="flex items-end">

              <div className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Endpoint Status
                  </span>

                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(
                      deploymentStatus
                    )}`}
                  >
                    {deploymentStatus}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </Card>

      {/* Main Prediction Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Input Form */}
        <Card className="xl:col-span-2 overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100">

            <div className="flex items-center gap-3">

              <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
                <BrainCircuit size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Model Input
                </h2>

                <p className="text-sm text-slate-500">
                  Enter the feature values required by the deployed model.
                </p>
              </div>

            </div>

          </div>

          <form
            onSubmit={handlePredict}
            className="p-6"
          >

            {!selectedDeploy ? (

              <div className="py-12 text-center">

                <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100
                  flex items-center justify-center text-slate-400">

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

                <div className="mx-auto w-12 h-12 rounded-full
                  border-4 border-slate-200 border-t-blue-600
                  animate-spin"
                />

                <p className="mt-4 text-sm text-slate-500">
                  Loading model schema...
                </p>

              </div>

            ) : featureNames.length === 0 ? (

              <div className="py-12 text-center">

                <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50
                  flex items-center justify-center text-amber-500">

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

                  {featureNames.map(feature => (

                    <div key={feature}>

                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {feature}
                      </label>

                      <input
                        type="text"
                        value={features[feature] ?? ''}
                        onChange={e =>
                          handleFeatureChange(
                            feature,
                            e.target.value
                          )
                        }
                        placeholder={`Enter ${feature}`}
                        className="w-full rounded-xl border border-slate-200
                          bg-white px-4 py-2.5 text-sm
                          text-slate-700 outline-none
                          focus:border-blue-500
                          focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                  ))}

                </div>

                <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">

                  <p className="text-xs text-slate-500">
                    Input features detected
                  </p>

                  <p className="text-lg font-semibold text-slate-800 mt-1">
                    {featureNames.length}
                  </p>

                </div>

                <div className="flex justify-end mt-6">

                  <Button
                    type="submit"
                    disabled={predicting}
                  >

                    <Play size={18} className="mr-2" />

                    {predicting
                      ? 'Running Prediction...'
                      : 'Run Prediction'}

                  </Button>

                </div>
              </>
            )}

          </form>

        </Card>

        {/* Prediction Result */}
        <Card className="overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100">

            <div className="flex items-center gap-3">

              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Prediction Result
                </h2>

                <p className="text-sm text-slate-500">
                  Latest inference output
                </p>
              </div>

            </div>

          </div>

          <div className="p-6">

            {prediction !== null ? (

              <div className="text-center">

                <div className="text-xs uppercase tracking-wider
                  font-medium text-slate-400">
                  Predicted Value
                </div>

                <div className="mt-5 rounded-2xl bg-emerald-50
                  border border-emerald-100 p-8">

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

                <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100
                  flex items-center justify-center text-slate-400">

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

      </div>

      {/* Prediction History */}
      <div className="space-y-4">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Recent Predictions
          </h2>

          <p className="text-sm text-slate-500">
            Predictions generated during this session.
          </p>

        </div>

        {predictionHistory.length > 0 ? (

          <Card className="overflow-hidden">

            <div className="divide-y divide-slate-100">

              {predictionHistory.map(item => (

                <div
                  key={item.id}
                  className="px-6 py-4 flex flex-col md:flex-row
                    md:items-center md:justify-between gap-3"
                >

                  <div className="flex items-center gap-3">

                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={18} />
                    </div>

                    <div>

                      <p className="text-sm font-medium text-slate-800">
                        {item.deployment}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {item.time}
                      </p>

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

    </div>
  );
}

const NavItem = ({ to, icon: Icon, children }: any) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors font-medium ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
    >
      <Icon
        size={20}
        className={`mr-3 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
      />
      {children}
    </Link>
  );
};

export default function App() {
  const [auth, setAuth] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    toast("Logged out");
  };

  const renderThemeToggle = (fixed: boolean = false) => (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${fixed ? "theme-toggle-fixed" : ""}`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );

  if (!auth) {
    return (
      <>
        <Toaster position="top-right" />
        {renderThemeToggle(true)}
        <Router>
          <Login setAuth={setAuth} />
        </Router>
      </>
    );
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
            <NavItem to="/" icon={LayoutDashboard}>
              Dashboard
            </NavItem>
            <NavItem to="/datasets" icon={Database}>
              Datasets
            </NavItem>
            <NavItem to="/training" icon={Activity}>
              Training Jobs
            </NavItem>
            <NavItem to="/registry" icon={Box}>
              Registry & Deploy
            </NavItem>
            <NavItem to="/predict" icon={Rocket}>
              Predictions
            </NavItem>
          </nav>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center flex-1 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
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
