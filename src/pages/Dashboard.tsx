import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Users, LogOut, Trophy } from 'lucide-react';

interface Game {
  id: string;
  game_code: string;
  status: string;
  host_id: string;
  created_at: string;
  participant_count?: number;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [myGames, setMyGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMyGames();
    }
  }, [user]);

  const fetchMyGames = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        game_participants!inner(count)
      `)
      .or(`host_id.eq.${user.id},game_participants.user_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching games:', error);
    } else {
      setMyGames(data || []);
    }
  };

  const createGame = async () => {
    console.log('createGame called, user:', user);
    if (!user) return;
    
    setLoading(true);
    
    // Generate game code
    console.log('Generating game code...');
    const { data: codeData, error: codeError } = await supabase
      .rpc('generate_game_code');
    
    console.log('Game code result:', { codeData, codeError });
    if (codeError) {
      toast({
        title: "Napaka",
        description: "Napaka pri ustvarjanju kode igre",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Create game
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .insert({
        host_id: user.id,
        game_code: codeData,
        status: 'waiting'
      })
      .select()
      .single();

    if (gameError) {
      toast({
        title: "Napaka",
        description: "Napaka pri ustvarjanju igre",
        variant: "destructive",
      });
    } else {
      // Add host as participant with their profile name
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();

      await supabase
        .from('game_participants')
        .insert({
          game_id: gameData.id,
          user_id: user.id,
          display_name: profileData?.display_name || 'Gostitelj',
          is_host: true
        });

      toast({
        title: "Igra ustvarjena",
        description: `Koda igre: ${codeData}`,
      });
      
      navigate(`/game/${gameData.id}`);
    }
    
    setLoading(false);
  };

  const joinGame = async () => {
    if (!user || !gameCode.trim() || !playerName.trim()) return;
    
    setLoading(true);
    
    // Find game by code
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('game_code', gameCode.toUpperCase())
      .eq('status', 'waiting')
      .single();

    if (gameError || !gameData) {
      toast({
        title: "Napaka",
        description: "Igra s to kodo ne obstaja ali se je že začela",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Check if player name is already taken in this game
    const { data: existingParticipant } = await supabase
      .from('game_participants')
      .select('*')
      .eq('game_id', gameData.id)
      .or(`display_name.eq.${playerName.trim()},user_id.eq.${user.id}`)
      .single();

    if (existingParticipant) {
      if (existingParticipant.user_id === user.id) {
        // User already in game
        navigate(`/game/${gameData.id}`);
        setLoading(false);
        return;
      } else {
        // Display name taken
        toast({
          title: "Ime zasedeno",
          description: "To ime je že v uporabi v tej igri. Izberite drugo ime.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    // Join game
    const { error: joinError } = await supabase
      .from('game_participants')
      .insert({
        game_id: gameData.id,
        user_id: user.id,
        display_name: playerName.trim(),
        is_host: false
      });

    if (joinError) {
      toast({
        title: "Napaka",
        description: "Napaka pri pridruževanju igri",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Uspešno",
        description: "Pridružili ste se igri",
      });
      
      navigate(`/game/${gameData.id}`);
    }
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Kdo naredi osnovno šolo</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Pozdravljen, {user?.user_metadata?.display_name || user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Odjava
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Create Game */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Ustvari novo igro
              </CardTitle>
              <CardDescription>
                Ustvarite novo igro in povabite prijatelje
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => {
                  console.log('Create game button clicked');
                  createGame();
                }} 
                disabled={loading}
                className="w-full"
              >
                Ustvari igro
              </Button>
            </CardContent>
          </Card>

          {/* Join Game */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pridruži se igri
              </CardTitle>
              <CardDescription>
                Vnesite kodo igre in vaše ime za pridružitev
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Koda igre"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <Input
                placeholder="Vaše ime v igri"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={50}
              />
              <Button 
                onClick={joinGame} 
                disabled={loading || !gameCode.trim() || !playerName.trim()}
                className="w-full"
              >
                Pridruži se
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Vaše statistike
              </CardTitle>
              <CardDescription>
                Pregled vaših iger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myGames.length}</div>
              <p className="text-sm text-muted-foreground">Skupno iger</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Games */}
        {myGames.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Nedavne igre</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myGames.slice(0, 6).map((game) => (
                <Card key={game.id} className="cursor-pointer hover:bg-accent">
                  <CardHeader>
                    <CardTitle className="text-lg">Koda: {game.game_code}</CardTitle>
                    <CardDescription>
                      Status: {game.status === 'waiting' ? 'Čaka' : game.status === 'active' ? 'Aktivna' : 'Končana'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {new Date(game.created_at).toLocaleDateString('sl-SI')}
                    </p>
                    {game.status === 'waiting' && (
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => navigate(`/game/${game.id}`)}
                      >
                        Odpri igro
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;