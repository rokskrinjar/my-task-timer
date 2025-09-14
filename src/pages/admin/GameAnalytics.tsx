import React from 'react';
import { AdminRoute } from '@/components/AdminRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, TrendingUp, Users, Clock, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const GameAnalytics = () => {
  const { data: gameStats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-game-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: questionStats, isLoading: questionStatsLoading } = useQuery({
    queryKey: ['admin-question-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_usage')
        .select(`
          usage_count,
          question_id,
          last_used_at,
          created_at,
          updated_at
        `)
        .order('usage_count', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sl-SI');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary">Waiting</Badge>;
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'finished':
        return <Badge variant="outline">Finished</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalGames = gameStats?.length || 0;
  const finishedGames = gameStats?.filter(g => g.status === 'finished').length || 0;
  const activeGames = gameStats?.filter(g => g.status === 'active').length || 0;
  const waitingGames = gameStats?.filter(g => g.status === 'waiting').length || 0;

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Admin
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-foreground">Game Analytics</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Games</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalGames}</div>
                <p className="text-xs text-muted-foreground">
                  All time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Games</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeGames}</div>
                <p className="text-xs text-muted-foreground">
                  Currently playing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waiting Games</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{waitingGames}</div>
                <p className="text-xs text-muted-foreground">
                  Waiting for players
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Games</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{finishedGames}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully finished
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Games</CardTitle>
                <CardDescription>Latest game activity</CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="text-center py-4">Loading games...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Game Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gameStats?.slice(0, 8).map((game) => (
                        <TableRow key={game.id}>
                          <TableCell className="font-mono">{game.game_code}</TableCell>
                          <TableCell>{getStatusBadge(game.status)}</TableCell>
                          <TableCell>{game.category}</TableCell>
                          <TableCell>{formatDate(game.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Questions</CardTitle>
                <CardDescription>Most frequently used questions</CardDescription>
              </CardHeader>
              <CardContent>
                {questionStatsLoading ? (
                  <div className="text-center py-4">Loading question stats...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Usage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questionStats?.map((stat) => (
                        <TableRow key={stat.question_id}>
                          <TableCell className="max-w-xs">
                            <div className="truncate">
                              Question ID: {stat.question_id.slice(0, 8)}...
                            </div>
                          </TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>
                            <Badge variant="secondary">-</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{stat.usage_count}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
};

export default GameAnalytics;