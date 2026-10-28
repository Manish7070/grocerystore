import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, X, AlertCircle, ShoppingBag, Info, ExternalLink, ChevronRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null); // Selected notification for full modal preview
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const handleOpenDetail = (item) => {
    markAsRead(item.id);
    setActiveItem(item);
  };

  const handleDeleteItem = (e, id) => {
    e.stopPropagation();
    deleteNotification(id);
    if (activeItem?.id === id) {
      setActiveItem(null);
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Bell Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="View notifications"
          className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-[#DDD5C8]/80 dark:border-[#223832] bg-white dark:bg-[#13221E] text-[#192D2A] dark:text-[#F8FAFC] hover:border-[#17745A] hover:bg-[#FDFBF7] dark:hover:bg-[#1A2E28] transition shadow-xs"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] sm:h-4.5 sm:min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] sm:text-[10px] font-bold text-white shadow-xs animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="fixed inset-x-3 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2.5 sm:w-96 rounded-2xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#DDD5C8]/60 dark:border-[#223832] bg-[#FDFBF7] dark:bg-[#0E1A17]">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-[#192D2A] dark:text-[#F8FAFC]">
                  Activity Alerts
                </span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#17745A]/10 text-[#17745A] dark:bg-[#10B981]/20 dark:text-[#10B981]">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    className="px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold text-[#17745A] dark:text-[#10B981] flex items-center gap-1 transition"
                  >
                    <Check size={13} />
                    <span className="text-[11px]">Read All</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    title="Clear all notifications"
                    className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-[#DDD5C8]/40 dark:divide-[#223832]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#625F59] dark:text-[#A7B3AF]">
                  <Bell size={28} className="mx-auto mb-2 text-[#DDD5C8] dark:text-[#2A443E]" />
                  <p className="font-semibold text-sm text-[#192D2A] dark:text-[#F8FAFC]">No new notifications</p>
                  <p className="mt-1">Order dispatches and store updates will appear here.</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className={`group relative p-3.5 flex items-start gap-3 transition cursor-pointer hover:bg-[#FDFBF7] dark:hover:bg-[#162723] ${
                      !item.read ? 'bg-[#17745A]/5 dark:bg-[#10B981]/5' : ''
                    }`}
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-[#F1E8D8] dark:bg-[#1A2E28] text-[#17745A] dark:text-[#10B981] shrink-0">
                      {item.type === 'order' ? <ShoppingBag size={14} /> : <Info size={14} />}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-bold truncate ${!item.read ? 'text-[#192D2A] dark:text-[#F8FAFC]' : 'text-[#625F59] dark:text-[#A7B3AF]'}`}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-[#625F59] dark:text-[#A7B3AF] shrink-0">
                          {formatTime(item.time)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#625F59] dark:text-[#A7B3AF] line-clamp-2 mt-0.5">
                        {item.message}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(item);
                        }}
                        className="mt-1.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                      >
                        Read More <ChevronRight size={10} />
                      </button>
                    </div>

                    {/* Quick remove button on hover */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(e, item.id)}
                      title="Remove notification"
                      className="absolute right-2 top-3 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition"
                    >
                      <Trash2 size={13} />
                    </button>

                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#17745A] dark:bg-[#10B981] shrink-0 self-center" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 border-t border-[#DDD5C8]/60 dark:border-[#223832] bg-[#FDFBF7] dark:bg-[#0E1A17] text-center">
              <Link
                to="/orders"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-bold text-[#17745A] dark:text-[#10B981] hover:underline flex items-center justify-center gap-1"
              >
                <span>View All Order History</span>
                <ExternalLink size={11} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Full Notification Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[calc(100vw-32px)] sm:max-w-md rounded-2xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#142320] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#DDD5C8]/70 dark:border-[#223832] bg-[#FDFBF7] dark:bg-[#0E1A17]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
                  {activeItem.type === 'order' ? <ShoppingBag size={18} /> : <Info size={18} />}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#192D2A] dark:text-white">
                    {activeItem.title}
                  </h3>
                  <p className="text-[10px] text-[#716C65] dark:text-[#94A3B8]">
                    {new Date(activeItem.time).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#6B655D] dark:text-[#CBD5E1]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="rounded-xl bg-[#F7F4EE] dark:bg-[#0E1A17] p-4 text-xs sm:text-sm text-[#3E3A35] dark:text-[#CBD5E1] leading-relaxed">
                {activeItem.message}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    deleteNotification(activeItem.id);
                    setActiveItem(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 text-xs font-semibold transition"
                >
                  <Trash2 size={13} />
                  Delete Alert
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    to="/shop"
                    onClick={() => {
                      setActiveItem(null);
                      setIsOpen(false);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold transition shadow-xs"
                  >
                    Go To Shop
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveItem(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#DDD5C8] dark:border-[#2A443E] text-xs font-semibold hover:bg-[#F3EDE2] dark:hover:bg-[#1E302B] transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationCenter;
