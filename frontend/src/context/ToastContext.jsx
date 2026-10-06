import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div role="status" aria-live="polite" className={`fixed left-4 right-4 top-24 z-[100] flex items-start gap-3 rounded-2xl border p-4 shadow-2xl sm:left-auto sm:w-full sm:max-w-sm ${toast.type === 'error' ? 'border-red-400 bg-red-500' : toast.type === 'info' ? 'border-sky-400 bg-sky-600' : 'border-emerald-400 bg-emerald-600'}`}>
          <p className="min-w-0 flex-1 font-semibold text-white">{toast.message}</p>
          <button type="button" onClick={() => setToast(null)} className="rounded-full p-1 text-white/80 hover:bg-white/15 hover:text-white" aria-label="Dismiss notification">
            <X size={18} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

