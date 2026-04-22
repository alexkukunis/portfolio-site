"use client";

import type { EditorProps, RenderProps } from '../types';
import { Field, TextInput, ImagePlaceholder } from './shared';
import { ImageModal } from './ImageModal';
import { useState } from 'react';

export const carouselMeta = {
  type: 'carousel' as const,
  label: 'Screenshot Carousel',
  icon: '▤',
  category: 'media' as const,
};

export interface CarouselSlide {
  url: string;
  alt: string;
}

export interface CarouselContent {
  slides: CarouselSlide[];
}

export const carouselDefault: CarouselContent = {
  slides: [
    { url: '', alt: 'Slide 1' },
    { url: '', alt: 'Slide 2' },
    { url: '', alt: 'Slide 3' },
  ],
};

function CarouselImage({ slide, onZoom }: { slide: CarouselSlide; onZoom?: () => void }) {
  if (slide.url) {
    return (
      <div className="relative group cursor-pointer" onClick={onZoom}>
        <img
          src={slide.url}
          alt={slide.alt}
          className="h-full w-auto mx-auto rounded-xl object-contain group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center rounded-xl">
          <svg className="w-10 h-10 text-white/80 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full rounded-2xl border border-border/50 bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] flex items-center justify-center overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative flex flex-col items-center gap-3 text-text-muted/50 select-none">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12" y2="18.01" />
        </svg>
        <span className="text-[10px] tracking-widest uppercase text-text-muted/40">{slide.alt}</span>
      </div>
      <div className="absolute top-3 left-3 px-2 py-1 rounded-md border border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-text-muted/40 font-medium">
        Mobile UI
      </div>
    </div>
  );
}

export function CarouselEditor({ value, onChange }: EditorProps<'carousel'>) {
  const slides = Array.isArray(value.slides) ? value.slides : carouselDefault.slides;
  const update = (patch: CarouselContent) => onChange(patch);

  const updateSlide = (i: number, patch: Partial<CarouselSlide>) => {
    const next = [...slides];
    next[i] = { ...next[i], ...patch };
    update({ slides: next });
  };

  return (
    <div className="space-y-2">
      {slides.map((slide, i) => (
        <div key={i} className="p-3 rounded-lg border border-border space-y-2">
          <div className="text-xs font-medium text-text-muted">Slide {i + 1}</div>
          <Field label="Alt label">
            <TextInput value={slide.alt} onChange={(v) => updateSlide(i, { alt: v })} placeholder={`Slide ${i + 1}`} />
          </Field>
          {slide.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <div className="space-y-2">
              <img src={slide.url} alt="" className="max-h-40 rounded-lg border border-border object-contain" />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateSlide(i, { url: '' })}
                  className="text-xs text-red-400 underline"
                >
                  Remove image
                </button>
              </div>
            </div>
          ) : (
            <ImagePlaceholder label="Upload phone mockup" />
          )}
        </div>
      ))}
    </div>
  );
}

export function RenderCarousel({ content }: RenderProps<'carousel'>) {
  const slides = Array.isArray(content.slides) ? content.slides : [];
  const valid = slides.filter(Boolean);
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentAlt, setCurrentAlt] = useState('');

  if (valid.length === 0) return null;

  return (
    <div className="py-10">
      {/* Phone frame */}
      <div className="max-w-[300px] mx-auto">
        <div className="relative rounded-[2rem] border-4 border-[#2a2a3a] bg-[#1a1a2e] overflow-hidden shadow-2xl shadow-accent/5">
          <div className="relative aspect-[9/19.5] bg-background p-3">
            {valid.map((slide, i) => (
              <div
                key={i}
                className="absolute inset-3 flex items-center justify-center transition-all duration-500 ease-in-out"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: `translateX(${(i - active) * 20}%)`,
                  pointerEvents: i === active ? 'auto' : 'none',
                }}
              >
                <CarouselImage slide={slide} onZoom={() => { setModalOpen(true); setCurrentImage(slide.url); setCurrentAlt(slide.alt); }} />
              </div>
            ))}
            <ImageModal isOpen={modalOpen} onClose={() => setModalOpen(false)} imageUrl={currentImage} alt={currentAlt} />
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {valid.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? 'w-6 bg-accent' : 'w-2 bg-text-muted/30 hover:bg-text-muted/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Nav */}
      {valid.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-3">
          <button
            onClick={() => setActive(Math.max(0, active - 1))}
            disabled={active === 0}
            className="px-3 py-1.5 rounded-full border border-border text-xs text-text-muted hover:text-foreground hover:border-text-muted transition disabled:opacity-30"
          >
            ← Prev
          </button>
          <button
            onClick={() => setActive(Math.min(valid.length - 1, active + 1))}
            disabled={active === valid.length - 1}
            className="px-3 py-1.5 rounded-full border border-border text-xs text-text-muted hover:text-foreground hover:border-text-muted transition disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
