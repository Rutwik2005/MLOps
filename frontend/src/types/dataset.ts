export interface Dataset {
  id: number | string;
  name: string;
  description: string;
  file_path?: string;
  uploaded_at?: string;
}

export interface DatasetUploadResponse {
  success: boolean;
  dataset: Dataset;
}
