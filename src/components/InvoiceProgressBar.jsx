// InvoiceProgressBar component to display the progress
const InvoiceProgressBar = ({ progress, status, stages = [] }) => {
  // Ensure progress is within 0-100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // Determine color based on status or progress
  const progressBarColor = () => {
    if (status.toLowerCase().includes('overdue')) return 'bg-red-500';
    if (status.toLowerCase().includes('paid') && clampedProgress === 100) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <div className="w-full">
      {/* Progress bar container */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-in-out ${progressBarColor()}`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      {/* Progress percentage and status label */}
      <div className="flex justify-between items-center mb-4 text-sm font-medium text-gray-700">
        <span>{status}</span>
        <span>{clampedProgress}% Complete</span>
      </div>

      {/* Optional stage markers */}
      {stages.length > 0 && (
        <div className="relative w-full flex justify-between mt-6">
          {stages.map((stage, index) => {
            // Calculate the position of each stage
            const stageProgress = (index / (stages.length - 1)) * 100;
            // Determine if the stage is completed
            const isCompleted = clampedProgress >= stageProgress;

            return (
              <div
                key={stage}
                className="flex flex-col items-center flex-1 text-center"
                style={{
                  left: `${stageProgress}%`,
                  transform: 'translateX(-50%)', // Adjust for centering
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300
                    ${isCompleted ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}
                    ${status.toLowerCase().includes('overdue') && !isCompleted ? 'bg-red-300' : ''}
                    ${status.toLowerCase().includes('paid') && isCompleted ? 'bg-green-500' : ''}
                  `}
                >
                  {isCompleted && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs sm:text-sm whitespace-nowrap
                    ${isCompleted ? 'font-semibold text-gray-800' : 'text-gray-500'}
                    ${status.toLowerCase().includes('overdue') && !isCompleted ? 'text-red-600' : ''}
                    ${status.toLowerCase().includes('paid') && isCompleted ? 'text-green-600' : ''}
                  `}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InvoiceProgressBar;