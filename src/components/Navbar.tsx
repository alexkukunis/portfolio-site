"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/alex_kukunis_2026_apr.pdf', label: 'Resume', isExternal: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') {
      return 'light';
    }
    return document.documentElement?.classList.contains('dark') ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold text-foreground no-underline underline-none decoration-none border-0 border-none bg-transparent rounded-none p-0 m-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 focus:ring-0 ring-0 shadow-none ring-inset-0"
          >
            Alex Kukunis
          </Link>

          {/* Nav Links + Right Actions */}
          <div className="flex items-center">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2 mr-4">
              {navLinks.map((link) => (
                link.isExternal ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${pathname === link.href ? 'bg-surface text-foreground' : 'text-text-muted hover:text-foreground hover:bg-surface'}`}
                  >
                    {link.label}
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === link.href ? 'bg-surface text-foreground' : 'text-text-muted hover:text-foreground hover:bg-surface'}`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Right Actions: Toggle + Mobile Menu */}
            <div className="flex items-center space-x-2">
              {/* Simple Square Theme Toggle */}
              <button
                suppressHydrationWarning
                onClick={toggleTheme}
                className="w-9 h-9 p-1.5 rounded-md flex items-center justify-center text-text-muted hover:text-foreground hover:bg-surface/50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent shadow-sm hover:shadow-md hover:shadow-accent/20 active:scale-95"
                aria-label="Toggle dark/light mode"
                title="Toggle dark/light mode"
              >
                <span suppressHydrationWarning className="material-symbols-outlined text-lg leading-none">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-text-muted hover:text-foreground hover:bg-surface/50 md:hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {navLinks.map((link) => (
              link.isExternal ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${pathname === link.href ? 'bg-surface text-foreground' : 'text-text-muted hover:text-foreground hover:bg-surface'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === link.href ? 'bg-surface text-foreground' : 'text-text-muted hover:text-foreground hover:bg-surface'}`}
                >
                  {link.label}
                </Link>
              )
            ))}

            {/* Simple Square Mobile Theme Toggle */}
            <button
              suppressHydrationWarning
              onClick={toggleTheme}
              className="w-12 h-12 mx-auto rounded-md text-text-muted hover:text-foreground hover:bg-surface/50 transition-all duration-200 mt-3 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface shadow-sm hover:shadow-md hover:shadow-accent/20 active:scale-95"
              aria-label="Toggle dark/light mode"
              title="Toggle dark/light mode"
            >
              <span suppressHydrationWarning className="material-symbols-outlined text-xl leading-none">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}