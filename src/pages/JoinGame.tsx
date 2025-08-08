import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Users, Loader2 } from 'lucide-react';

console.log('JoinGame component loaded!');

const JoinGame = () => {
  console.log('JoinGame component rendering...');
  
  const [gameCode, setGameCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  console.log('About to render, current state:', { gameCode, displayName, loading });
  
  // Pre-fill game code from URL if provided
  const urlGameCode = searchParams.get('code');
  
  
  useEffect(() => {
    console.log('useEffect running...');
    try {
      const urlGameCode = searchParams.get('code');
      if (urlGameCode) {
        console.log('Setting game code from URL:', urlGameCode);
        setGameCode(urlGameCode.toUpperCase());
      }
      console.log('useEffect completed successfully');
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, [searchParams]);

  const handleJoinGame = async (e: React.FormEvent) => {
    console.log('=== handleJoinGame called ===');
    e.preventDefault();
    
    console.log('Join game clicked:', { gameCode: gameCode.trim(), displayName: displayName.trim() });
    
    if (!gameCode.trim() || !displayName.trim()) {
      console.log('Missing data - gameCode or displayName empty');
      toast({
        title: "Manjkajo podatki",
        description: "Vnesite kodo igre in vaše ime",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Searching for game with code:', gameCode.toUpperCase());
      // Find game by code
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', gameCode.toUpperCase())
        .eq('status', 'waiting')
        .single();

      console.log('Game search result:', { gameData, gameError });

      if (gameError || !gameData) {
        toast({
          title: "Napaka",
          description: "Igra s to kodo ne obstaja ali se je že začela",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Check if display name is already taken in this game
      console.log('Checking if display name exists:', displayName.trim());
      const { data: existingParticipant } = await supabase
        .from('game_participants')
        .select('*')
        .eq('game_id', gameData.id)
        .eq('display_name', displayName.trim())
        .single();

      console.log('Existing participant check:', existingParticipant);

      if (existingParticipant) {
        toast({
          title: "Ime že zasedeno",
          description: "To ime je že v uporabi v tej igri. Izberite drugo ime.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Join game as guest
      console.log('Attempting to join game as guest...');
      const { error: joinError } = await supabase
        .from('game_participants')
        .insert({
          game_id: gameData.id,
          user_id: null, // Guest player
          display_name: displayName.trim(),
          is_host: false
        });

      console.log('Join game result:', { joinError });

      if (joinError) {
        toast({
          title: "Napaka",
          description: "Napaka pri pridruževanju igri: " + joinError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Uspešno",
          description: "Pridružili ste se igri!",
        });
        
        // Store guest info in sessionStorage for the game
        sessionStorage.setItem('guestPlayer', JSON.stringify({
          gameId: gameData.id,
          displayName: displayName.trim()
        }));
        
        navigate(`/game/${gameData.id}`);
      }
    } catch (error) {
      console.error('Join game error:', error);
      toast({
        title: "Napaka",
        description: "Prišlo je do napake",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Users className="h-6 w-6" />
            Pridruži se igri
          </CardTitle>
          <CardDescription>
            Vnesite kodo igre in vaše ime za pridružitev
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinGame} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameCode">Koda igre</Label>
              <Input
                id="gameCode"
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="npr. ABC123"
                maxLength={6}
                required
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Vaše ime</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Vnesite vaše ime"
                maxLength={50}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              onClick={(e) => {
                console.log('=== BUTTON CLICKED ===');
                console.log('Event:', e);
                console.log('Form data:', { gameCode, displayName });
                handleJoinGame(e);
              }}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pridruži se igri
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Imate svoje igre?{' '}
              <Button variant="link" className="p-0" onClick={() => navigate('/auth')}>
                Prijavite se
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinGame;