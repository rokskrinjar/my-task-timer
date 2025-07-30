interface AnalogClockProps {
  timeLeft: number;
  totalTime: number;
  progress: number;
  isActive: boolean;
}

export const AnalogClock = ({ timeLeft, totalTime, progress, isActive }: AnalogClockProps) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Calculate angles for clock hands
  const minuteAngle = ((totalTime / 60 - minutes) / (totalTime / 60)) * 360;
  const secondAngle = (60 - seconds) / 60 * 360;

  return (
    <div className="relative">
      <div className="relative w-64 h-64 mx-auto">
        <svg className="w-64 h-64" viewBox="0 0 200 200">
          {/* Outer rim */}
          <circle
            cx="100"
            cy="100"
            r="95"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            fill="hsl(var(--background))"
          />
          
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-out transform -rotate-90"
            style={{
              transformOrigin: '100px 100px',
              filter: isActive ? 'drop-shadow(0 0 8px hsl(var(--primary) / 0.4))' : 'none'
            }}
          />
          
          {/* Hour markers */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x1 = 100 + 80 * Math.cos(angle - Math.PI / 2);
            const y1 = 100 + 80 * Math.sin(angle - Math.PI / 2);
            const x2 = 100 + 85 * Math.cos(angle - Math.PI / 2);
            const y2 = 100 + 85 * Math.sin(angle - Math.PI / 2);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
              />
            );
          })}
          
          {/* Minute markers */}
          {Array.from({ length: 60 }, (_, i) => {
            if (i % 5 !== 0) {
              const angle = (i * 6) * (Math.PI / 180);
              const x1 = 100 + 82 * Math.cos(angle - Math.PI / 2);
              const y1 = 100 + 82 * Math.sin(angle - Math.PI / 2);
              const x2 = 100 + 85 * Math.cos(angle - Math.PI / 2);
              const y2 = 100 + 85 * Math.sin(angle - Math.PI / 2);
              
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="1"
                  opacity="0.5"
                />
              );
            }
            return null;
          })}
          
          {/* Minute hand */}
          <line
            x1="100"
            y1="100"
            x2={100 + 60 * Math.cos((minuteAngle - 90) * (Math.PI / 180))}
            y2={100 + 60 * Math.sin((minuteAngle - 90) * (Math.PI / 180))}
            stroke="hsl(var(--foreground))"
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Second hand */}
          <line
            x1="100"
            y1="100"
            x2={100 + 65 * Math.cos((secondAngle - 90) * (Math.PI / 180))}
            y2={100 + 65 * Math.sin((secondAngle - 90) * (Math.PI / 180))}
            stroke="hsl(var(--destructive))"
            strokeWidth="2"
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
          
          {/* Center dot */}
          <circle
            cx="100"
            cy="100"
            r="4"
            fill="hsl(var(--foreground))"
          />
        </svg>
        
        {/* Digital time overlay */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <div className={`px-3 py-1 rounded-lg bg-background/80 backdrop-blur border text-sm font-mono ${
            isActive ? 'text-primary' : 'text-foreground'
          }`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
};