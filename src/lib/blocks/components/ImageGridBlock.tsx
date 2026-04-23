"use client";

import { useState } from 'react';
import type { EditorProps, RenderProps } from '../types';
import { Field, TextInput } from './shared';
import ImageField from '@/components/admin/ImageField';
import { ImageModal } from './ImageModal';

export const imageGridMeta = {
  type: 'image-grid' as const,
  label: 'Image Grid',
  icon: '⊟⊟⊟',
  category: 'media' as const,
};

export interface ImageGridContent {
  images: Array<{
    url: string;
    alt: string;
    caption: string;
  }>;
  title?: string;
}

export const imageGridDefault: ImageGridContent = {
  images: [
    { url: '', alt: '', caption: '' },
    { url: '', alt: '', caption: '' },
    { url: '', alt: '', caption: '' },
  ],
};

const gradients = [
  ['var(--tw-gradient-from, #1a1a2e)', 'var(--tw-gradient-to, #16213e)'],
  ['var(--tw-gradient-from, #16213e)', 'var(--tw-gradient-to, #0f3460)'],
  ['var(--tw-gradient-from, #0f3460)', 'var(--tw-gradient-to, #1a1a2e)'],
];

function getGradient(index: number) {
  const [from, to] = gradients[index % gradients.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
}

function ImagePlaceholder({ alt }: { alt: string }) {
  return (
    <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/20 to-accent/10 flex items-center justify-center">
      <div className="text-center text-xs text-muted-foreground p-4">
        <svg className="w-8 h-8 mx-auto mb-2 text-muted-foreground" fill="none" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <div>{alt || 'Image'}</div>
      </div>
    </div>
  );
}

function RealImage({ 
  url, 
  alt, 
  onZoom 
}: { 
  url: string; 
  alt: string; 
  onZoom: () => void; 
}) {
  return (
    <figure className="cursor-pointer group" onClick={onZoom}>
      <div className="aspect-[4/3] rounded-2xl border border-border/50 overflow-hidden relative group-hover:ring-2 group-hover:ring-accent/30 transition-all">
        <img
          src={url}
          alt={alt}
          className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </div>
      </div>
    </figure>
  );
}

export function ImageGridEditor({ value, onChange }: EditorProps<'image-grid'>) {
  const v = value as ImageGridContent;
  const images = v.images || imageGridDefault.images;
  const set = (images: ImageGridContent['images']) => onChange({ ...v, images } as ImageGridContent);

  const updateImage = (i: number, patch: Partial<ImageGridContent['images'][number]>) => {
    const next = [...images];
    next[i] = { ...next[i], ...patch };
    set(next);
  };

  const addImage = () => {
    if (images.length < 6) set([...images, { url: '', alt: '', caption: '' }]);
  };

  const removeImage = (i: number) => {
    set(images.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div key={i} className="p-4 border rounded-xl space-y-3">
            <div className="text-sm font-medium text-muted-foreground mb-2">Image {i + 1}</div>
            <ImageField 
              value={img.url} 
              onChange={(url) => updateImage(i, { url })} 
            />
            <Field label="Alt">
              <TextInput 
                value={img.alt} 
                onChange={(alt) => updateImage(i, { alt })} 
                placeholder="Descriptive alt text"
              />
            </Field>
            <Field label="Caption">
              <TextInput 
                value={img.caption} 
                onChange={(caption) => updateImage(i, { caption })} 
                placeholder="Short caption"
              />
            </Field>
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="text-xs text-destructive hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {images.length < 6 && (
        <button
          type="button"
          onClick={addImage}
          className="px-4 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-border hover:bg-accent/10 transition-colors"
        >
          + Add Image (up to 6)
        </button>
      )}
    </div>
  );
}

export function RenderImageGrid({ content }: RenderProps<'image-grid'>) {
  const v = content as ImageGridContent;
  const images = (v.images || []).filter(img => img.url);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentAlt, setCurrentAlt] = useState('');

  if (images.length === 0) return null;

  return (
    <div className="my-16">
      {v.title && (
        <h3 className="text-xl font-semibold mb-8 text-center">{v.title}</h3>
      )}
      {images.length === 1 ? (
        <div className="w-full">
          <RealImage
            url={images[0].url}
            alt={images[0].alt}
            onZoom={() => {
              setModalOpen(true);
              setCurrentImage(images[0].url);
              setCurrentAlt(images[0].alt);
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          {images.map((img, i) => (
            <RealImage
              key={i}
              url={img.url}
              alt={img.alt}
              onZoom={() => {
                setModalOpen(true);
                setCurrentImage(img.url);
                setCurrentAlt(img.alt);
              }}
            />
          ))}
        </div>
      )}
      <ImageModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        imageUrl={currentImage} 
        alt={currentAlt} 
      />
    </div>
  );
}