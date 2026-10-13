import React, { useRef, useState } from 'react';
import { Camera, Upload, Link as LinkIcon, X, Check, Image as ImageIcon } from 'lucide-react';

/**
 * ImageCaptureInput
 * Allows uploading images via device camera, gallery/file picker, or direct URL.
 * Automatically converts local photos to base64 data URLs for seamless instant storage.
 */
const ImageCaptureInput = ({ value, onChange, label = "Product Image", placeholder = "Paste image URL or take photo" }) => {
  const [tab, setTab] = useState('camera'); // 'camera' | 'url'
  const [urlInput, setUrlInput] = useState('');
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  const handleClear = () => {
    onChange('');
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC]">
          {label}
        </label>
        <div className="flex items-center gap-1 text-[11px] font-semibold bg-[#F1E8D8]/50 dark:bg-[#1A2E28] rounded-lg p-0.5 border border-[#DDD5C8]/70 dark:border-[#2A443E]">
          <button
            type="button"
            onClick={() => setTab('camera')}
            className={`px-2 py-1 rounded-md transition ${tab === 'camera' ? 'bg-white dark:bg-[#13221E] text-[#17745A] dark:text-[#10B981] font-bold shadow-xs' : 'text-[#625F59] dark:text-[#A7B3AF]'}`}
          >
            Camera / File
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`px-2 py-1 rounded-md transition ${tab === 'url' ? 'bg-white dark:bg-[#13221E] text-[#17745A] dark:text-[#10B981] font-bold shadow-xs' : 'text-[#625F59] dark:text-[#A7B3AF]'}`}
          >
            Web URL
          </button>
        </div>
      </div>

      {value ? (
        <div className="relative rounded-2xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#162723] p-2 flex items-center gap-3">
          <img
            src={value}
            alt="Product preview"
            className="w-16 h-16 rounded-xl object-cover border border-[#DDD5C8] dark:border-[#2A443E] bg-white shrink-0 shadow-xs"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=70";
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <Check size={14} /> Image Selected & Ready
            </div>
            <p className="text-[11px] text-[#625F59] dark:text-[#A7B3AF] truncate mt-0.5">
              {value.startsWith('data:') ? 'Captured from Device Photo / Camera' : value}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 transition shrink-0"
            title="Remove photo"
          >
            <X size={16} />
          </button>
        </div>
      ) : tab === 'camera' ? (
        <div className="grid grid-cols-2 gap-2">
          {/* Hidden inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Camera Button */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-xl border border-dashed border-[#17745A]/50 bg-[#17745A]/5 hover:bg-[#17745A]/10 text-[#17745A] dark:border-[#10B981]/50 dark:bg-[#10B981]/10 dark:text-[#10B981] transition cursor-pointer"
          >
            <Camera size={20} />
            <span className="text-xs font-bold">Snap Camera Photo</span>
            <span className="text-[10px] text-[#625F59] dark:text-[#A7B3AF]">Mobile / Live Camera</span>
          </button>

          {/* File Picker Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-xl border border-dashed border-[#DDD5C8] bg-white hover:bg-[#F1E8D8]/40 text-[#192D2A] dark:border-[#2A443E] dark:bg-[#162723] dark:text-[#F8FAFC] dark:hover:bg-[#1A2E28] transition cursor-pointer"
          >
            <Upload size={20} className="text-[#625F59] dark:text-[#A7B3AF]" />
            <span className="text-xs font-bold">Upload Gallery / File</span>
            <span className="text-[10px] text-[#625F59] dark:text-[#A7B3AF]">JPG, PNG, WebP</span>
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#625F59] dark:text-[#A7B3AF]" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/fresh-produce.jpg"
              className="input-field pl-9"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyUrl}
            className="btn-primary px-4 py-2 rounded-xl text-xs"
          >
            Set
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageCaptureInput;
