
import React from 'react';
import { FileText, X } from 'lucide-react';

interface UploadedFile {
  name: string;
  content: string;
  type: string;
}

interface FileUploadAreaProps {
  uploadedFiles: UploadedFile[];
  onRemoveFile: (index: number) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ uploadedFiles, onRemoveFile }) => {
  if (uploadedFiles.length === 0) return null;

  return (
    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Uploaded Files:</h4>
      <div className="flex flex-wrap gap-2">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full text-sm">
            <FileText className="h-3 w-3" />
            <span className="truncate max-w-[150px]">{file.name}</span>
            <button
              onClick={() => onRemoveFile(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploadArea;
