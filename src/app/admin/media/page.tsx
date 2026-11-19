"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminMedia, registerMedia, deleteMedia, MediaItem } from "@/api/api";

// Define types for the Cloudinary Widget
interface CloudinaryWidgetResult {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
    resource_type: string;
    format: string;
    bytes: number;
    original_filename: string;
  };
}

interface CloudinaryWidgetError {
  message: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cloudinary: any;
  }
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [uploading, setUploading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // 1. Manually load the Cloudinary script using useEffect
  useEffect(() => {
    const scriptId = "cloudinary-upload-widget";
    if (document.getElementById(scriptId)) {
      if (window.cloudinary) setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    
    script.onload = () => {
      console.log("Cloudinary script loaded successfully.");
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.error("Failed to load Cloudinary script.");
      alert("Failed to load the upload widget. Please check your internet connection.");
    };

    document.body.appendChild(script);
  }, []);

  // Fetch media logic
  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const type = filter === 'all' ? undefined : filter;
      const data = await getAdminMedia(type);
      setMediaList(data);
    } catch (error) {
      console.error("Failed to fetch media", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const openCloudinaryWidget = () => {
    if (!scriptLoaded || !window.cloudinary) {
      alert("Cloudinary widget is still loading. Please wait a moment and try again.");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        folder: "ganu/media",
        resourceType: "auto",
        multiple: false,
        maxFileSize: 50000000, // 50MB limit
        clientAllowedFormats: ["jpg", "png", "jpeg", "webp", "mp4", "mov", "webm"],
      },
      async (error: CloudinaryWidgetError | null, result: CloudinaryWidgetResult | null) => {
        if (!error && result && result.event === "success") {
          setUploading(true);
          const fileInfo = result.info;
          
          try {
            await registerMedia({
              title: fileInfo.original_filename,
              url: fileInfo.secure_url,
              publicId: fileInfo.public_id,
              resourceType: fileInfo.resource_type === "video" ? "video" : "image",
              format: fileInfo.format,
              bytes: fileInfo.bytes,
              originalName: fileInfo.original_filename,
            });
            
            alert("Upload successful and saved to database!");
            fetchMedia(); 
          } catch (error) {
            console.error("Failed to save to DB:", error);
            alert("Uploaded to Cloudinary, but failed to save to database. Check backend connection.");
          } finally {
            setUploading(false);
          }
        }
      }
    );
    widget.open();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media? This will also remove it from Cloudinary.")) return;
    try {
      await deleteMedia(id);
      setMediaList(mediaList.filter((m) => m._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete media.");
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-2">Manage images and videos for your website.</p>
        </div>
        <button
          onClick={openCloudinaryWidget}
          disabled={uploading || !scriptLoaded}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition-colors disabled:opacity-50"
        >
          {uploading ? "Saving..." : !scriptLoaded ? "Loading Widget..." : "+ Upload Media"}
        </button>
      </div>

      <div className="flex space-x-4 mb-6 border-b pb-4">
        {(['all', 'image', 'video'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`capitalize font-medium pb-2 ${
              filter === f ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {f}s
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading media...</div>
      ) : mediaList.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No {filter !== 'all' ? filter + 's' : 'media'} found.</p>
          <button 
            onClick={openCloudinaryWidget} 
            disabled={!scriptLoaded}
            className="text-blue-600 mt-2 hover:underline disabled:opacity-50"
          >
            {!scriptLoaded ? "Loading widget..." : "Upload your first file"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaList.map((media) => (
            <div key={media._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                {media.resourceType === 'video' ? (
                  <video src={media.url} className="w-full h-full object-cover" controls />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={media.url} alt={media.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4 flex-grow">
                <h3 className="font-semibold text-gray-900 truncate" title={media.title}>
                  {media.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">
                  {media.format} • {formatBytes(media.bytes)}
                </p>
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t flex justify-end">
                <button
                  onClick={() => handleDelete(media._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}