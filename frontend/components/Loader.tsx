interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function Loader({ size = 'md', message }: LoaderProps) {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClass[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
}
