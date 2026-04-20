import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="inline-flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Portfolio
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Crafting digital experiences that blend beautiful design with seamless functionality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Case Studies", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "-").replace("'s", "")}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Email: hello@portfolio.com</li>
              <li>Location: San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Portfolio. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
