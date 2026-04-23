import type { AppStoreScreenshotsContent } from '../types';
import type { RenderProps } from '../types';

function ScreenshotPlaceholder({ label }: { label: string }) {
  const gradients = [
    ['var(--tw-gradient-from, #1a1a2e)', 'var(--tw-gradient-to, #16213e)'],
    ['var(--tw-gradient-from, #16213e)', 'var(--tw-gradient-to, #0f3460)'],
    ['var(--tw-gradient-from, #0f3460)', 'var(--tw-gradient-to, #1a1a2e)'],
    ['var(--tw-gradient-from, #121212)', 'var(--tw-gradient-to, #1e1e2e)'],
    ['var(--tw-gradient-from, #232336)', 'var(--tw-gradient-to, #1a1a2e)'],
    ['var(--tw-gradient-from, #1b1b3a)', 'var(--tw-gradient-to, #111628)'],
    ['var(--tw-gradient-from, #15192d)', 'var(--tw-gradient-to, #1e293b)'],
  ];

  const [from, to] = gradients[Math.floor(Math.random() * gradients.length)];
  const bg = `linear-gradient(135deg, ${from}, ${to})`;

  return (
    <div
      className="w-full aspect-[4/3] rounded-2xl border border-border/50 overflow-hidden relative flex items-center justify-center"
      style={{ background: bg }}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-3 text-text-muted/50 select-none">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <span className="text-[10px] tracking-wide text-text-muted/40 text-center px-2">{label}</span>
      </div>
    </div>
  );
}

export function RenderAppStoreScreenshots({ content }: RenderProps<'appstore-screenshots'>) {
  const v = content as AppStoreScreenshotsContent;

  return (
    <div className="my-16">
      {/* Section heading */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-foreground mb-3">{v.title}</h2>
        {v.subtitle && <p className="text-text-muted max-w-2xl">{v.subtitle}</p>}
      </div>

      {/* Full-width App Store screenshots row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {v.screenshots.map((ss, i) => (
          <div key={i}>
            {ss.url ? (
              <img
                src={ss.url}
                alt={ss.alt}
                className="w-full h-auto rounded-2xl border border-border/50 object-contain shadow-2xl"
              />
            ) : (
              <ScreenshotPlaceholder label={ss.alt || `Screen ${i + 1}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Design Criteria section with image on left
export function RenderDesignCriteria({ content }: RenderProps<'appstore-screenshots'>) {
  const v = content as AppStoreScreenshotsContent;

  return (
    <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      {/* Feature image on left */}
      <div className="order-1">
        {v.featureImage.url ? (
          <img
            src={v.featureImage.url}
            alt={v.featureImage.alt || v.featureImage.caption}
            className="w-full rounded-2xl border border-border/50 object-cover"
          />
        ) : (
          <div
            className="w-full aspect-[4/3] rounded-2xl border border-border/50 flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg, var(--tw-gradient-from, #1a1a2e), var(--tw-gradient-to, #16213e))' }}
          >
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />
            <div className="relative z-10 flex flex-col items-center gap-3 text-text-muted/50 select-none">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              {v.featureImage.caption && (
                <span className="text-xs tracking-wide uppercase text-text-muted/40">{v.featureImage.caption}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Text content on right */}
      <div className="order-1 md:order-2 space-y-4">
        {v.title && <h2 className="text-2xl font-bold text-foreground">{v.title}</h2>}
        {v.subtitle && <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">{v.subtitle}</p>}
      </div>
    </div>
  );
}

export const appStoreScreenshotsDefault: AppStoreScreenshotsContent = {
  title: '',
  subtitle: '',
  screenshots: [],
  featureImage: { url: '', caption: '', alt: '' },
};

export const appStoreScreenshotsMeta = {
  type: 'appstore-screenshots' as const,
  label: 'App Store Screenshots',
  icon: '📱',
  category: 'media' as const,
};
