import Navbar from "../Navbar";
import Footer from "../Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-12 md:pt-16">
        {title && (
          <div className="py-16 md:py-24">
            <div className="max-w-5xl mx-auto px-6 text-left">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-lg md:text-xl text-text-muted max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="max-w-5xl mx-auto px-6 py-6 md:py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
