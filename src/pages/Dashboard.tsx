import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGameData } from '@/hooks/useGameData';
import RecentGames from '@/components/RecentGames';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Users, LogOut, Trophy, Shield } from 'lucide-react';

interface Game {
  id: string;
  game_code: string;
  status: string;
  host_id: string;
  created_at: string;
  participant_count?: number;
}

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Šola');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use optimized game data hook
  const { myGames, gamesLoading, invalidateGames } = useGameData();

  const categories = [
    'Šola',
    'Geografija', 
    'Živali',
    'Friends Trivia',
    'Music',
    'Movies',
    'High School',
    'Sports'
  ];

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
        status: 'waiting',
        category: selectedCategory
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
      
      // Invalidate games cache to refresh the list
      invalidateGames();
      
      navigate(`/game/${gameData.id}`);
    }
    
    setLoading(false);
  };

  const joinGame = async () => {
    console.log('=== Dashboard joinGame called ===', { gameCode, playerName, user });
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
        <div className="container flex h-14 items-center justify-between px-4 overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <h1 className="text-base sm:text-xl font-bold truncate">Kdo naredi osnovno šolo</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-4 min-w-0">
            <span className="text-sm text-muted-foreground">
              Pozdravljen, {user?.user_metadata?.display_name || user?.email}
            </span>
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin')}
                className="text-orange-600 border-orange-600 hover:bg-orange-50"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Odjava
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-4 sm:py-8 px-4 max-w-full overflow-hidden">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-full">
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategorija vprašanj</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Izberite kategorijo" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                inputMode="text"
                placeholder="Koda igre (npr. ABCDEF)"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="uppercase"
              />
              <Input
                placeholder="Vaše ime v igri"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={50}
              />
              <Button 
                onClick={() => {
                  console.log('Dashboard join button clicked!', { gameCode, playerName });
                  joinGame();
                }} 
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
              <div className="text-2xl font-bold">{gamesLoading ? '...' : myGames.length}</div>
              <p className="text-sm text-muted-foreground">Skupno iger</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Games */}
        {gamesLoading ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Nedavne igre</h2>
            <div className="grid gap-4 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-full">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Nedavne igre</h2>
            <RecentGames games={myGames} isLoading={gamesLoading} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;