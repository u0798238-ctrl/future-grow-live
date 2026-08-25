import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Network, Menu, X, ChevronRight, LogOut, User as UserIcon } from 'lucide-react';
import { PwaInstallPrompt, InstallAppButton } from '@/components/PwaInstallPrompt';

export function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  // Automatically close mobile menu whenever route changes
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Business Plan', path: '/plan' },
    { name: 'Contact', path: '/contact' },
  ];

  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register') || location.pathname.startsWith('/r/') || location.pathname.startsWith('/join/') || location.pathname.startsWith('/ref/');

  return (
    <div className="min-h-screen bg-[#071E2C] flex flex-col font-sans text-white">
      {/* PWA Prompt */}
      <PwaInstallPrompt />

      {!isAuthPage && (
        <header className="sticky top-0 z-50 bg-[#132C3C] border-b border-[#28485A]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                  <Network className="h-8 w-8 text-[#8FA3AF]" />
                  <span className="text-xl font-semibold tracking-tight text-white">Future Grow</span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-[#8FA3AF] ${
                      location.pathname === link.path ? 'text-[#8FA3AF]' : 'text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                <InstallAppButton />
                <Link to="/login" className="text-sm font-medium text-white hover:text-white">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-50 bg-[#1B3343] text-white hover:bg-[#28485A] h-9 px-4 py-2"
                >
                  Register Now
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center gap-2">
                <InstallAppButton className="text-[11px] px-2 py-1" />
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-[#8FA3AF] hover:text-white p-2"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-[#132C3C] border-b border-[#28485A]/50 shadow-2xl animate-in slide-in-from-top-2 duration-200">
              <div className="px-3 pt-2 pb-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-200 hover:text-white hover:bg-[#071E2C] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-3 pb-1 border-t border-[#28485A]/50 flex flex-col gap-2">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center py-2.5 text-base font-semibold text-gray-200 bg-[#1B3343] hover:bg-[#28485A] rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center py-2.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          )}
        </header>
      )}

      <main className={`flex-grow ${isAuthPage ? 'flex flex-col' : ''}`}>
        <Outlet />
      </main>

      {!isAuthPage && (
        <footer className="bg-[#071E2C] text-gray-300 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Network className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-semibold tracking-tight text-white">Future Grow</span>
              </Link>
              <p className="text-sm text-[#8FA3AF] max-w-sm">
                Empowering individuals through a revolutionary binary network marketing plan. Build your team, grow your income, and achieve financial freedom.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white tracking-wider uppercase mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/plan" className="hover:text-white transition-colors">Business Plan</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#28485A]/50 text-sm text-center text-[#8FA3AF]">
            &copy; {new Date().getFullYear()} Future Grow. All rights reserved.
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
