import { useCallback, useEffect, useState } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface DropZoneInputProps {
  label: string;
  accept: string[];
  onDrop: (files: FileWithPath[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
  value?: FileWithPath[];
  onRemove?: (file: FileWithPath) => void;
}

interface FileWithPreview extends FileWithPath {
  preview?: string;
}

export default function DropZoneInput({
  label,
  accept,
  onDrop,
  multiple = false,
  maxFiles = 1,
  className = '',
  disabled = false,
  value = [],
}: DropZoneInputProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  useEffect(() => {
    setFiles(value.map(file => {
      if (file.type.startsWith('image/') && !('preview' in file)) {
        return Object.assign(file, { preview: URL.createObjectURL(file) });
      }
      return file;
    }));
  }, [value]);

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const onDropCallback = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (!disabled) {
        onDrop(acceptedFiles);
      }
    },
    [onDrop, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: accept.reduce<Record<string, string[]>>((acc, type) => {
      acc[type] = [];
      return acc;
    }, {}),
    multiple,
    maxFiles,
    disabled
  });

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-blue-100">
        {label}
      </label>
      
      <div
        {...getRootProps()}
        className={`
          relative
          border-2 border-dashed rounded-xl p-6 text-center 
          transition-all duration-300 ease-in-out
          cursor-pointer
          bg-blue-900/20 backdrop-blur-sm
          shadow-lg
          hover:shadow-xl
          ${disabled 
            ? 'bg-blue-900/10 cursor-not-allowed opacity-70' 
            : 'hover:border-blue-300'
          }
          ${isDragActive && !disabled 
            ? 'border-amber-400 bg-amber-500/10 shadow-amber-500/20 ring-2 ring-amber-400/50' 
            : 'border-blue-400/50'
          }
        `}
      >
        <input {...getInputProps()} disabled={disabled} aria-label={`${label} file input`} />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className={`
            transition-transform duration-300
            ${isDragActive && !disabled ? 'scale-110' : 'scale-100'}
          `}>
            <UploadCloud 
              className={`h-10 w-10 ${disabled ? 'text-blue-400/50' : isDragActive ? 'text-amber-400' : 'text-blue-300'}`} 
              strokeWidth={isDragActive ? 1.8 : 1.3} 
            />
          </div>
          
          {isDragActive && !disabled ? (
            <div className="space-y-1">
              <p className="text-amber-300 font-medium animate-pulse">Relâchez pour déposer</p>
              <p className="text-xs text-blue-200/80">Types acceptés: {accept.join(', ')}</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className={`text-sm ${disabled ? 'text-blue-300/60' : 'text-blue-100'}`}>
                {disabled 
                  ? 'Limite de fichiers atteinte' 
                  : <span>Glissez-déposez ou <span className="text-amber-300 font-medium hover:underline">parcourir</span></span>
                }
              </p>
              <p className={`text-xs ${disabled ? 'text-blue-300/50' : 'text-blue-200/70'}`}>
                {accept.join(', ')} {maxFiles > 1 ? `| Max. ${maxFiles} fichiers` : ''}
              </p>
            </div>
          )}
        </div>

        {/* Animation de fond pendant le drag */}
        {isDragActive && !disabled && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/10 to-blue-400/10 animate-pulse z-[-1]" />
        )}
      </div>
    </div>
  );
}