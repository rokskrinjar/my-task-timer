import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Clock, UserCheck } from 'lucide-react';

interface TimerModeToggleProps {
  hasTimer: boolean;
  onToggle: (hasTimer: boolean) => void;
  disabled?: boolean;
}

export const TimerModeToggle = ({ hasTimer, onToggle, disabled }: TimerModeToggleProps) => {
  return (
    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-card">
      <div className="flex items-center space-x-2">
        {hasTimer ? (
          <Clock className="h-4 w-4 text-primary" />
        ) : (
          <UserCheck className="h-4 w-4 text-primary" />
        )}
        <Label htmlFor="timer-mode" className="text-sm font-medium">
          {hasTimer ? 'Vprašanja s časovnim omejevanjem' : 'Vprašanja brez časovnega omejevanja'}
        </Label>
      </div>
      <Switch
        id="timer-mode"
        checked={hasTimer}
        onCheckedChange={onToggle}
        disabled={disabled}
      />
    </div>
  );
};