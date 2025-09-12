import { Trophy, Medal, Award } from 'lucide-react';

interface GameParticipant {
  id: string;
  display_name: string;
  current_score: number;
  user_id?: string;
}

interface PodiumProps {
  participants: GameParticipant[];
}

export const Podium = ({ participants }: PodiumProps) => {
  const topThree = participants.slice(0, 3);
  
  if (topThree.length === 0) {
    return <div className="text-muted-foreground text-sm">Ni rezultatov</div>;
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPodiumHeight = (position: number) => {
    switch (position) {
      case 1:
        return 'h-16';
      case 2:
        return 'h-12';
      case 3:
        return 'h-8';
      default:
        return 'h-6';
    }
  };

  const getPodiumColors = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-t from-yellow-400 to-yellow-300 border-yellow-500';
      case 2:
        return 'bg-gradient-to-t from-gray-300 to-gray-200 border-gray-400';
      case 3:
        return 'bg-gradient-to-t from-amber-400 to-amber-300 border-amber-500';
      default:
        return 'bg-gradient-to-t from-muted to-muted border-border';
    }
  };

  // Arrange for visual podium (2nd, 1st, 3rd)
  const arrangedParticipants = [
    topThree[1], // 2nd place on left
    topThree[0], // 1st place in center
    topThree[2], // 3rd place on right
  ].filter(Boolean);

  const getPositionForArranged = (index: number) => {
    if (index === 0) return 2; // left position is 2nd
    if (index === 1) return 1; // center position is 1st
    if (index === 2) return 3; // right position is 3rd
    return index + 1;
  };

  return (
    <div className="flex items-end justify-center gap-2 mt-3">
      {arrangedParticipants.map((participant, index) => {
        const position = getPositionForArranged(index);
        const actualPosition = topThree.findIndex(p => p?.id === participant?.id) + 1;
        
        return (
          <div key={participant?.id} className="flex flex-col items-center">
            {/* Player info */}
            <div className="flex flex-col items-center mb-2">
              {getPositionIcon(actualPosition)}
              <span className="text-xs font-medium text-center max-w-[60px] truncate">
                {participant?.display_name || 'Neznan'}
              </span>
              <span className="text-xs text-muted-foreground">
                {participant?.current_score || 0} točk
              </span>
            </div>
            
            {/* Podium step */}
            <div 
              className={`
                w-16 ${getPodiumHeight(actualPosition)} 
                ${getPodiumColors(actualPosition)}
                border-2 rounded-t-lg
                flex items-center justify-center
                font-bold text-sm
                ${actualPosition === 1 ? 'shadow-lg' : 'shadow-md'}
              `}
            >
              {actualPosition}
            </div>
          </div>
        );
      })}
    </div>
  );
};