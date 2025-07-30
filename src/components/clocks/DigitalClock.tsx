interface DigitalClockProps {
  timeLeft: number;
  totalTime: number;
  progress: number;
  isActive: boolean;
}

export const DigitalClock = ({ timeLeft, totalTime, progress, isActive }: DigitalClockProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* Progress Ring */}
      <div className="relative w-64 h-64 mx-auto">
        <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--muted))"
            strokeWidth="3"
            fill="none"
            className="opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: isActive ? 'drop-shadow(0 0 8px hsl(var(--primary) / 0.4))' : 'none'
            }}
          />
        </svg>
        
        {/* Digital Time Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div 
              className={`text-4xl md:text-5xl font-mono font-bold transition-all duration-300 ${
                isActive ? 'text-primary' : 'text-foreground'
              }`}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {Math.floor(timeLeft / 60)} minutes left
            </div>
          </div>
        </div>
      </div>
      
      {/* Pulse animation when active */}
      {isActive && (
        <div className="absolute inset-0 w-64 h-64 mx-auto rounded-full animate-pulse">
          <div className="w-full h-full rounded-full bg-primary/10"></div>
        </div>
      )}
    </div>
  );
};