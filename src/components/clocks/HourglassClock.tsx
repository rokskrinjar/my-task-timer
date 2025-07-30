interface HourglassClockProps {
  timeLeft: number;
  totalTime: number;
  progress: number;
  isActive: boolean;
}

export const HourglassClock = ({ timeLeft, totalTime, progress, isActive }: HourglassClockProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate sand levels
  const topSandHeight = (progress / 100) * 60; // Max height of 60
  const bottomSandHeight = ((100 - progress) / 100) * 60;

  return (
    <div className="relative">
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        <svg className="w-48 h-56" viewBox="0 0 120 140">
          {/* Hourglass outline */}
          <path
            d="M20 10 L100 10 L100 20 L90 20 L65 45 L65 50 L90 75 L100 75 L100 85 L20 85 L20 75 L30 75 L55 50 L55 45 L30 20 L20 20 Z"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Top frame */}
          <rect
            x="15"
            y="5"
            width="90"
            height="10"
            fill="hsl(var(--foreground))"
            rx="2"
          />
          
          {/* Bottom frame */}
          <rect
            x="15"
            y="85"
            width="90"
            height="10"
            fill="hsl(var(--foreground))"
            rx="2"
          />
          
          {/* Top sand (remaining time) */}
          <defs>
            <clipPath id="topSand">
              <path d="M25 15 L95 15 L95 20 L85 20 L60 45 L60 50 L50 50 L50 45 L25 20 Z" />
            </clipPath>
          </defs>
          
          <rect
            x="25"
            y={15 + topSandHeight}
            width="70"
            height={60 - topSandHeight}
            fill="hsl(var(--primary))"
            clipPath="url(#topSand)"
            className="transition-all duration-1000 ease-linear"
            style={{
              filter: isActive ? 'drop-shadow(0 0 4px hsl(var(--primary) / 0.3))' : 'none'
            }}
          />
          
          {/* Bottom sand (elapsed time) */}
          <defs>
            <clipPath id="bottomSand">
              <path d="M25 50 L60 50 L60 55 L85 80 L95 80 L95 85 L25 85 Z" />
            </clipPath>
          </defs>
          
          <rect
            x="25"
            y={85 - bottomSandHeight}
            width="70"
            height={bottomSandHeight}
            fill="hsl(var(--muted))"
            clipPath="url(#bottomSand)"
            className="transition-all duration-1000 ease-linear"
          />
          
          {/* Falling sand particles (when active) */}
          {isActive && (
            <g>
              {Array.from({ length: 3 }, (_, i) => (
                <circle
                  key={i}
                  cx="60"
                  cy="52"
                  r="1"
                  fill="hsl(var(--primary))"
                  className="animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </g>
          )}
          
          {/* Center constraint */}
          <path
            d="M55 45 L65 45 L65 55 L55 55 Z"
            fill="hsl(var(--background))"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
        </svg>
        
        {/* Digital time display */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className={`px-4 py-2 rounded-lg bg-background/90 backdrop-blur border text-center ${
            isActive ? 'text-primary' : 'text-foreground'
          }`}>
            <div className="text-2xl font-mono font-bold">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.floor(timeLeft / 60)} min left
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle glow when active */}
      {isActive && (
        <div className="absolute inset-0 w-64 h-64 mx-auto">
          <div className="w-full h-full rounded-full bg-primary/5 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};