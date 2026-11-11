import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getNavLinks = () => {
    if (!user) return [];
    if (user.role === 'student') {
      return [
        { label: 'Dashboard', path: '/student', icon: 'dashboard' },
        { label: 'Apply Clearance', path: '/student/apply', icon: 'post_add' },
        { label: 'My Applications', path: '/student/applications', icon: 'folder_open' },
      ];
    }
    if (user.role === 'officer') {
      return [
        { label: 'Review Queue', path: '/officer', icon: 'task' },
      ];
    }
    if (user.role === 'admin' || user.role === 'controller') {
      return [
        { label: 'Admin Dashboard', path: '/admin', icon: 'analytics' },
        { label: 'All Requests', path: '/admin/requests', icon: 'list_alt' },
        { label: 'User Management', path: '/admin/users', icon: 'group' },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <header className="h-16 bg-[#00173b] text-white flex items-center justify-between px-6 shadow-md z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center p-1.5 border border-white/20">
            <span className="material-symbols-outlined text-amber-400 text-2xl">school</span>
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight tracking-tight flex items-center gap-2">
              UET Mardan
              <span className="bg-amber-400 text-[#00173b] text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded">
                Clearance Portal
              </span>
            </h1>
            <p className="text-xs text-slate-300">Degree Verification & Issuance System</p>
          </div>
        </div>

        {/* User Badge & Actions */}
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-white">{user.full_name}</span>
              <span className="text-xs text-amber-300 capitalize font-medium">{user.role} {user.department?.name ? `(${user.department.name})` : ''}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold bg-amber-400 hover:bg-amber-500 text-[#00173b] px-4 py-2 rounded-lg transition"
            >
              Portal Login
            </Link>
          </div>
        )}
      </header>

      {/* Sub Navigation Bar for Logged-In Users */}
      {user && navLinks.length > 0 && (
        <nav className="bg-white border-b border-slate-200 px-6 py-2 flex items-center gap-2 shadow-xs overflow-x-auto">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  isActive
                    ? 'bg-[#00173b] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} University of Engineering and Technology (UET) Mardan. All rights reserved.
      </footer>
    </div>
  );
}
