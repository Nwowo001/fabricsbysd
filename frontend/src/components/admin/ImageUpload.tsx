'use client';

import { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  images: any[];
  setImages: (images: any[]) => void;
}

export default function ImageUpload({ images, setImages }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const response = await fetch('http://localhost:5000/api/upload/products', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setImages([...images, ...data.images]);
        toast.success('Images uploaded successfully');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Images (Max 5)
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.url}
              alt={`Product ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
            {index === 0 && (
              <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Primary
              </div>
            )}
          </div>
        ))}
        
        {images.length < 5 && (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-xs text-gray-500">
                {uploading ? 'Uploading...' : 'Add Image'}
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>
      
      <p className="mt-2 text-sm text-gray-500">
        Upload up to 5 images. First image will be the primary image.
      </p>
    </div>
  );
}