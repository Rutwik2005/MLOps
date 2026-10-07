import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';

export interface LoginPageProps {
  initialIsRegister?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialIsRegister = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(initialIsRegister);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await authApi.register({ username, password });
        toast.success('Account created! Please log in.');
        setIsRegister(false);
      } else {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const data = await authApi.login(formData);

        login(data.access_token, data.backend_session_id);
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
          <p className="text-slate-500 mt-2">
            {isRegister ? 'Create your account' : 'Welcome back, please log in'}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full py-2.5 text-base"
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : isRegister
                ? 'Create Account'
                : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account? Register"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
