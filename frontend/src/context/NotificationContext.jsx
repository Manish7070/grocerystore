import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const getStorageKey = () => (user ? `td_notifications_${user._id || user.email}` : 'td_notifications_guest');

  // Load notifications for current user or default welcome notifications
  useEffect(() => {
    const key = getStorageKey();
    let stored = [];
    try {
      const raw = localStorage.getItem(key);
      if (raw) stored = JSON.parse(raw);
    } catch {
      stored = [];
    }

    if (!stored || stored.length === 0) {
      // Default initial welcome notifications based on role
      const initial = [
        {
          id: 'notif-welcome-1',
          title: 'Welcome to TaazaDaily Grocery Hub',
          message: 'Real-time farmgate produce and 10–15 min hyperlocal deliveries active.',
          time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: false,
          type: 'system',
        },
        {
          id: 'notif-welcome-2',
          title: '300m–500m Hyperlocal Express Active',
          message: 'Nearby partner shops and orchards are currently accepting doorstep delivery orders.',
          time: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          read: false,
          type: 'order',
        },
      ];
      stored = initial;
      try {
        localStorage.setItem(key, JSON.stringify(stored));
      } catch {}
    }

    setNotifications(stored);
    setUnreadCount(stored.filter((n) => !n.read).length);
  }, [user]);

  const addNotification = (item) => {
    const key = getStorageKey();
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      time: new Date().toISOString(),
      read: false,
      ...item,
    };
    setNotifications((prev) => {
      const next = [newNotif, ...prev].slice(0, 30);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
    setUnreadCount((c) => c + 1);
  };

  const markAsRead = (id) => {
    const key = getStorageKey();
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      setUnreadCount(next.filter((n) => !n.read).length);
      return next;
    });
  };

  const deleteNotification = (id) => {
    const key = getStorageKey();
    setNotifications((prev) => {
      const next = prev.filter((n) => n.id !== id);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      setUnreadCount(next.filter((n) => !n.read).length);
      return next;
    });
  };

  const markAllAsRead = () => {
    const key = getStorageKey();
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      setUnreadCount(0);
      return next;
    });
  };

  const clearAll = () => {
    const key = getStorageKey();
    setNotifications([]);
    setUnreadCount(0);
    try {
      localStorage.removeItem(key);
    } catch {}
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      notifications: [],
      unreadCount: 0,
      addNotification: () => {},
      markAsRead: () => {},
      markAllAsRead: () => {},
      deleteNotification: () => {},
      clearAll: () => {},
    };
  }
  return context;
};
