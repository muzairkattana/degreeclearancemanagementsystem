import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unread_count || 0);
      }
    } catch (err) {
      // silent catch for polling
    }
  };

  const handleMarkAsRead = async (notifId, e) => {
    e?.stopPropagation();
    try {
      await api.put(`/notifications/${notifId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === notifId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer border border-white/20 relative"
      >
        <span className="material-symbols-outlined text-lg sm:text-xl">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] sm:text-[10px] font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-[#00173b] shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Notification Tray - Mobile Viewport Fit */}
      {isOpen && (
        <div className="fixed sm:absolute inset-x-2 sm:inset-x-auto sm:right-0 top-18 sm:top-auto sm:mt-3 w-auto sm:w-96 max-w-[96vw] sm:max-w-none bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="bg-[#00173b] p-3.5 sm:p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-lg sm:text-xl">notifications_active</span>
              <h3 className="font-bold text-xs sm:text-sm tracking-tight">Notifications</h3>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={loading}
                className="text-[10px] sm:text-[11px] text-amber-300 hover:text-white font-medium hover:underline cursor-pointer disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List Area */}
          <div className="max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <span className="material-symbols-outlined text-3xl text-slate-300 mb-1">notifications_off</span>
                <p className="text-xs">No notifications right now.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.notification_id}
                  onClick={(e) => !n.is_read && handleMarkAsRead(n.notification_id, e)}
                  className={`p-3 sm:p-3.5 transition flex items-start gap-2.5 sm:gap-3 cursor-pointer hover:bg-slate-100 ${
                    !n.is_read ? 'bg-blue-50/70 border-l-4 border-l-blue-600' : 'bg-white'
                  }`}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    !n.is_read ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className="material-symbols-outlined text-xs sm:text-sm">
                      {n.title.toLowerCase().includes('approved') || n.title.toLowerCase().includes('completed')
                        ? 'check_circle'
                        : n.title.toLowerCase().includes('reject') || n.title.toLowerCase().includes('correction')
                        ? 'warning'
                        : 'info'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <p className={`text-xs font-bold truncate ${!n.is_read ? 'text-[#00173b]' : 'text-slate-700'}`}>
                        {n.title}
                      </p>
                      <span className="text-[9px] text-slate-400 shrink-0">
                        {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed line-clamp-3">
                      {n.message}
                    </p>
                  </div>

                  {!n.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(n.notification_id, e)}
                      title="Mark as read"
                      className="text-slate-400 hover:text-blue-600 p-1 rounded-md transition cursor-pointer shrink-0"
                    >
                      <span className="material-symbols-outlined text-[15px]">done</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 bg-slate-100 border-t border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 font-medium">
              UET Mardan Real-Time Notifications
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
