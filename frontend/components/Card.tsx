import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: string;
}

export default function Card({ children, className = '', title, icon }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <span className="text-3xl">{icon}</span>}
          {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
        </div>
      )}
      {children}
    </div>
  );
}
