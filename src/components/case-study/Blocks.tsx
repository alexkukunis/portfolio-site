export interface BlockProps {
  type: string;
  content: any;
}

export function RenderBlock({ type, content }: BlockProps) {
  switch (type) {
    case 'hero':
      return (
        <section className="py-20">
          <img src={content.imageUrl} alt={content.title} className="w-full h-[50dvh] object-cover rounded-2xl mb-8" />
          <h1 className="text-5xl font-bold mb-4">{content.title}</h1>
          <p className="text-xl text-slate-400 mb-6">{content.subtitle}</p>
          <div className="flex gap-4">
            {content.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-slate-800 rounded-full text-sm font-mono">{tag}</span>
            ))}
          </div>
        </section>
      );
    case 'problem':
      return (
        <section className="py-12 border-t border-slate-800">
          <h2 className="text-2xl font-semibold mb-6">The Problem</h2>
          <p className="text-lg leading-relaxed text-slate-400">{content.text}</p>
        </section>
      );
    // Add other blocks (result, etc.) as needed
    default:
      return null;
  }
}
