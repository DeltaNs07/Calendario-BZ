import React, { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, Link as LinkIcon, Upload } from 'lucide-react';
import { SmartImage } from './SmartImage';

interface PresetOption {
  label: string;
  url: string;
}

interface ImageUploaderFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  presets?: PresetOption[];
  aspectRatio?: 'square' | 'banner' | 'video';
  helperText?: string;
}

export const ImageUploaderField: React.FC<ImageUploaderFieldProps> = ({
  label,
  value,
  onChange,
  presets = [],
  aspectRatio = 'square',
  helperText,
}) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [urlInput, setUrlInput] = useState(value);

  useEffect(() => {
    setUrlInput(value);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
        setUrlInput(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const previewClass =
    aspectRatio === 'banner'
      ? 'w-full h-28 rounded-xl'
      : aspectRatio === 'video'
      ? 'w-full h-36 rounded-xl'
      : 'w-20 h-20 rounded-2xl';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-heading font-semibold uppercase text-zinc-200 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
          {label}
        </label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="min-h-[38px] px-3 py-1.5 rounded-xl bg-purple-600/25 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          Subir Archivo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div
          className={`${previewClass} bg-black border border-white/15 overflow-hidden shrink-0`}
        >
          <SmartImage
            src={value}
            alt={label}
            fallbackText="IMG"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 w-full space-y-2">
          <div className="relative">
            <LinkIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                onChange(e.target.value);
              }}
              placeholder="Pega enlace de imagen o sube un archivo..."
              className="w-full min-h-[42px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl pl-8 pr-3 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          {presets.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    onChange(preset.url);
                    setUrlInput(preset.url);
                  }}
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    value === preset.url
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {helperText && <p className="text-xs text-zinc-400">{helperText}</p>}
        </div>
      </div>
    </div>
  );
};
