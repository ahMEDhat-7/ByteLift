import { useState, useRef, useCallback } from "react";
import { uploadFile } from "../services/api";
import { useToast } from "../context/ToastContext";

interface FileUploaderProps {
  onUploadComplete: () => void;
}

export default function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await uploadFiles(files[0]);
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFiles(files[0]);
    }
  };

  const uploadFiles = async (file: File) => {
    if (file.size > 40 * 1024 * 1024) {
      showToast("File size must be less than 40MB", "error");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      await uploadFile(file, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.progress || 0) * 100,
        );
        setProgress(percentCompleted);
      });
      showToast("File uploaded successfully!", "success");
      onUploadComplete();
    } catch (error: any) {
      showToast(
        error.response?.data?.error?.message || "Upload failed",
        "error",
      );
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div
      className={`file-uploader ${isDragging ? "dragging" : ""} ${uploading ? "uploading" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !uploading && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="file-input"
        accept="image/*,video/*,application/pdf,.txt,.octet-stream"
      />

      <div className="upload-content">
        {uploading ? (
          <>
            <div className="upload-spinner">⏳</div>
            <p className="upload-text">Uploading... {progress}%</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        ) : (
          <>
            <div className="upload-icon">📤</div>
            <p className="upload-text">
              <span className="upload-link">Click to upload</span> or drag and
              drop
            </p>
            <p className="upload-hint">Images, Videos, PDF, Text (max 100MB)</p>
          </>
        )}
      </div>
    </div>
  );
}
