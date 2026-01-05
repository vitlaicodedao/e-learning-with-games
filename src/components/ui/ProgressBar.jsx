const ProgressBar = ({ progress, className = '', color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden ${className}`}>
      <div 
        className={`h-full ${colors[color]} transition-all duration-500 ease-out rounded-full`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      >
      </div>
    </div>
  );
};

export default ProgressBar;
