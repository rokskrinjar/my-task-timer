import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Maximize, Minimize } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AnalogClock } from './clocks/AnalogClock';
import { DigitalClock } from './clocks/DigitalClock';
import { HourglassClock } from './clocks/HourglassClock';

type ClockType = 'analog' | 'digital' | 'hourglass';

const PRESET_TIMES = [5, 10, 15, 20, 25, 30];

export const Timer = () => {
  const { user } = useAuth();
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [clockType, setClockType] = useState<ClockType>('digital');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fullscreenRef = useRef<HTMLDivElement | null>(null);
  const hideControlsTimeoutRef = useRef<number | null>(null);

  // Play progress sounds
  useEffect(() => {
    const originalTime = selectedMinutes * 60;
    const elapsed = originalTime - timeLeft;
    
    if (isActive && elapsed > 0) {
      if (elapsed % 300 === 0) { // Every 5 minutes
        playCalmProgressSound();
      } else if (elapsed % 60 === 0) { // Every 1 minute
        playMinuteProgressSound();
      }
    }
  }, [timeLeft, isActive, selectedMinutes]);

  // Timer countdown logic
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            playCompletionSound();
            saveSession(false); // Not interrupted
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle mouse activity for auto-hiding controls in fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    const handleMouseMove = () => {
      setShowControls(true);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      hideControlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000); // Hide after 3 seconds of inactivity
    };

    const handleMouseLeave = () => {
      setShowControls(false);
    };

    if (fullscreenRef.current) {
      fullscreenRef.current.addEventListener('mousemove', handleMouseMove);
      fullscreenRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    // Initial timeout
    hideControlsTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => {
      if (fullscreenRef.current) {
        fullscreenRef.current.removeEventListener('mousemove', handleMouseMove);
        fullscreenRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [isFullscreen]);

  const toggleFullscreen = async () => {
    if (!fullscreenRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        await fullscreenRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const playMinuteProgressSound = () => {
    // Message notification sound - quick, bright, attention-getting
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Quick notification beep followed by gentle chime
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    const gainNode2 = audioContext.createGain();
    
    oscillator1.connect(gainNode1);
    oscillator2.connect(gainNode2);
    gainNode1.connect(audioContext.destination);
    gainNode2.connect(audioContext.destination);
    
    // First beep - attention grabber
    oscillator1.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator1.type = 'sine';
    gainNode1.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode1.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.02);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    oscillator1.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.15);
    
    // Second tone - pleasant confirmation
    oscillator2.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    oscillator2.type = 'sine';
    gainNode2.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
    gainNode2.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.12);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
    oscillator2.start(audioContext.currentTime + 0.1);
    oscillator2.stop(audioContext.currentTime + 0.25);
    
    toast("Another minute focused! 💪");
  };

  const playCalmProgressSound = () => {
    // Slot machine mid-prize sound - satisfying coin cascade
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create multiple coin drop sounds with slight timing variations
    const coinSounds = 8;
    for (let i = 0; i < coinSounds; i++) {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Random frequency for coin variety (metallic sound range)
        const baseFreq = 1000 + Math.random() * 500;
        oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, audioContext.currentTime + 0.1);
        oscillator.type = 'triangle'; // More metallic sound
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }, i * 50 + Math.random() * 30); // Staggered timing with randomness
    }
    
    // Add a satisfying bell at the end
    setTimeout(() => {
      const bellOsc = audioContext.createOscillator();
      const bellGain = audioContext.createGain();
      
      bellOsc.connect(bellGain);
      bellGain.connect(audioContext.destination);
      
      bellOsc.frequency.setValueAtTime(1200, audioContext.currentTime);
      bellOsc.type = 'sine';
      
      bellGain.gain.setValueAtTime(0, audioContext.currentTime);
      bellGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
      bellGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      bellOsc.start(audioContext.currentTime);
      bellOsc.stop(audioContext.currentTime + 0.8);
    }, 400);
    
    toast("🎰 5 minutes milestone! You're on fire! 🔥");
  };

  const playCompletionSound = () => {
    // Play a completion melody
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }, index * 200);
    });
    
    toast("🎉 Focus session completed! Great work!");
  };

  const saveSession = async (wasInterrupted: boolean) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.from('focus_sessions').insert({
        user_id: user.id,
        duration_minutes: selectedMinutes,
        was_interrupted: wasInterrupted
      });
      
      if (error) throw error;
      
      if (!wasInterrupted) {
        toast("Session saved to your progress!");
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(selectedMinutes * 60);
    
    if (user && timeLeft !== selectedMinutes * 60) {
      saveSession(true); // Was interrupted
    }
  };

  const selectTime = (minutes: number) => {
    if (!isActive) {
      setSelectedMinutes(minutes);
      setTimeLeft(minutes * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedMinutes * 60 - timeLeft) / (selectedMinutes * 60)) * 100;

  const renderClock = () => {
    const props = {
      timeLeft,
      totalTime: selectedMinutes * 60,
      progress,
      isActive
    };

    switch (clockType) {
      case 'analog':
        return <AnalogClock {...props} />;
      case 'digital':
        return <DigitalClock {...props} />;
      case 'hourglass':
        return <HourglassClock {...props} />;
      default:
        return <DigitalClock {...props} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Timer Presets */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Choose Focus Time</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {PRESET_TIMES.map((minutes) => (
            <Button
              key={minutes}
              variant={selectedMinutes === minutes ? "default" : "outline"}
              onClick={() => selectTime(minutes)}
              disabled={isActive}
              className="h-12"
            >
              {minutes}m
            </Button>
          ))}
        </div>
      </Card>

      {/* Clock Type Selector */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Clock Style</h3>
        <div className="flex gap-3">
          <Button
            variant={clockType === 'digital' ? "default" : "outline"}
            onClick={() => setClockType('digital')}
          >
            Digital
          </Button>
          <Button
            variant={clockType === 'analog' ? "default" : "outline"}
            onClick={() => setClockType('analog')}
          >
            Analog
          </Button>
          <Button
            variant={clockType === 'hourglass' ? "default" : "outline"}
            onClick={() => setClockType('hourglass')}
          >
            Hourglass
          </Button>
        </div>
      </Card>

      {/* Main Timer Display */}
      <div 
        ref={fullscreenRef}
        className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background flex items-center justify-center' : ''}`}
      >
        {isFullscreen && (
          <>
            {/* Fullscreen Toggle Button - Top Right */}
            <div className={`fixed top-4 right-4 z-60 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <Button
                onClick={toggleFullscreen}
                size="sm"
                variant="outline"
                className="bg-background/80 backdrop-blur"
              >
                <Minimize className="w-4 h-4 mr-2" />
                Exit Fullscreen
              </Button>
            </div>

            {/* Control Buttons - Bottom Corners */}
            <div className={`fixed bottom-8 left-8 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              {!isActive ? (
                <Button onClick={startTimer} size="lg" className="px-8 bg-background/80 backdrop-blur">
                  <Play className="w-5 h-5 mr-2" />
                  Start Focus
                </Button>
              ) : (
                <Button onClick={pauseTimer} size="lg" variant="outline" className="px-8 bg-background/80 backdrop-blur">
                  <Pause className="w-5 h-5 mr-2" />
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
              )}
            </div>

            <div className={`fixed bottom-8 right-8 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <Button onClick={resetTimer} size="lg" variant="destructive" className="px-8 bg-background/80 backdrop-blur">
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>
          </>
        )}

        <Card className={`${isFullscreen ? 'border-none shadow-none bg-transparent' : 'p-8'}`}>
          <div className="text-center space-y-6">
            {!isFullscreen && (
              <>
                {/* Fullscreen Toggle Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={toggleFullscreen}
                    size="sm"
                    variant="outline"
                    className="mb-4"
                  >
                    <Maximize className="w-4 h-4 mr-2" />
                    Fullscreen
                  </Button>
                </div>
              </>
            )}

            <div className={isFullscreen ? 'scale-150' : ''}>
              {renderClock()}
            </div>
            
            {!isFullscreen && (
              <>
                {/* Control Buttons */}
                <div className="flex justify-center gap-4">
                  {!isActive ? (
                    <Button onClick={startTimer} size="lg" className="px-8">
                      <Play className="w-5 h-5 mr-2" />
                      Start Focus
                    </Button>
                  ) : (
                    <Button onClick={pauseTimer} size="lg" variant="outline" className="px-8">
                      <Pause className="w-5 h-5 mr-2" />
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                  )}
                  
                  <Button onClick={resetTimer} size="lg" variant="destructive" className="px-8">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>
                
                {user && (
                  <p className="text-sm text-muted-foreground">
                    Your progress is being tracked! Complete sessions without interruption to build your focus streak.
                  </p>
                )}
                
                {!user && (
                  <p className="text-sm text-muted-foreground">
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Sign in
                    </Button> to track your progress and build focus streaks!
                  </p>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};