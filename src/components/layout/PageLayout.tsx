import Navbar from "../Navbar";
import Footer from "../Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {title && (
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
              {subtitle && (
                <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
