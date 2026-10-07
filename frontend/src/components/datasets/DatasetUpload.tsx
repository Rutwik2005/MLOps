import React, { useState } from 'react';
import { UploadCloud, Database, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

export interface DatasetUploadProps {
  onUpload: (file: File, name: string, description: string) => Promise<boolean>;
  loading?: boolean;
}

export const DatasetUpload: React.FC<DatasetUploadProps> = ({ onUpload, loading = false }) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const success = await onUpload(file, name, desc);
    if (success) {
      setFile(null);
      setName('');
      setDesc('');
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <UploadCloud size={22} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Upload New Dataset</h2>
            <p className="text-sm text-slate-500">
              Add a CSV dataset to your MLOps workflow.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Dataset Name
            </label>
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
              placeholder="e.g. customer_churn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <Input
              value={desc}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDesc(e.target.value)}
              required
              placeholder="Short description of the dataset"
            />
          </div>

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

        {file && (
          <div className="mt-5 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white text-blue-600">
                <Database size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={loading}>
            <UploadCloud size={18} className="mr-2" />
            {loading ? 'Uploading...' : 'Upload Dataset'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default DatasetUpload;
