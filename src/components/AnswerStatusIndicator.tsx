import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';

interface Participant {
  id: string;
  display_name?: string;
  user_id: string | null;
}

interface AnswerStatusIndicatorProps {
  participants: Participant[];
  answeredParticipants: string[];
}

export const AnswerStatusIndicator = ({ participants, answeredParticipants }: AnswerStatusIndicatorProps) => {
  const allAnswered = participants.length > 0 && answeredParticipants.length >= participants.length;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">Status odgovorov:</h3>
        <Badge variant={allAnswered ? "default" : "secondary"}>
          {answeredParticipants.length} / {participants.length}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {participants.map((participant) => {
          const hasAnswered = answeredParticipants.includes(participant.id);
          return (
            <div key={participant.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
              {hasAnswered ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-orange-500" />
              )}
              <span className="text-sm">
                {participant.display_name || 'Neznani igralec'}
              </span>
              <Badge variant={hasAnswered ? "default" : "secondary"} className="ml-auto text-xs">
                {hasAnswered ? 'Odgovoril' : 'Čaka'}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};