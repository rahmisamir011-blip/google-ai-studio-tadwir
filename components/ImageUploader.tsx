import React, { useState, useRef, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import type { AiResponse } from '../types';

interface ImageUploaderProps {
  setResponse: (response: AiResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

const GalleryIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ setResponse, setLoading, setError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const MAX_DIMENSION = 1024; // Max width or height
        const QUALITY = 0.8;
        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                let { width, height } = img;

                if (width > height) {
                    if (width > MAX_DIMENSION) {
                        height = Math.round(height * (MAX_DIMENSION / width));
                        width = MAX_DIMENSION;
                    }
                } else {
                    if (height > MAX_DIMENSION) {
                        width = Math.round(width * (MAX_DIMENSION / height));
                        height = MAX_DIMENSION;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    return reject(new Error("Failed to get canvas context."));
                }
                
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            return reject(new Error("Image compression failed."));
                        }
                        // Create a new file with a consistent .jpeg extension
                        const fileName = file.name.replace(/\.[^/.]+$/, "") + ".jpeg";
                        const compressedFile = new File([blob], fileName, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    QUALITY
                );
            };

            img.onerror = (err) => reject(err);
        };
        
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
  };


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit before compression
        setError("حجم الصورة كبير جداً. الرجاء اختيار صورة أصغر من 10 ميغابايت.");
        return;
      }
      
      setResponse(null);
      setError(null);
      
      try {
        const compressedFile = await compressImage(file);
        
        setSelectedFile(compressedFile);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(compressedFile));
      } catch (err) {
        console.error("Compression error:", err);
        setError("حدث خطأ أثناء معالجة الصورة. الرجاء المحاولة مرة أخرى.");
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!selectedFile) {
      setError("الرجاء اختيار صورة أولاً.");
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await analyzeImage(selectedFile);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, [selectedFile, setResponse, setLoading, setError]);

  return (
    <div className="flex flex-col items-center gap-4">
        {/* Hidden file inputs */}
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleFileChange} />

        <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-lg p-1" />
            ) : (
                 <p className="text-gray-500">...معاينة الصورة تظهر هنا</p>
            )}
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
             <button onClick={() => cameraInputRef.current?.click()} className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                <CameraIcon/>
                التقط صورة
            </button>
             <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                 <GalleryIcon/>
                اختر من المعرض
            </button>
        </div>

      <button
        onClick={handleAnalyzeClick}
        disabled={!selectedFile}
        className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-transform transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
      >
        تحليل الصورة
      </button>
    </div>
  );
};