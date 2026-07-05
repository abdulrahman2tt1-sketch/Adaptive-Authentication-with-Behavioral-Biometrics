function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} border-4 border-secondary border-t-primary rounded-full animate-spin`}
      />
    </div>
  );
}

export default LoadingSpinner;
