import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
// @ts-ignore
import { motion } from 'framer-motion';
import { FileType, UploadCloud } from 'lucide-react';
import { FileWithPreview } from '../types';

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileAccepted,
  accept = { 'application/pdf': ['.pdf'] },
  maxFiles = 1,
  maxSize = 10485760, // 10MB
}) => {
  const [fileWithPreview, setFileWithPreview] = useState<FileWithPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileWithPreview({
          file,
          preview: URL.createObjectURL(file),
        });
        onFileAccepted(file);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Only PDF files are accepted');
      } else {
        setError(rejection.errors[0].message);
      }
    },
  });

  const removeFile = () => {
    if (fileWithPreview) {
      URL.revokeObjectURL(fileWithPreview.preview);
      setFileWithPreview(null);
    }
  };

  return (
    <div className="w-full">
      {!fileWithPreview ? (
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragActive ? 'border-primary-yellow bg-primary-yellow/5' : 'border-neutral-300'
          } ${
            isDragReject || error ? 'border-error bg-error/5' : ''
          }`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center">
            <UploadCloud 
              className={`h-16 w-16 mb-4 ${
                isDragActive ? 'text-primary-yellow' : 'text-neutral-400'
              } ${
                isDragReject || error ? 'text-error' : ''
              }`} 
            />
            
            <p className="text-lg font-medium">
              {isDragActive 
                ? 'Drop your PDF here...' 
                : 'Drag & drop your PDF here, or click to browse'}
            </p>
            
            <p className="text-sm text-neutral-500 mt-2">
              Only PDF files are supported (max {maxSize / 1024 / 1024}MB)
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="border rounded-lg p-4 flex items-center">
          <div className="bg-neutral-100 rounded p-3 mr-4">
            <FileType className="h-8 w-8 text-primary-yellow" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {fileWithPreview.file.name}
            </p>
            <p className="text-xs text-neutral-500">
              {(fileWithPreview.file.size / 1024).toFixed(2)} KB
            </p>
          </div>
          
          <button 
            type="button"
            onClick={removeFile}
            className="text-neutral-500 hover:text-error transition-colors px-2 py-1 text-sm"
          >
            Remove
          </button>
        </div>
      )}
      
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
};

export default FileUpload;