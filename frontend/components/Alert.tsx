import { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export default function Alert({ children, type = 'info', onClose }: AlertProps) {
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ'
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start justify-between ${typeStyles[type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg font-bold">{icons[type]}</span>
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-xl font-bold ml-4 hover:opacity-50 transition"
        >
          ✕
        </button>
      )}
    </div>
  );
}
