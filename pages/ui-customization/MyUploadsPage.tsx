
import React, { useState, useCallback } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { UploadCloud, Image, Trash2 } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number; // bytes
  url: string; // preview URL
  uploadDate: Date;
}

const MyUploadsPage: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsUploading(true);
      const files = Array.from(event.target.files);
      // Simulate upload and add to list
      setTimeout(() => {
        const newFiles: UploadedFile[] = files.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file), // Create a temporary URL for preview
          uploadDate: new Date(),
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
        setIsUploading(false);
      }, 1500); // Simulate upload delay
    }
  }, []);

  const handleDeleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => {
      if (file.id === id) URL.revokeObjectURL(file.url); // Clean up temporary URL
      return file.id !== id;
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card title="My Uploads">
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        Manage your uploaded assets, such as custom icons, backgrounds, or other media for UI customization.
      </p>

      <div className="mb-6">
        <label htmlFor="file-upload" className="cursor-pointer">
          <Button
            as="span" // Make button act as a span for label behavior
            variant="primary"
            leftIcon={<UploadCloud size={16} />}
            isLoading={isUploading}
            onClick={() => document.getElementById('file-upload')?.click()} // Programmatically click hidden input
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,video/*,.svg" // Example accept types
        />
      </div>

      {uploadedFiles.length === 0 && !isUploading ? (
        <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
          No files uploaded yet. Click "Upload Files" to add assets.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedFiles.map(file => (
            <div key={file.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-neutral-800">
              {file.type.startsWith('image/') ? (
                <img src={file.url} alt={file.name} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                  <Image size={48} className="text-neutral-400 dark:text-neutral-500" />
                </div>
              )}
              <div className="p-3">
                <p className="font-semibold text-sm truncate text-neutral-800 dark:text-neutral-100" title={file.name}>{file.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatFileSize(file.size)}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{file.uploadDate.toLocaleDateString()}</p>
              </div>
              <div className="p-2 border-t border-neutral-200 dark:border-neutral-700 text-right">
                <Button variant="danger" size="sm" onClick={() => handleDeleteFile(file.id)} className="p-1.5">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
       <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
        This is a mock upload interface. Actual file storage would require backend integration.
      </p>
    </Card>
  );
};

export default MyUploadsPage;