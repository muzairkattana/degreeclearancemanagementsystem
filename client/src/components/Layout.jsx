import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AiAssistantWidget from './AiAssistantWidget';
import NotificationBell from './NotificationBell';

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
      {/* Top Navbar - Mobile Optimized */}
      <header className="h-16 bg-[#00173b] text-white flex items-center justify-between px-3 sm:px-6 shadow-md z-30 sticky top-0">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center p-1 border border-white/20 shrink-0">
            <span className="material-symbols-outlined text-amber-400 text-xl sm:text-2xl">school</span>
          </div>
          <div className="truncate">
            <h1 className="font-bold text-sm sm:text-base leading-tight tracking-tight flex items-center gap-1.5 truncate">
              <span>UET Mardan</span>
              <span className="bg-amber-400 text-[#00173b] text-[9px] sm:text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded shrink-0">
                Clearance
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-300 truncate hidden xs:block">Degree Clearance & Issuance System</p>
          </div>
        </div>

        {/* User Badge, Notification Bell & Actions */}
        {user ? (
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Real-Time Notification Bell */}
            <NotificationBell />

            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[150px]">{user.full_name}</span>
              <span className="text-[10px] sm:text-xs text-amber-300 capitalize font-medium">{user.role}</span>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="flex items-center gap-1 text-xs bg-red-600/80 hover:bg-red-600 text-white p-2 sm:px-3 sm:py-1.5 rounded-lg font-medium transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs font-semibold bg-amber-400 hover:bg-amber-500 text-[#00173b] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition"
            >
              Login
            </Link>
          </div>
        )}
      </header>

      {/* Sub Navigation Bar */}
      {user && navLinks.length > 0 && (
        <nav className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 flex items-center gap-2 shadow-xs overflow-x-auto no-scrollbar sticky top-16 z-20">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition shrink-0 ${
                  isActive
                    ? 'bg-[#00173b] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Floating AI Assistant */}
      <AiAssistantWidget />

      {/* Footer with FYP Group Student Credits */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center space-y-1.5">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-700">
          <span className="font-bold text-[#00173b] flex items-center gap-1">
            <span className="material-symbols-outlined text-amber-500 text-sm">groups</span>
            <span>FYP Project Team:</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-100">
            Awais
          </span>
          <span className="text-slate-300">•</span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-100">
            Huzaifa
          </span>
          <span className="text-slate-300">•</span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-100">
            Murtaza
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          Department of Computer Software Engineering — University of Engineering and Technology (UET) Mardan © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
