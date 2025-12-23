import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-darker/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                S
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                SecureID
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 text-sm font-medium bg-white text-darker rounded-md hover:bg-slate-200 transition-colors shadow-lg shadow-white/5">
                    Get Started
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                 <Link to="/dashboard">
                  <button className={`px-4 py-2 text-sm transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-slate-300 hover:text-white'}`}>
                    Dashboard
                  </button>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm border border-slate-700 text-slate-300 rounded-md hover:border-slate-500 hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;